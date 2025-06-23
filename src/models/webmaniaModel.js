const connection = require('./connection');

const organizeData = (rows) => {
    const result = {};

    for (const row of rows) {
        if (!result[row.nfe_id]) {
            result[row.nfe_id] = {
                nfe_id: row.nfe_id,
                url_notificacao: row.url_notificacao,
                operacao: row.operacao,
                natureza_operacao: row.natureza_operacao,
                modelo: row.modelo,
                finalidade: row.finalidade,
                ambiente: row.ambiente,
                cliente: {
                    cliente_id: row.cliente_id,
                    cpf: row.cpf,
                    nome_completo: row.nome_completo,
                    endereco: row.endereco,
                    complemento: row.complemento,
                    numero: row.numero,
                    bairro: row.bairro,
                    cidade: row.cidade,
                    uf: row.uf,
                    cep: row.cep,
                    telefone: row.telefone,
                    email: row.email
                },
                produtos: [],
                pedido: {
                    pedido_id: row.pedido_id,
                    pagamento: row.pagamento,
                    presenca: row.presenca,
                    modalidade_frete: row.modalidade_frete,
                    frete: row.frete,
                    desconto: row.desconto,
                    total: row.total
                },
                resposta: {
                    resposta_id: row.resposta_id,
                    uuid: row.uuid,
                    status: row.status,
                    motivo: row.motivo,
                    nfe_numero: row.nfe_numero,
                    serie: row.serie,
                    modelo: row.modelo,
                    recibo: row.recibo,
                    chave: row.chave,
                    xml: row.xml,
                    danfe: row.danfe,
                    danfe_simples: row.danfe_simples,
                    danfe_etiqueta: row.danfe_etiqueta,
                    log: row.log
                }
            };
        }

        result[row.nfe_id].produtos.push({
            produto_id: row.produto_id,
            nome: row.nome,
            codigo: row.codigo,
            ncm: row.ncm,
            cest: row.cest,
            quantidade: row.quantidade,
            unidade: row.unidade,
            peso: row.peso,
            origem: row.origem,
            subtotal: row.subtotal,
            total: row.total,
            classe_imposto: row.classe_imposto
        });
    }

    return Object.values(result);
};

const getAllNFE = async (usuarioLogado) => {
    const query = `
        SELECT 
            nfe.id AS nfe_id, 
            nfe.url_notificacao, 
            nfe.operacao, 
            nfe.natureza_operacao, 
            nfe.modelo, 
            nfe.finalidade, 
            nfe.ambiente,
            cliente_nfe.id AS cliente_id, cliente_nfe.cpf, cliente_nfe.nome_completo, cliente_nfe.endereco,
        produtos_nfe.id AS produto_id, produtos_nfe.nome, produtos_nfe.codigo, produtos_nfe.ncm,
        pedido_nfe.id AS pedido_id, pedido_nfe.pagamento, pedido_nfe.presenca, pedido_nfe.modalidade_frete,
        resposta_nfe.id AS resposta_id, resposta_nfe.uuid, resposta_nfe.status, resposta_nfe.motivo
        
        FROM nfe
        LEFT JOIN cliente_nfe ON nfe.id = cliente_nfe.nfe_id
        LEFT JOIN produtos_nfe ON nfe.id = produtos_nfe.nfe_id
        LEFT JOIN pedido_nfe ON nfe.id = pedido_nfe.nfe_id
        LEFT JOIN resposta_nfe ON nfe.id = resposta_nfe.nfe_id
        WHERE nfe.empresa_id = ?;
    `;

    const [rows] = await connection.execute(query, [usuarioLogado.empresa_id]);
    return organizeData(rows);
};


