const connection = require('./connection');

const countTotalVendas = async (usuario) => {

    const query = `
        SELECT
            COUNT(id) AS total_vendas,
            ROUND(IFNULL(SUM(valor),0), 2) AS valor_total
        FROM
            venda
        WHERE
            deleted_at IS NULL
        AND
            status = "Finalizado"
        AND
            empresa_id = ?
    `;

    const params = [usuario.empresa_id]

    const vendas = await connection.execute(query, params)

    return vendas

}

const getAll = async (usuarioLogado) => {

    const query = `
                SELECT 
                    * 
                FROM 
                    venda 
                WHERE 
                    deleted_at IS NULL 
                AND 
                    empresa_id = ? 
                AND 
                    venda.status != "Cancelado"
    `;

    const params = [usuarioLogado.empresa_id]

    const venda = await connection.execute(query, params);

    return venda;
};

const getBusca = async (busca, page, limitItems, usuario) => {

    let limit

    const [linhas] = await connection.execute(`
            SELECT COUNT(*) as total
            FROM venda
            LEFT JOIN cliente ON cliente.id = venda.cliente_id 
            WHERE venda.deleted_at IS NULL 
            AND venda.empresa_id = ? 
            AND (venda.id LIKE ? OR cliente.nome LIKE ? )`, [usuario.empresa_id, busca, `${busca}`]);

    const total_vendas = linhas[0].total;

    const query = `
    SELECT 
        venda.id, 
        venda.cliente_id, 
        venda.transportadora_id, 
        venda.vendedor_id, 
        venda.data, 
        venda.desconto, 
        venda.valor, 
        venda.status, 
        venda.updated_at,
        cliente.nome as nome_cliente
    FROM venda
    LEFT JOIN cliente ON cliente.id = venda.cliente_id 
    WHERE venda.deleted_at IS NULL 
    AND venda.empresa_id = ? 
    AND (venda.id LIKE ? OR cliente.nome LIKE ? )
    ORDER BY venda.id DESC
    LIMIT ?, ?
    `;

    page === 1 ? limit = 0 : limit = (page - 1) * limitItems;

    const isNumber = !isNaN(busca)

    const params = [usuario.empresa_id, isNumber ? busca : 0, `%${busca}%`, `${limit}`, limitItems]

    const [vendas] = await connection.execute(query, params)

    return {
        total_vendas,
        vendas
    }
}

