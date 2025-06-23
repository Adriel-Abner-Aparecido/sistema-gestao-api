const connection = require('./connection');

const getAll = async (usuarioLogado) => {

    const query = `
    SELECT 
        vendedor.id, 
        vendedor.nome, 
        vendedor.cnpj_cpf, 
        vendedor.usuario_id, 
        vendedor.telefone, 
        vendedor.celular,
        vendedor.tipo_pessoa,
        vendedor.fantasia,
        vendedor.comissao,
        vendedor.email,
        vendedor.inscricao_estadual,
        vendedor.observacao,
        vendedor.data_nascimento,
        vendedor.data_contratacao,
        endereco.id as enderecoId,
        endereco.rua,
        endereco.bairro,
        endereco.cidade,
        endereco.uf,
        endereco.fornecedor_id,
        endereco.cliente_id,
        endereco.vendedor_id,
        endereco.numero,
        endereco.cep,
        COALESCE(SUM(venda.valor * (vendedor.comissao / 100)), 0) AS total_comissao,
        COUNT(venda.id) AS total_vendas
    FROM 
        vendedor 
    LEFT JOIN endereco ON endereco.vendedor_id = vendedor.id
    LEFT JOIN venda ON vendedor.id = venda.vendedor_id AND venda.deleted_at IS NULL AND MONTH(data) = MONTH(CURDATE())
    WHERE 
        vendedor.deleted_at IS NULL 
    AND 
        vendedor.empresa_id = ?
    GROUP BY
        vendedor.id, 
        vendedor.nome, 
        vendedor.cnpj_cpf, 
        vendedor.usuario_id, 
        vendedor.telefone, 
        vendedor.celular,
        vendedor.tipo_pessoa,
        vendedor.fantasia,
        vendedor.comissao,
        vendedor.email,
        vendedor.inscricao_estadual,
        vendedor.observacao,
        vendedor.data_nascimento,
        vendedor.data_contratacao,
        endereco.id,
        endereco.rua,
        endereco.bairro,
        endereco.cidade,
        endereco.uf,
        endereco.fornecedor_id,
        endereco.cliente_id,
        endereco.vendedor_id,
        endereco.numero,
        endereco.cep
    `;

    const vendedor = await connection.execute(query, [usuarioLogado.empresa_id]);

    return vendedor;
};

const getByIdUsuario = async (id, usuarioLogado) => {

    const vendedor = await connection.execute(`SELECT vendedor.*, vendedor.id as vendedorId, endereco.*, endereco.id as enderecoId FROM vendedor
        LEFT JOIN endereco ON endereco.vendedor_id = vendedor.id 
        WHERE vendedor.deleted_at IS NULL AND vendedor.usuario_id = ? AND vendedor.empresa_id = ?`, [id, usuarioLogado.empresa_id])

    return vendedor

}

const relatorioComissao = async (inicio, fim, usuario) => {

    const query = `
        SELECT
            vendedor.id,
            vendedor.nome,
            COUNT(venda.id) AS total_vendas,
            COALESCE(SUM(venda.valor * (vendedor.comissao / 100)), 0) AS total_comissao
            FROM
                vendedor
            LEFT JOIN 
                venda ON venda.vendedor_id = vendedor.id 
                AND venda.status != "Cancelado" 
                AND venda.deleted_at IS NULL
            WHERE
                vendedor.deleted_at IS NULL
            AND
                venda.data BETWEEN ? AND ?
            AND
                vendedor.empresa_id = ?
            GROUP BY
                vendedor.id,
                vendedor.nome
            ORDER BY
                vendedor.nome,
                vendedor.id
    `;

    const params = [
        `${inicio}T00:00:00.000Z`,
        `${fim}T24:59:59.999Z`,
        usuario.empresa_id
    ]

    try {

        const [relatorio] = await connection.execute(query, params)

        return relatorio

    } catch (error) {
        throw new Error(error)
    }

}

const createVendedor = async (vendedor, usuarioLogado) => {
    const { nome, usuarioId, telefone, celular, email, tipoPessoa, cnpjCpf, fantasia, observacao, dataNascimento, dataContratacao, comissao, inscricaoEstadual } = vendedor;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query =
        'INSERT INTO vendedor(nome, usuario_id, telefone, celular, email, tipo_pessoa, cnpj_cpf, inscricao_estadual, fantasia, comissao, observacao, data_nascimento, data_contratacao, created_at, empresa_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const [createdVendedor] = await connection.execute(query, [nome, usuarioId, telefone, celular, email, tipoPessoa, cnpjCpf, inscricaoEstadual, fantasia, comissao, observacao, dataNascimento, dataContratacao, dateUTC, usuarioLogado.empresa_id]);

    return { insertId: createdVendedor.insertId };
}

const deleteVendedor = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedVendedor] = await connection.execute('UPDATE vendedor SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedVendedor;
}

const updateVendedor = async (id, vendedor, usuarioLogado) => {

    const { nome, telefone, usuarioId, celular, email, tipoPessoa, cnpjCpf, inscricaoEstadual, fantasia, comissao, observacao, dataNascimento, dataContratacao } = vendedor;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query =
        'UPDATE vendedor SET nome = ?, telefone = ?, usuario_id = ?, celular = ?, email = ?, tipo_pessoa = ?, cnpj_cpf = ?, fantasia = ?, comissao = ?, observacao = ?, inscricao_estadual = ?, data_nascimento = ?, data_contratacao = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedVendedor] = await connection.execute(query, [nome, telefone, usuarioId, celular, email, tipoPessoa, cnpjCpf, fantasia, comissao, observacao, inscricaoEstadual, dataNascimento, dataContratacao, dateUTC, usuarioLogado.empresa_id, id]);

    return updatedVendedor;

}

module.exports = {
    getAll,
    getByIdUsuario,
    relatorioComissao,
    createVendedor,
    deleteVendedor,
    updateVendedor
};