const getNFE = async (nfeId, usuarioLogado) => {
    const query = `
        SELECT 
        nfe.id AS nfe_id, nfe.url_notificacao, nfe.operacao, nfe.natureza_operacao, nfe.modelo, nfe.finalidade, nfe.ambiente,
        cliente_nfe.id AS cliente_id, cliente_nfe.cpf, cliente_nfe.nome_completo, cliente_nfe.endereco, cliente_nfe.complemento, cliente_nfe.numero, cliente_nfe.bairro, cliente_nfe.cidade, cliente_nfe.uf, cliente_nfe.cep, cliente_nfe.telefone, cliente_nfe.email,
        produtos_nfe.id AS produto_id, produtos_nfe.nome, produtos_nfe.codigo, produtos_nfe.ncm, produtos_nfe.cest, produtos_nfe.quantidade, produtos_nfe.unidade, produtos_nfe.peso, produtos_nfe.origem, produtos_nfe.subtotal, produtos_nfe.total, produtos_nfe.classe_imposto,
        pedido_nfe.id AS pedido_id, pedido_nfe.pagamento, pedido_nfe.presenca, pedido_nfe.modalidade_frete, pedido_nfe.frete, pedido_nfe.desconto, pedido_nfe.total,
        resposta_nfe.id AS resposta_id, resposta_nfe.uuid, resposta_nfe.status, resposta_nfe.motivo
        FROM nfe
        LEFT JOIN cliente_nfe ON nfe.id = cliente_nfe.nfe_id
        LEFT JOIN produtos_nfe ON nfe.id = produtos_nfe.nfe_id
        LEFT JOIN pedido_nfe ON nfe.id = pedido_nfe.nfe_id
        LEFT JOIN resposta_nfe ON nfe.id = resposta_nfe.nfe_id
        WHERE nfe.id = ? AND nfe.empresa_id = ?;
    `;

    const [rows] = await connection.execute(query, [nfeId, usuarioLogado.empresa_id]);

    // A diferença aqui é que estamos esperando apenas uma única NFE, então podemos pegar o primeiro elemento.
    return organizeData(rows);
};

const getPageNFE = async (usuarioLogado, page, limitItems) => {
    let notasFiscais;
    let limit;

    // Primeiro, obtenha a contagem total de notas fiscais para a empresa do usuário logado
    const [linhas] = await connection.execute('SELECT * FROM resposta_nfe WHERE empresa_id = ?', [usuarioLogado.empresa_id]);

    // Em seguida, dependendo do número da página, ajuste o limite e obtenha os dados

    limit = (page > 1) ? (page - 1) * limitItems : 0;

    const query = `
            SELECT 
                rn.*,
                v.valor 
            FROM resposta_nfe AS rn
            LEFT JOIN venda AS v ON v.id = rn.venda_id
            WHERE rn.empresa_id = ? 
            ORDER BY rn.id DESC 
            LIMIT ?, ?`;


    [notasFiscais] = await connection.execute(query, [usuarioLogado.empresa_id, `${limit}`, limitItems]);

    return {
        total_notasFiscais: linhas.length,
        notasFiscais: notasFiscais
    };
};


const getLastNFEId = async () => {
    const query = `
        SELECT nfe.id AS nfe_id
        FROM nfe
        ORDER BY nfe.id DESC
        LIMIT 1;
    `;

    const [rows] = await connection.execute(query);

    // Se tivermos um resultado, retornamos o ID da última NFE, senão, retornamos null.
    return rows || [];
};