const getById = async (id, usuarioLogado) => {

    const query = `
        SELECT 
            venda.id, 
            venda.cliente_id, 
            cliente.nome as nome_cliente,
            cliente.telefone as telefone_cliente,
            cliente.celular as celular_cliente,
            cliente.tipo_pessoa as tipo_cliente,
            cliente.cnpj_cpf,
            cliente.inscricao_estadual,
            cliente.email as email_cliente, 
            endereco.rua as rua_cliente, 
            endereco.numero as numero_cliente, 
            endereco.bairro as bairro_cliente, 
            endereco.cep as cep_cliente, 
            endereco.cidade as cidade_cliente, 
            endereco.uf as uf_cliente,
            endereco.complemento as complemento_cliente,
            venda.transportadora_id, 
            venda.vendedor_id, 
            venda.referencia_venda, 
            venda.data, 
            venda.desconto, 
            venda.valor, 
            venda.status, 
            venda.observacao, 
            venda.prazo_entrega, 
            venda.valor_frete, 
            venda.origem_venda, 
            venda.data_entrega, 
            venda.observacao_interna, 
            venda.observacao_externa, 
            venda.endereco_entrega, 
            venda.modalidade_frete, 
            venda.data_postagem, 
            venda.codigo_rastreio, 
            vendedor.nome as nome_vendedor 
        FROM venda 
        LEFT JOIN vendedor ON vendedor.id = venda.vendedor_id
        LEFT JOIN cliente ON cliente.id = venda.cliente_id
        LEFT JOIN endereco ON endereco.cliente_id = venda.cliente_id
        WHERE venda.id = ? 
        AND venda.empresa_id = ?
        `;

    const params = [
        id,
        usuarioLogado.empresa_id
    ];

    const queryProdutosDaVenda = `
        SELECT 
            pv.id AS produto_venda_id,
            pv.venda_id,
            pv.estoque_id,
            pv.valor AS valor_produto,
            pv.quantidade AS quantidade_produto,
            p.nome AS nome_produto,
            p.tipo_produto_id,
            p.marca_id,
            p.categoria_id,
            p.fornecedor_id,
            p.unidade_id,
            p.origem_id,
            p.colecao_id,
            p.cst_icms_id,
            p.icms,
            p.ncm,
            p.observacao AS observacao_produto,
            p.classe_imposto,
            v.id AS variacao_id,
            v.cor_id,
            v.tamanho_id,
            v.codigo_barras,
            v.descricao AS descricao_variacao,
            vp.valor AS valor_preco,
            vp.markup,
            vp.valor_custo,
            e.quantidade AS quantidade_estoque,
            u.sigla AS unidade_sigla
        FROM 
            produtos_da_venda AS pv
        LEFT JOIN estoque AS e ON e.id = pv.estoque_id
        LEFT JOIN variacao_produto AS v ON v.id = e.variacao_produto_id
        LEFT JOIN preco_produto AS vp ON vp.variacao_produto_id = v.id
        LEFT JOIN produto AS p ON p.id = v.produto_id
        LEFT JOIN unidade AS u ON p.unidade_id = u.id
        WHERE 
            pv.empresa_id = ?
        AND
            pv.deleted_at IS NULL
        AND
            pv.venda_id = ?
        ORDER BY 
            pv.id DESC
    `;


    const paramsProdutoDaVenda = [usuarioLogado.empresa_id, id]

    const queryPagamentoRecebido = `
        SELECT
            pr.id,
            pr.conta_receber_id,
            IFNULL(pr.formas_pagamento_id, 5) AS formas_pagamento_id,
            pr.valor_pago,
            pr.parcelas,
            pr.data_pagamento,
            IFNULL(pr.troco, 0) as troco,
            cr.created_at,
            cr.id,
            cr.venda_id,
            cr.cliente_id,
            cr.valor,
            cr.data_vencimento,
            cr.tipo,
            cr.categoria_contas_id,
            cx.id AS caixa_id,
            oc.id AS operacao_id
        FROM conta_receber AS cr
        LEFT JOIN pagamento_recebido AS pr ON pr.conta_receber_id = cr.id AND pr.deleted_at IS NULL
        LEFT JOIN operacoes_caixa AS oc ON oc.conta_receber_id = cr.id AND oc.deleted_at IS NULL
        LEFT JOIN caixa AS cx ON cx.id = oc.caixa_id AND cx.deleted_at IS NULL
        WHERE cr.deleted_at IS NULL
        AND cr.empresa_id = ?
        AND cr.venda_id = ?
    `;

    const paramsPagamentoRecebido = [usuarioLogado.empresa_id, id]


    const venda = await connection.execute(query, params);
    const [produtosDaVenda] = await connection.execute(queryProdutosDaVenda, paramsProdutoDaVenda)
    const [contaReceber] = await connection.execute(queryPagamentoRecebido, paramsPagamentoRecebido)

    return {
        venda: venda[0],
        produtosDaVenda: produtosDaVenda,
        contaReceber: contaReceber
    };

};

const getVendaCliente = async (usuarioLogado) => {
    const query = `
            SELECT 
                venda.id, 
                venda.cliente_id, 
                cliente.nome as nome_cliente, 
                venda.transportadora_id, 
                venda.vendedor_id, 
                venda.data, 
                venda.desconto, 
                venda.valor, 
                venda.status, 
                venda.updated_at
            FROM venda
            LEFT JOIN cliente
            ON venda.cliente_id = cliente.id
            WHERE venda.deleted_at IS NULL
            AND venda.status != "Cancelado"
            AND venda.empresa_id = ?
        `;

    const venda = await connection.execute(query, [usuarioLogado.empresa_id]);

    return venda;
};

