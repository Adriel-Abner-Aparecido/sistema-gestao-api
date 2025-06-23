const connection = require('./connection');

const getAll = async (usuarioLogado) => {

    const contaReceber = await connection.execute('SELECT * FROM conta_receber WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return contaReceber;

};

const getByVenda = async (idVenda, usuarioLogado) => {

    const contaReceber = await connection.execute('SELECT * FROM conta_receber WHERE deleted_at IS NULL AND venda_id = ? AND empresa_id = ?', [idVenda, usuarioLogado.empresa_id]);

    return contaReceber;

};

const getByDate = async (startDate, endDate, usuarioLogado) => {

    const query = `
        SELECT * FROM conta_receber 
        WHERE 
            deleted_at IS NULL 
            AND data_vencimento BETWEEN ? AND ?
            AND empresa_id = ?
        ORDER BY data_vencimento`;

    const [contas] = await connection.execute(query, [startDate, endDate, usuarioLogado.empresa_id]);

    return contas;

};

const getByVencimento = async (dataInicio, dataFinal, limitItems, page, usuario) => {

    let limit

    page === 1 ? limit = 0 : limit = (page - 1) * limitItems

    const queryRows = `
        SELECT
            COUNT(cr.id) as total_parcelas,
            IFNULL(ROUND(SUM(cr.valor), 2), 0) as total_a_receber
        FROM
            conta_receber AS cr
        LEFT JOIN
            pagamento_recebido AS pr ON cr.id = pr.conta_receber_id AND cr.deleted_at IS NULL
        LEFT JOIN
            venda AS v ON v.id = cr.venda_id AND v.deleted_at IS NULL AND v.status = "Finalizado"
        WHERE
            cr.empresa_id = ?
        AND cr.cliente_id IS NOT NULL
        AND cr.venda_id IS NOT NULL
        AND cr.deleted_at IS NULL
        AND pr.valor_pago IS NULL
        AND cr.formas_pagamento_id = 36
    `

    const paramsRows = [
        usuario.empresa_id
    ]


    const query = `
        SELECT
            cr.id,
            cr.data_vencimento,
            cl.nome AS nome_cliente,
            cl.celular,
            cr.venda_id,
            v.data AS data_venda,
            ROUND(cr.valor, 2) AS valor_a_receber,
            IFNULL(pr.valor_pago, 0) as valor_pago
        FROM
            conta_receber AS cr
        LEFT JOIN
            cliente AS cl ON cl.id = cr.cliente_id AND cl.deleted_at IS NULL
        LEFT JOIN
            pagamento_recebido AS pr ON cr.id = pr.conta_receber_id AND pr.deleted_at IS NULL
        LEFT JOIN
            venda AS v ON v.id = cr.venda_id AND v.deleted_at IS NULL AND v.status = "Finalizado"
        LEFT JOIN
            formas_pagamento AS fp ON fp.id = pr.formas_pagamento_id
        WHERE
            cr.data_vencimento BETWEEN ? AND ?
        AND
            cr.deleted_at IS NULL
        AND 
            cr.empresa_id = ?
        AND 
            cl.nome IS NOT NULL
        AND
            cr.venda_id IS NOT NULL
        AND 
            pr.valor_pago IS NULL
        AND
            cr.formas_pagamento_id = 36
        ORDER BY 
            cr.data_vencimento ASC
        LIMIT ?, ?
    `

    const params = [
        `${dataInicio}T00:00:00.000`,
        `${dataFinal}T23:59:59.999`,
        usuario.empresa_id,
        `${limit}`,
        limitItems
    ]

    const [crediario] = await connection.execute(query, params)
    const [total_crediario] = await connection.execute(queryRows, paramsRows)

    return {
        parcelas: total_crediario[0].total_parcelas,
        total_a_receber: total_crediario[0].total_a_receber,
        crediario
    }

}

const getCrediarioEmAtraso = async (limitItems, page, usuario) => {

    const date = new Date().toISOString()

    let limit

    page === 1 ? limit = 0 : limit = (page - 1) * limitItems

    const queryRows = `
        SELECT
            COUNT(cr.id) as total_parcelas,
            ROUND(SUM(cr.valor), 2) AS total_a_receber
        FROM
            conta_receber AS cr
        LEFT JOIN
            pagamento_recebido AS pr ON cr.id = pr.conta_receber_id AND pr.deleted_at IS NULL
        LEFT JOIN
            venda AS v ON v.id = cr.venda_id AND v.deleted_at IS NULL AND v.status = "Finalizado"
        WHERE
            cr.data_vencimento < now()
        AND cr.empresa_id = ?
        AND cr.cliente_id IS NOT NULL
        AND cr.venda_id IS NOT NULL
        AND cr.deleted_at IS NULL
        AND pr.valor_pago IS NULL
        AND cr.formas_pagamento_id = 36
    `

    const paramsRows = [
        usuario.empresa_id
    ]


    const query = `
    SELECT
        cr.id,
        cr.data_vencimento,
        cl.nome AS nome_cliente,
        cl.celular,
        cr.venda_id,
        v.data AS data_venda,
        ROUND(cr.valor, 2) AS valor_a_receber,
        IFNULL(pr.valor_pago, 0) AS valor_pago
    FROM
        applojaweb.conta_receber AS cr
    LEFT JOIN
        applojaweb.cliente AS cl ON cl.id = cr.cliente_id AND cl.deleted_at IS NULL
    LEFT JOIN
        applojaweb.pagamento_recebido AS pr ON cr.id = pr.conta_receber_id AND pr.deleted_at IS NULL
    LEFT JOIN
        applojaweb.venda AS v ON v.id = cr.venda_id AND v.deleted_at IS NULL AND v.status = "Finalizado"
    LEFT JOIN
        applojaweb.formas_pagamento AS fp ON fp.id = pr.formas_pagamento_id
    WHERE
        cr.data_vencimento < now()
    AND
        cr.deleted_at IS NULL
    AND
        cr.empresa_id = ?
    AND 
        cr.cliente_id IS NOT NULL
    AND
        cr.venda_id IS NOT NULL
    AND 
        pr.valor_pago IS NULL
    AND
        cr.formas_pagamento_id = 36
    ORDER BY 
        cr.data_vencimento ASC
    LIMIT ?, ?
    `

    const params = [
        usuario.empresa_id,
        `${limit}`,
        limitItems
    ]

    const [crediario] = await connection.execute(query, params)
    const [total_crediario] = await connection.execute(queryRows, paramsRows)

    return {
        parcelas: total_crediario[0].total_parcelas,
        total_a_receber: total_crediario[0].total_a_receber,
        crediario
    }

}

const relatorioByPeriodo = async (dataInicio, dataFinal, usuario) => {

    const queryRows = `
        SELECT
            COUNT(cr.id) as total_parcelas,
            IFNULL(ROUND(SUM(cr.valor), 2), 0) as total_a_receber
        FROM
            conta_receber AS cr
        LEFT JOIN
            pagamento_recebido AS pr ON cr.id = pr.conta_receber_id AND cr.deleted_at IS NULL
        LEFT JOIN
            venda AS v ON v.id = cr.venda_id AND v.deleted_at IS NULL AND v.status = "Finalizado"
        WHERE cr.data_vencimento BETWEEN ? AND ?
        AND cr.empresa_id = ?
        AND cr.cliente_id IS NOT NULL
        AND cr.venda_id IS NOT NULL
        AND cr.deleted_at IS NULL
        AND cr.formas_pagamento_id = 36
    `

    const paramsRows = [
        `${dataInicio}T00:00:00.000`,
        `${dataFinal}T23:59:59.999`,
        usuario.empresa_id
    ]


    const query = `
        SELECT
            cr.id,
            cr.data_vencimento,
            cl.nome AS nome_cliente,
            cl.celular,
            cr.venda_id,
            v.data AS data_venda,
            ROUND(cr.valor, 2) AS valor_a_receber,
            IFNULL(ROUND(pr.valor_pago, 2), 0) as valor_pago
        FROM
            conta_receber AS cr
        LEFT JOIN
            cliente AS cl ON cl.id = cr.cliente_id AND cl.deleted_at IS NULL
        LEFT JOIN
            pagamento_recebido AS pr ON cr.id = pr.conta_receber_id AND pr.deleted_at IS NULL
        LEFT JOIN
            venda AS v ON v.id = cr.venda_id AND v.deleted_at IS NULL AND v.status = "Finalizado"
        LEFT JOIN
            formas_pagamento AS fp ON fp.id = pr.formas_pagamento_id
        WHERE
            cr.data_vencimento BETWEEN ? AND ?
        AND
            cr.deleted_at IS NULL
        AND 
            cr.empresa_id = ?
        AND 
            cl.nome IS NOT NULL
        AND
            cr.venda_id IS NOT NULL
        AND
            cr.formas_pagamento_id = 36
        ORDER BY 
            cr.data_vencimento ASC
    `

    const params = [
        `${dataInicio}T00:00:00.000`,
        `${dataFinal}T23:59:59.999`,
        usuario.empresa_id
    ]

    const [crediario] = await connection.execute(query, params)
    const [total_crediario] = await connection.execute(queryRows, paramsRows)

    return {
        parcelas: total_crediario[0].total_parcelas,
        total_a_receber: total_crediario[0].total_a_receber,
        crediario
    }

}

const relatorioByCliente = async (clienteId, usuario) => {

    const queryRows = `
        SELECT
            COUNT(cr.id) as total_parcelas,
            IFNULL(ROUND(SUM(cr.valor), 2), 0) as total_a_receber
        FROM
            conta_receber AS cr
        LEFT JOIN
            pagamento_recebido AS pr ON cr.id = pr.conta_receber_id AND cr.deleted_at IS NULL
        LEFT JOIN
            venda AS v ON v.id = cr.venda_id AND v.deleted_at IS NULL AND v.status = "Finalizado"
        WHERE cr.empresa_id = ?
        AND cr.cliente_id = ?
        AND cr.venda_id IS NOT NULL
        AND cr.deleted_at IS NULL
        AND cr.formas_pagamento_id = 36
    `

    const paramsRows = [
        usuario.empresa_id,
        clienteId
    ]


    const query = `
        SELECT
            cr.id,
            cr.data_vencimento,
            cl.nome AS nome_cliente,
            cl.celular,
            cr.venda_id,
            v.data AS data_venda,
            ROUND(cr.valor, 2) AS valor_a_receber,
            IFNULL(ROUND(pr.valor_pago, 2), 0) as valor_pago,
            cr.tipo
        FROM
            conta_receber AS cr
        LEFT JOIN
            cliente AS cl ON cl.id = cr.cliente_id AND cl.deleted_at IS NULL
        LEFT JOIN
            pagamento_recebido AS pr ON cr.id = pr.conta_receber_id AND pr.deleted_at IS NULL
        LEFT JOIN
            venda AS v ON v.id = cr.venda_id AND v.deleted_at IS NULL AND v.status = "Finalizado"
        LEFT JOIN
            formas_pagamento AS fp ON fp.id = pr.formas_pagamento_id
        WHERE
            cr.deleted_at IS NULL
        AND 
            cr.empresa_id = ?
        AND 
            cr.cliente_id = ?
        AND
            cr.venda_id IS NOT NULL
        AND
            cr.formas_pagamento_id = 36
        ORDER BY 
            cr.data_vencimento ASC
    `

    const params = [
        usuario.empresa_id,
        clienteId
    ]

    const [crediario] = await connection.execute(query, params)
    const [total_crediario] = await connection.execute(queryRows, paramsRows)

    return {
        parcelas: total_crediario[0].total_parcelas,
        total_a_receber: total_crediario[0].total_a_receber,
        crediario
    }

}

const contaReceberPorPeriodo = async (dataInicio, dataFinal, usuario) => {

    const queryRows = `
        SELECT
            COUNT(id) as total_parcelas,
            IFNULL(ROUND(SUM(valor), 2), 0) as total_a_receber
        FROM
            conta_receber
        WHERE data_vencimento BETWEEN ? AND ?
        AND empresa_id = ?
        AND deleted_at IS NULL
    `

    const paramsRows = [
        `${dataInicio}T00:00:00.000`,
        `${dataFinal}T23:59:59.999`,
        usuario.empresa_id
    ]


    const query = `
        SELECT
            cr.id,
            cr.data_vencimento,
            cl.nome AS nome_cliente,
            cl.celular,
            cr.venda_id,
            ROUND(cr.valor, 2) AS valor_a_receber,
            IFNULL(pr.valor_pago, 0) as valor_pago,
            fp.nome
        FROM
            conta_receber AS cr
        LEFT JOIN
            cliente AS cl ON cl.id = cr.cliente_id AND cl.deleted_at IS NULL
        LEFT JOIN
            pagamento_recebido AS pr ON cr.id = pr.conta_receber_id AND pr.deleted_at IS NULL
        LEFT JOIN
            formas_pagamento AS fp ON fp.id = pr.formas_pagamento_id OR fp.id = cr.formas_pagamento_id
        WHERE
            cr.data_vencimento BETWEEN ? AND ?
        AND cr.deleted_at IS NULL
        AND cr.empresa_id = ?
        ORDER BY cr.data_vencimento ASC
    `

    const params = [
        `${dataInicio}T00:00:00.000`,
        `${dataFinal}T23:59:59.999`,
        usuario.empresa_id
    ]

    const [crediario] = await connection.execute(query, params)
    const [total_crediario] = await connection.execute(queryRows, paramsRows)

    return {
        parcelas: total_crediario[0].total_parcelas,
        total_a_receber: total_crediario[0].total_a_receber,
        crediario
    }

}

const buscaContaReceber = async (busca, page, limitItems, usuario) => {

    let limit

    const [linhas] = await connection.execute(`
        SELECT COUNT(*) as total 
        FROM conta_receber cr
        LEFT JOIN pagamento_recebido pr ON cr.id = pr.conta_receber_id
        LEFT JOIN cliente cl ON cr.cliente_id = cl.id
        LEFT JOIN formas_pagamento fp ON pr.formas_pagamento_id = fp.id
        WHERE cr.deleted_at IS NULL 
        AND cr.empresa_id = ?
        AND cl.nome LIKE ?`, [usuario.empresa_id, `%${busca}%`]);
    const total_contas = linhas[0].total;

    const query = `
        SELECT 
            cr.id as conta_receber_id,
            cr.data_vencimento,
            cr.tipo,
            cr.categoria_contas_id,
            cl.nome AS cliente,
            cl.id AS cliente_id,
            ROUND(cr.valor, 2) AS valor,
            fp.id AS forma_de_pagamento_id,
            fp.nome AS forma_de_pagamento,
            pr.id as pagamento_recebido_id,
            pr.data_pagamento,
            pr.parcelas,
            ROUND(pr.valor_pago, 2) AS valor_pago,
            oc.id AS operacao_id,
            cx.id AS caixa_id
        FROM conta_receber AS cr
        LEFT JOIN 
            cliente AS cl ON cl.id = cr.cliente_id AND cl.deleted_at IS NULL
        LEFT JOIN 
            pagamento_recebido AS pr ON pr.conta_receber_id = cr.id AND pr.deleted_at IS NULL
        LEFT JOIN 
            formas_pagamento AS fp ON pr.formas_pagamento_id = fp.id
        LEFT JOIN
            operacoes_caixa AS oc ON oc.conta_receber_id = cr.id AND cr.deleted_at IS NULL
        LEFT JOIN
            caixa AS cx ON oc.caixa_id = cx.id
        WHERE 
            cr.deleted_at IS NULL
        AND
            cr.empresa_id = ?
        AND 
            cl.nome LIKE ?
        ORDER BY 
            cr.id DESC
        LIMIT ?, ?;
    `

    page == 1 ? limit = 0 : limit = (page - 1) * limitItems;

    const params = [
        usuario.empresa_id,
        `%${busca}%`,
        `${limit}`,
        limitItems
    ]

    const [contas] = await connection.execute(query, params)

    return {
        total_contas,
        contas
    }

}

const getPage = async (usuarioLogado, page, limitItems) => {

    let limit;

    const [linhas] = await connection.execute(`
        SELECT COUNT(*) as total 
        FROM conta_receber cr
        LEFT JOIN pagamento_recebido pr ON cr.id = pr.conta_receber_id
        LEFT JOIN cliente cl ON cr.cliente_id = cl.id
        LEFT JOIN formas_pagamento fp ON pr.formas_pagamento_id = fp.id
        WHERE cr.deleted_at IS NULL AND cr.empresa_id = ?`, [usuarioLogado.empresa_id]);
    const total_contas = linhas[0].total;

    page === 1 ? limit = 0 : limit = (page - 1) * limitItems;

    const query = `
        SELECT 
            cr.id as conta_receber_id,
            cr.data_vencimento,
            cr.tipo,
            cr.categoria_contas_id,
            cr.valor,
            cr.venda_id,
            cl.nome AS cliente,
            cl.id AS cliente_id,
            fp.id AS forma_de_pagamento_id,
            fp.nome AS forma_de_pagamento,
            pr.id as pagamento_recebido_id,
            pr.data_pagamento,
            pr.parcelas,
            pr.valor_pago,
            oc.id AS operacao_id,
            cx.id AS caixa_id
        FROM 
            conta_receber cr
        LEFT JOIN 
            pagamento_recebido pr ON cr.id = pr.conta_receber_id AND pr.deleted_at IS NULL
        LEFT JOIN 
            cliente cl ON cr.cliente_id = cl.id AND cl.deleted_at IS NULL
        LEFT JOIN 
            formas_pagamento fp ON pr.formas_pagamento_id = fp.id
        LEFT JOIN
            operacoes_caixa AS oc ON oc.conta_receber_id = cr.id AND cr.deleted_at IS NULL
        LEFT JOIN
            caixa AS cx ON oc.caixa_id = cx.id
        WHERE 
            cr.deleted_at IS NULL 
        AND 
            cr.empresa_id = ? 
        ORDER BY cr.id DESC 
        LIMIT ?, ?`;

    const params = [
        usuarioLogado.empresa_id,
        `${limit}`,
        limitItems
    ]

    const [contas] = await connection.execute(query, params);

    return {
        total_contas,
        contas
    };
};


const createContaReceber = async (contaReceber, usuarioLogado) => {

    console.log(contaReceber)

    const { valor, dataVencimento, vendaId, clienteId, tipo, categoriaConta, createdAt, formaPagamento, liquidado } = contaReceber;

    const dateUTC = createdAt ? createdAt.toUTCString() : new Date(Date.now()).toUTCString();

    const query = `
        INSERT INTO 
            conta_receber(
            valor, 
            formas_pagamento_id, 
            liquidado, 
            data_vencimento, 
            venda_id, 
            cliente_id, 
            tipo, 
            categoria_contas_id, 
            created_at, 
            empresa_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        valor,
        formaPagamento ?? 1,
        liquidado ?? 1,
        dataVencimento.replace("Z", ""),
        vendaId,
        clienteId,
        tipo.slice(0, 200),
        categoriaConta,
        dateUTC,
        usuarioLogado.empresa_id
    ]

    const [createdContaReceber] = await connection.execute(query, params);

    return { insertId: createdContaReceber.insertId };

}

const deleteContaReceber = async (id) => {

    console.log(id)

    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedContaReceber] = await connection.execute('UPDATE conta_receber SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedContaReceber;

}

const updateContaReceber = async (id, contaReceber, usuarioLogado) => {

    const { valor, dataVencimento, vendaId, clienteId, tipo, categoriaConta } = contaReceber;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'UPDATE conta_receber SET valor = ?, data_vencimento = ?, venda_id = ?, cliente_id = ?, tipo = ?, categoria_contas_id = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedContaReceber] = await connection.execute(query, [valor, dataVencimento, vendaId, clienteId, tipo, categoriaConta, dateUTC, usuarioLogado.empresa_id, id]);

    return updatedContaReceber;

}

module.exports = {
    getAll,
    buscaContaReceber,
    getByVenda,
    getByVencimento,
    getPage,
    createContaReceber,
    deleteContaReceber,
    updateContaReceber,
    getByDate,
    getCrediarioEmAtraso,
    relatorioByPeriodo,
    relatorioByCliente,
    contaReceberPorPeriodo
};