const createNFE = async (nfe, usuarioLogado) => {
    const { venda, ...resposta } = nfe;

    const dateIso = new Date().toISOString()

    let nFe;

    const query = `
        INSERT INTO 
        resposta_nfe(
            venda_id, 
            uuid, 
            status, 
            motivo, 
            nfe_numero, 
            serie,
            modelo, 
            recibo, 
            chave, 
            xml, 
            danfe, 
            danfe_simples, 
            danfe_etiqueta, 
            log, 
            empresa_id, 
            epec,
            created_at
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        venda.id,
        resposta.uuid,
        resposta.status,
        resposta.motivo,
        resposta.nfe ?? null,
        resposta.serie ?? null,
        resposta.modelo ?? null,
        resposta.recibo ?? null,
        resposta.chave ?? null,
        resposta.xml ?? null,
        resposta.danfe ?? null,
        resposta.danfe_simples ?? null,
        resposta.danfe_etiqueta ?? null,
        JSON.stringify(resposta.log),
        usuarioLogado.empresa_id,
        resposta.epec ?? false,
        dateIso
    ]

    try {
        nFe = await connection.execute(query, params);
    } catch (err) {
        console.log(err)
    }

    return { insertId: nFe.insertId };
};

const updateNfe = async (dados) => {

    const { uuid, status, motivo, nfe, serie, recibo, chave, modelo, epec, xml, danfe, log, data, log_cancelamento } = dados

    const dateIso = new Date().toISOString()

    const [nota] = await connection.execute(`SELECT * FROM resposta_nfe WHERE uuid=?`, [uuid])

    if (nota.length === 1) {

        const query = `
            UPDATE 
                resposta_nfe
            SET 
                status = ?, 
                motivo = ?, 
                nfe_numero = ?, 
                serie = ?, 
                recibo = ?, 
                chave = ?, 
                modelo = ?, 
                epec = ?, 
                xml = ?, 
                danfe = ?, 
                log = ?, 
                data = ?, 
                log_cancelado = ?,
                updated_at = ?
            WHERE uuid = ?
            `;

        const params = [
            status ?? nota[0].status,
            motivo ?? nota[0].motivo,
            nfe !== undefined ? nfe : nota[0].nfe_numero,
            serie !== undefined ? serie : nota[0].serie,
            recibo !== undefined ? recibo : nota[0].recibo,
            chave !== undefined ? chave : nota[0].chave,
            modelo !== undefined ? modelo : nota[0].modelo,
            epec !== undefined ? epec : nota[0].epec,
            xml !== undefined ? xml : nota[0].xml,
            danfe !== undefined ? danfe : nota[0].danfe,
            log !== undefined ? JSON.stringify(log) : JSON.stringify(nota[0].log),
            data !== undefined ? JSON.stringify(data) : JSON.stringify(nota[0].data),
            log_cancelamento !== undefined ? JSON.stringify(log_cancelamento) : JSON.stringify(nota[0].log_cancelado),
            dateIso,
            uuid
        ];


        await connection.execute(query, params)

    } else {
        throw new Error(`NOTA com UUID ${uuid} não encontrada no baanco de Dados!!!.`)
    }

}

const atualizaNotaCancelada = async (chave, dados) => {

    const { status, xml, log } = dados

    const dateIso = new Date().toISOString()

    const [nota] = await connection.execute(`SELECT * FROM resposta_nfe WHERE chave=?`, [chave])

    if (nota.length === 1) {

        const query = `
            UPDATE resposta_nfe
            SET 
                status = ?, 
                xml = ?, 
                log = ?,
                updated_at = ?
            WHERE chave = ?
            `;

        const params = [
            status,
            xml,
            JSON.stringify({ ...log, dhRecbto: new Date().toUTCString() }),
            dateIso,
            chave,
        ];

        await connection.execute(query, params)

    } else {
        throw new Error(`NOTA com a Chave ${chave} não encontrada no baanco de Dados!!!.`)
    }

}

const relatorioNotasPorPeriodo = async (inicial, final, modelo, status, usuario) => {

    const query = `
        SELECT
            xml,
            chave
        FROM
            resposta_nfe
        WHERE
            created_at BETWEEN ? AND ?
        AND
            empresa_id = ?
        AND
            modelo = ?
        AND
            status = ?
    `

    const params = [
        `${inicial} 00:00:00`,
        `${final} 23:59:59`,
        usuario.empresa_id,
        modelo,
        status
    ]

    try {
        const [relatorio] = await connection.execute(query, params)

        console.log(relatorio)

        return relatorio

    } catch (error) {
        throw new Error("Erro ao buscar dados" + error)
    }

}

module.exports = {
    getAllNFE,
    getNFE,
    getLastNFEId,
    getPageNFE,
    createNFE,
    updateNfe,
    atualizaNotaCancelada,
    relatorioNotasPorPeriodo
};