const getVendasAnoAtual = async (usuarioLogado) => {
    const query = `
        SELECT 
            MONTH(v.data) AS mes,
            COUNT(v.id) AS total_vendas,
            ROUND(SUM(v.valor - v.desconto),2) AS total_valor
        FROM 
            venda v
        WHERE 
            v.deleted_at IS NULL
            AND v.status = "Finalizado"
            AND YEAR(v.data) = YEAR(CURDATE())
            AND v.empresa_id = ?
        GROUP BY 
            MONTH(v.data)
        ORDER BY 
            MONTH(v.data);
    `;

    const [rows] = await connection.execute(query, [usuarioLogado.empresa_id]);

    // Cria arrays de 12 meses com valores padrão de 0
    const vendasMensais = Array(12).fill(0); // Quantidade de vendas
    const valoresMensais = Array(12).fill(0); // Valores totais de vendas

    // Preenche os arrays com os resultados do SQL
    rows.forEach(row => {
        if (row.mes >= 1 && row.mes <= 12) { // Garante que o mês está dentro do intervalo
            vendasMensais[row.mes - 1] = row.total_vendas || 0;
            valoresMensais[row.mes - 1] = row.total_valor || 0;
        }
    });

    return {
        vendasMensais,
        valoresMensais,
    };
};

const getVendasMesAtual = async (usuarioLogado) => {
    const query = `
        SELECT 
            DAY(v.data) AS dia,
            COUNT(v.id) AS total_vendas,
            SUM(v.valor - v.desconto) AS total_valor
        FROM 
            venda v
        WHERE 
            v.deleted_at IS NULL
            AND v.status = "Finalizado"
            AND MONTH(v.data) = MONTH(CURDATE())
            AND YEAR(v.data) = YEAR(CURDATE())
            AND v.empresa_id = ?
        GROUP BY 
            DAY(v.data)
        ORDER BY 
            dia;
    `;

    const [rows] = await connection.execute(query, [usuarioLogado.empresa_id]);

    // Cria arrays de 12 meses com valores padrão de 0
    const vendasDiarias = Array(31).fill(0); // Quantidade de vendas
    const valoresDiarios = Array(31).fill(0); // Valores totais de vendas

    // Preenche os arrays com os resultados do SQL
    rows.forEach(row => {
        if (row.dia >= 1 && row.dia <= 31) { // Garante que o mês está dentro do intervalo
            vendasDiarias[row.dia - 1] = row.total_vendas || 0;
            valoresDiarios[row.dia - 1] = row.total_valor || 0;
        }
    });

    return {
        vendasDiarias,
        valoresDiarios,
    };
};

const getVendasDiaAtual = async (usuarioLogado) => {
    const query = `SELECT *
                    FROM venda
                    WHERE day(data) = day(curdate()) 
                    AND month(data) = month(curdate()) 
                    AND year(data) = year(curdate()) 
                    AND empresa_id = ? 
                    AND venda.status = "Finalizado"
                    AND deleted_at IS NULL
                    `;

    const venda = await connection.execute(query, [usuarioLogado.empresa_id]);

    return venda;
};

const getPage = async (usuarioLogado, page, limitItems) => {
    let limit;

    const [linhas] = await connection.execute('SELECT * FROM venda WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    page > 1 ? limit = (page - 1) * limitItems : 0;

    const query = `
            SELECT 
                venda.id, 
                venda.cliente_id, 
                cliente.nome as nome_cliente, 
                venda.transportadora_id, 
                venda.vendedor_id, 
                venda.data, 
                venda.desconto, 
                venda.valor, 
                venda.status  
            FROM venda
            LEFT JOIN cliente ON venda.cliente_id = cliente.id
            WHERE venda.deleted_at IS NULL 
            AND venda.empresa_id = ? 
            ORDER BY venda.id DESC 
            LIMIT ?, ?`;

    const params = [
        usuarioLogado.empresa_id,
        `${limit}`,
        limitItems
    ]

    const [vendas] = await connection.execute(query, params);

    return {
        total_vendas: linhas.length,
        vendas
    };
};

const getVendasPorPeriodo = async (usuarioLogado, dataInicio, dataFim) => {
    const query = `
        SELECT 
            venda.*,
            cliente.nome AS nome_cliente
        FROM 
            venda
        LEFT JOIN
            cliente ON venda.cliente_id = cliente.id
        WHERE 
            venda.empresa_id = ? 
        AND 
            venda.data BETWEEN ? AND ? 
        AND
            venda.deleted_at IS NULL 
        AND
            venda.status = 'Finalizado'
        ORDER BY 
            venda.data ASC;
    `;

    const params = [
        usuarioLogado.empresa_id,
        `${dataInicio}T00:00:00.000Z`,
        `${dataFim}T23:59:59.999Z`
    ]

    const vendas = await connection.execute(query, params);

    return vendas;
};

const getVendasPorProdutoPeriodo = async (usuarioLogado, dataInicio, dataFim) => {

    const query = `SELECT 
                        produto.nome AS produto, 
                        SUM(produtos_da_venda.quantidade) AS quantidade_vendida,
                        SUM(produtos_da_venda.quantidade * produtos_da_venda.valor) AS valor_total
                    FROM 
                        produtos_da_venda 
                        LEFT JOIN venda ON produtos_da_venda.venda_id = venda.id
                        LEFT JOIN estoque ON produtos_da_venda.estoque_id = estoque.id
                        LEFT JOIN variacao_produto ON estoque.variacao_produto_id = variacao_produto.id
                        LEFT JOIN produto ON variacao_produto.produto_id = produto.id
                    WHERE 
                        venda.deleted_at IS NULL AND
                        venda.status = "Finalizado" AND
                        produtos_da_venda.deleted_at IS NULL AND
                        estoque.deleted_at IS NULL AND
                        variacao_produto.deleted_at IS NULL AND
                        produtos_da_venda.empresa_id = ? AND
                        venda.data BETWEEN ? AND ?
                    GROUP BY 
                        produto.nome
                    ORDER BY 
                        quantidade_vendida DESC`;

    const params = [
        usuarioLogado.empresa_id,
        `${dataInicio}T00:00:01.000Z`,
        `${dataFim}T23:59:59.999Z`
    ]

    const produtosDaVenda = await connection.execute(query, params);

    return produtosDaVenda;
};

const getVendasPorCategoriaPeriodo = async (usuarioLogado, dataInicio, dataFim) => {

    const query = `SELECT 
                        categoria.nome AS categoria, 
                        SUM(produtos_da_venda.quantidade) AS quantidade_vendida,
                        SUM(produtos_da_venda.quantidade * produtos_da_venda.valor) AS valor_total
                    FROM 
                        produtos_da_venda 
                        LEFT JOIN venda ON produtos_da_venda.venda_id = venda.id
                        LEFT JOIN estoque ON produtos_da_venda.estoque_id = estoque.id
                        LEFT JOIN variacao_produto ON estoque.variacao_produto_id = variacao_produto.id
                        LEFT JOIN produto ON variacao_produto.produto_id = produto.id
                        LEFT JOIN categoria ON produto.categoria_id = categoria.id
                    WHERE 
                        venda.deleted_at IS NULL AND
                        venda.status = "Finalizado" AND
                        produtos_da_venda.deleted_at IS NULL AND
                        estoque.deleted_at IS NULL AND
                        variacao_produto.deleted_at IS NULL AND
                        produtos_da_venda.empresa_id = ? AND
                        venda.data BETWEEN ? AND ?
                    GROUP BY 
                        categoria.nome
                    ORDER BY 
                        quantidade_vendida DESC`;

    const produtosDaVenda = await connection.execute(query, [usuarioLogado.empresa_id, dataInicio, dataFim]);

    return produtosDaVenda;
};

const getReciboVenda = async (id, usuario) => {

    const queryVenda = `
        SELECT 
            venda.*, 
            venda.id as vendaId,
            venda.observacao as observacaoVenda, 
            vendedor.id as vendedorId, 
            vendedor.nome as nomeVendedor, 
            cliente.*, 
            cliente.id as clienteId, 
            cliente.nome as nomeCliente, 
            cliente.celular as celularCliente,
            cliente.email as emailCliente,
            cliente.inscricao_estadual as iECliente,
            cliente.fantasia as nomeFantasiaCliente,
            cliente.observacao as observacaoCliente,
            endereco.*,
            endereco.id as enderecoId,
            empresa.id as empresaId, 
            empresa.nome as nomeEmpresa, 
            empresa.celular as celularEmpresa, 
            empresa.telefone as telefoneEmpresa,
            empresa.email as emailEmpresa,
            empresa.cnpj as cnpjEmpresa,
            empresa.cep as empresaCep,
            empresa.rua as ruaEmpresa,
            empresa.numero as numeroEmpresa,
            empresa.bairro as bairroEmpresa,
            empresa.complemento as complemmentoEmpresa,
            empresa.cidade as cidadeEmpresa,
            empresa.uf as ufEmpresa,
            empresa.logo_image
            FROM venda
        LEFT JOIN vendedor ON vendedor.id = venda.vendedor_id
        LEFT JOIN cliente ON cliente.id = venda.cliente_id
        LEFT JOIN endereco ON endereco.cliente_id = venda.cliente_id
        LEFT JOIN produtos_da_venda ON produtos_da_venda.venda_id = venda.id AND venda.id = ?
        LEFT JOIN empresa ON empresa.id = venda.empresa_id
        WHERE 
            venda.deleted_at IS NULL
        AND 
            venda.id = ?                  
        AND 
            venda.empresa_id = ?
        GROUP BY 
            venda.id, 
            cliente.id, 
            endereco.id, 
            empresa.id, 
            vendedor.id
    `;
    const queryProdutosDaVenda = `
        SELECT 
            produtos_da_venda.id AS produtos_da_venda_id,
            produtos_da_venda.venda_id,
            produtos_da_venda.valor,
            produtos_da_venda.quantidade,
            produtos_da_venda.estoque_id,
            estoque.id AS estoque_id,
            estoque.variacao_produto_id,
            variacao_produto.produto_id, 
            produto.nome AS produto_nome,
            produto.id AS produto_id
        FROM 
            produtos_da_venda
        LEFT JOIN 
            estoque ON estoque.id = produtos_da_venda.estoque_id
        LEFT JOIN 
            variacao_produto ON variacao_produto.id = estoque.variacao_produto_id
        LEFT JOIN 
            produto ON produto.id = variacao_produto.produto_id
        WHERE 
            produtos_da_venda.deleted_at IS NULL
            AND produtos_da_venda.venda_id = ?
            AND produtos_da_venda.empresa_id = ?;
    `;
    const queryTotalVenda = `
        SELECT 
            venda_id,
            empresa_id,
            COALESCE(SUM(valor), 0) AS subTotal, 
            COALESCE(SUM(quantidade), 0) AS quantidadeProdutos, 
            COALESCE(SUM(valor * quantidade), 0) AS valorTotal 
        FROM 
            produtos_da_venda 
        WHERE 
            deleted_at IS NULL
            AND venda_id = ?
            AND empresa_id = ?
        GROUP BY 
            venda_id, empresa_id
    `;

    const queryFormasPagamento = `
        SELECT
            MAX(cr.id) AS id,                                             
            SUM(pr.valor_pago) AS total_pago,
            SUM(cr.valor) AS valor_receber,
            fp.nome AS forma_pagamento,
            COUNT(cr.id) AS numero_pagamentos,
            IFNULL(SUM(pr.troco), 0) AS troco
        FROM conta_receber AS cr
        LEFT JOIN pagamento_recebido AS pr 
            ON pr.conta_receber_id = cr.id AND pr.deleted_at IS NULL
        LEFT JOIN formas_pagamento AS fp 
            ON pr.formas_pagamento_id = fp.id
        WHERE cr.deleted_at IS NULL
        AND cr.venda_id = ?
        AND cr.empresa_id = ?
        GROUP BY fp.nome;
    `;

    const [venda] = await connection.execute(queryVenda, [id, id, usuario.empresa_id])
    const [produtos] = await connection.execute(queryProdutosDaVenda, [id, usuario.empresa_id])
    const [total] = await connection.execute(queryTotalVenda, [id, usuario.empresa_id])
    const [formasPagamento] = await connection.execute(queryFormasPagamento, [id, usuario.empresa_id])

    return {
        venda: venda[0],
        produtos: produtos,
        total: total[0],
        formasPagamento: formasPagamento
    }

}

const getRelatoriVendasLucroBruto = async (inicio, fim, usuario) => {

    const query = `
        SELECT
            MAX(v.id) AS venda_id,
            COUNT(v.id) AS total_vendas,
            SUM(v.desconto / IFNULL(tp.total_produtos, 1)) AS desconto, -- Evita divisão por zero
            SUM(pv.quantidade) AS quantidade_produto_vendida,
            SUM(pv.valor * pv.quantidade) AS venda_total,
            SUM(pv.quantidade * pp.valor_custo) AS custo_total,
            p.nome,
            e.id AS produto_id,
            pp.valor AS valor_unitario
        FROM
            venda AS v
        LEFT JOIN produtos_da_venda AS pv ON pv.venda_id = v.id
        LEFT JOIN estoque AS e ON pv.estoque_id = e.id
        LEFT JOIN variacao_produto AS vp ON e.variacao_produto_id = vp.id
        LEFT JOIN produto AS p ON vp.produto_id = p.id
        LEFT JOIN preco_produto AS pp ON vp.id = pp.variacao_produto_id
        LEFT JOIN (
            SELECT
                venda_id,
                COUNT(*) AS total_produtos
            FROM
                produtos_da_venda
            GROUP BY
                venda_id
        ) AS tp ON tp.venda_id = v.id -- Faz o JOIN com a subquery
        WHERE
            v.deleted_at IS NULL
        AND
            v.data BETWEEN ? AND ?
        AND
            v.empresa_id = ?
        AND
            v.status = "Finalizado"
        GROUP BY
            p.nome,
            e.id,
            pp.valor
        ORDER BY
            p.nome,
            e.id,
            pp.valor
    `;

    const params = [
        `${inicio}T00:00:00.000Z`,
        `${fim}T23:59:59.999Z`,
        usuario.empresa_id
    ]


    const [produtos] = await connection.execute(query, params)

    return produtos

}

const relatorioVendasVendedor = async (inicio, fim, usuario) => {

    const query = `
        SELECT
            vendedor.id,
            vendedor.nome,
            COUNT(venda.id) AS total_vendas,
            COALESCE(SUM(venda.valor - venda.desconto), 0) AS venda_total
            FROM
                vendedor
            LEFT JOIN 
                venda ON venda.vendedor_id = vendedor.id 
                AND venda.status = "Finalizado" 
                AND venda.deleted_at IS NULL
            WHERE
                vendedor.deleted_at IS NULL
            AND
                venda.status = "Finalizado"
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
    `

    const params = [
        `${inicio}T00:00:00.000Z`,
        `${fim}T23:59:59.999Z`,
        usuario.empresa_id
    ]

    try {

        const [relatorio] = await connection.execute(query, params)

        return relatorio

    } catch (error) {
        throw new Error(error)
    }

}

const deleteVenda = async (id, usuarioLogado) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [oldVendaData] = await connection.execute('SELECT * FROM venda WHERE id = ?', [id]);

    const [removedVenda] = await connection.execute('UPDATE venda SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    // Registra log após exclusão da venda
    await registrarLog(usuarioLogado.id, 'venda', 'deleteVenda', oldVendaData[0], { deleted_at: dateUTC });

    return removedVenda;
}

const createVenda = async (venda, usuarioLogado) => {

    const { clienteId, transportadoraId, vendedorId, referenciaVenda, data, desconto, valor, status, observacao,
        prazoEntrega, valorFrete, valorBaseSt, valorSt, valorIpi, pesoTotalNota, pesoTotalNotaLiq, origemVenda, dataEntrega, observacaoInterna,
        observacaoExterna, enderecoEntrega, modalidadeFrete, dataPostagem, codigoRastreio } = venda;


    const dateUTC = new Date(Date.now()).toUTCString();

    const query = `
        INSERT INTO 
            venda(
                cliente_id, 
                transportadora_id, 
                vendedor_id, 
                referencia_venda, 
                data, desconto, 
                valor, 
                status, 
                observacao, 
                prazo_entrega, 
                valor_frete, 
                valor_base_st, 
                valor_st, 
                valor_ipi, 
                peso_total_nota, 
                peso_total_nota_liq, 
                origem_venda,
                data_entrega, 
                observacao_interna, 
                observacao_externa, 
                endereco_entrega, 
                modalidade_frete, 
                data_postagem, 
                codigo_rastreio, 
                created_at, 
                empresa_id
            )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        clienteId,
        transportadoraId,
        vendedorId,
        referenciaVenda,
        data,
        desconto,
        valor,
        status,
        observacao,
        prazoEntrega,
        valorFrete,
        valorBaseSt,
        valorSt,
        valorIpi,
        pesoTotalNota,
        pesoTotalNotaLiq,
        origemVenda,
        dataEntrega,
        observacaoInterna,
        observacaoExterna,
        enderecoEntrega,
        modalidadeFrete,
        dataPostagem,
        codigoRastreio,
        dateUTC,
        usuarioLogado.empresa_id
    ]

    const [createdVenda] = await connection.execute(query, params);

    const logData = {
        referenciaVenda,
        data,
        desconto,
        valor,
        status,
        observacao,
        created_at: dateUTC,
        empresa_id: usuarioLogado.empresa_id,
    };

    // Registra log após criação da venda
    await registrarLog(usuarioLogado.id, 'venda', 'createVenda', null, logData);

    return { insertId: createdVenda.insertId };
}

const updateVenda = async (id, venda, usuarioLogado) => {

    const { clienteId, transportadoraId, vendedorId, referenciaVenda, data, desconto, valor, status, observacao,
        prazoEntrega, valorFrete, valorBaseSt, valorSt, valorIpi, pesoTotalNota, pesoTotalNotaLiq, origemVenda, dataEntrega, observacaoInterna, observacaoExterna, enderecoEntrega, modalidadeFrete, dataPostagem, codigoRastreio } = venda;

    const dateUTC = new Date(Date.now()).toUTCString();

    const dateVenda = new Date(data)

    const [oldVendaData] = await connection.execute('SELECT * FROM venda WHERE id = ?', [id]);

    const query = `
        UPDATE venda 
        SET 
            cliente_id = ?, 
            transportadora_id = ?, 
            vendedor_id = ?, 
            referencia_venda = ?, 
            data = ?, 
            desconto = ?,
            valor = ?, 
            status = ?, 
            observacao = ?, 
            prazo_entrega = ?, 
            valor_frete = ?, 
            valor_base_st = ?, 
            valor_st = ?, 
            valor_ipi = ?, 
            peso_total_nota = ?,
            peso_total_nota_liq = ?, 
            origem_venda = ?, 
            data_entrega = ?, 
            observacao_interna = ?, 
            observacao_externa = ?, 
            endereco_entrega = ?,
            modalidade_frete = ?, 
            data_postagem = ?, 
            codigo_rastreio = ?, 
            updated_at = ?, 
            empresa_id = ? 
        WHERE id = ?`;

    const params = [
        clienteId,
        transportadoraId,
        vendedorId,
        referenciaVenda,
        dateVenda,
        desconto,
        valor,
        status,
        observacao,
        prazoEntrega,
        valorFrete,
        valorBaseSt,
        valorSt,
        valorIpi,
        pesoTotalNota,
        pesoTotalNotaLiq,
        origemVenda,
        dataEntrega,
        observacaoInterna,
        observacaoExterna,
        enderecoEntrega,
        modalidadeFrete,
        dataPostagem,
        codigoRastreio,
        dateUTC,
        usuarioLogado.empresa_id, id
    ]

    const [updatedVenda] = await connection.execute(query, params);

    const logData = {
        referenciaVenda,
        dateVenda,
        desconto,
        valor,
        status,
        observacao,
        updated_at: dateUTC,
        empresa_id: usuarioLogado.empresa_id,
    };

    // Registra log após atualização da venda
    await registrarLog(usuarioLogado.id, 'venda', 'updateVenda', oldVendaData[0], logData);

    return updatedVenda;

}

const registrarLog = async (userId, table, action, oldData, newData) => {
    await connection.execute(
        'INSERT INTO sistema_logs (usuario_id, tabela, acao, data_hora, dados_antigos, dados_novos) VALUES (?, ?, ?, NOW(), ?, ?)',
        [userId, table, action, JSON.stringify(oldData), JSON.stringify(newData)]
    );
}

module.exports = {
    countTotalVendas,
    getAll,
    getById,
    getBusca,
    getVendaCliente,
    getVendasAnoAtual,
    getVendasMesAtual,
    getVendasDiaAtual,
    getVendasPorPeriodo,
    getVendasPorProdutoPeriodo,
    getVendasPorCategoriaPeriodo,
    getPage,
    getReciboVenda,
    getRelatoriVendasLucroBruto,
    relatorioVendasVendedor,
    createVenda,
    deleteVenda,
    updateVenda
};