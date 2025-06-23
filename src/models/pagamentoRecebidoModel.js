const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const pagamentoRecebido = await connection.execute('SELECT * FROM pagamento_recebido WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return pagamentoRecebido;
};

const getByContaReceber = async (idContaReceber, usuarioLogado) => {

    const query = `SELECT pagamento_recebido.*, formas_pagamento.nome as forma_nome
                    FROM pagamento_recebido
                    INNER JOIN formas_pagamento 
                    ON pagamento_recebido.formas_pagamento_id = formas_pagamento.id
                    WHERE pagamento_recebido.deleted_at IS NULL AND pagamento_recebido.conta_receber_id = ? AND pagamento_recebido.empresa_id = ?`;


    const pagamentoRecebido = await connection.execute(query, [idContaReceber, usuarioLogado.empresa_id]);

    return pagamentoRecebido;
};

const getFinanceiroReceitasPorPeriodo = async (usuarioLogado, dataInicio, dataFinal) => {

    const query = `SELECT
                      pagamento_recebido.valor_pago,
                      pagamento_recebido.parcelas,
                      pagamento_recebido.data_pagamento,
                      conta_receber.valor AS valor_conta,
                      conta_receber.tipo,
                      conta_receber.data_vencimento,
                      cliente.nome AS nome_cliente,
                      venda.id AS venda_id,
                      venda.valor AS valor_venda,
                      formas_pagamento.nome AS forma_pagamento
                  FROM 
                      pagamento_recebido
                  LEFT JOIN conta_receber ON pagamento_recebido.conta_receber_id = conta_receber.id
                  LEFT JOIN cliente ON conta_receber.cliente_id = cliente.id
                  LEFT JOIN venda ON conta_receber.venda_id = venda.id
                  LEFT JOIN formas_pagamento ON pagamento_recebido.formas_pagamento_id = formas_pagamento.id
                  WHERE 
                      conta_receber.data_vencimento BETWEEN ? AND ?
                  AND 
                      pagamento_recebido.empresa_id = ? 
                  AND
                      venda.status != 'Cancelado'
                  ORDER BY 
                      conta_receber.data_vencimento ASC;`;

    const financeiroReceitas = await connection.execute(query, [dataInicio, dataFinal, usuarioLogado.empresa_id]);

    return financeiroReceitas;
};

const getFormaPagamentoPorPeriodo = async (usuarioLogado, dataInicio, dataFim) => {

    const query = `
        SELECT 
            formas_pagamento.nome AS forma_pagamento, 
            SUM(CASE 
                    WHEN conta_receber.deleted_at IS NULL THEN ROUND(pagamento_recebido.valor_pago, 2) 
                    ELSE 0 
                END) AS total_pago
        FROM 
            pagamento_recebido
        LEFT JOIN formas_pagamento 
            ON pagamento_recebido.formas_pagamento_id = formas_pagamento.id
        LEFT JOIN conta_receber 
            ON pagamento_recebido.conta_receber_id = conta_receber.id
        WHERE 
            pagamento_recebido.deleted_at IS NULL
            AND pagamento_recebido.data_pagamento BETWEEN ? AND ?
            AND pagamento_recebido.empresa_id = ?
        GROUP BY 
            formas_pagamento.nome

    `;

    const params = [
        `${dataInicio}T00:00:00.000Z`,
        `${dataFim}T24:59:59.999Z`,
        usuarioLogado.empresa_id
    ]

    const queryVendas = `
        SELECT
            "Desconto" AS forma_pagamento,
            SUM(ROUND(desconto, 2)) AS total_pago
        FROM
            venda
        WHERE
            deleted_at IS NULL
        AND
            data BETWEEN ? AND ?
        AND
            empresa_id = ?
    `;

    const paramsVenda = [
        `${dataInicio}T00:00:00.000Z`,
        `${dataFim}T23:59:59.999Z`,
        usuarioLogado.empresa_id
    ]

    const [valorPagoPorFormaPagamento] = await connection.execute(query, params);
    const [desconto] = await connection.execute(queryVendas, paramsVenda);

    const todosOsValores = [...valorPagoPorFormaPagamento, ...desconto]

    return todosOsValores;
};

const createPagamentoRecebido = async (pagamentoRecebido, usuarioLogado) => {

    const { valorPago, dataPagamento, contaReceberId, formasPagamentoId, parcelas, troco } = pagamentoRecebido;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = `
        INSERT INTO 
            pagamento_recebido(
                valor_pago, 
                troco, 
                data_pagamento,
                conta_receber_id, 
                formas_pagamento_id, 
                parcelas, 
                created_at, 
                empresa_id
            ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        valorPago,
        troco ?? 0,
        dataPagamento,
        contaReceberId,
        parseInt(formasPagamentoId),
        parcelas,
        dateUTC,
        usuarioLogado.empresa_id
    ]

    const [createdPagamentoRecebido] = await connection.execute(query, params);

    return { insertId: createdPagamentoRecebido.insertId };

}

const deletePagamentoRecebido = async (id) => {

    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedPagamentoRecebido] = await connection.execute('UPDATE pagamento_recebido SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedPagamentoRecebido;
}

const updatePagamentoRecebido = async (id, pagamentoRecebido, usuarioLogado) => {
    const { valorPago, dataPagamento, contaReceberId, formasPagamentoId, parcelas } = pagamentoRecebido;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'UPDATE pagamento_recebido SET valor_pago = ?, data_pagamento = ?, conta_receber_id = ?, formas_pagamento_id = ?, parcelas = ?,  updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedPagamentoRecebido] = await connection.execute(query, [valorPago, dataPagamento, contaReceberId, formasPagamentoId, parcelas, dateUTC, usuarioLogado.empresa_id, id]);
    return updatedPagamentoRecebido;
}

module.exports = {
    getAll,
    getByContaReceber,
    getFinanceiroReceitasPorPeriodo,
    getFormaPagamentoPorPeriodo,
    createPagamentoRecebido,
    deletePagamentoRecebido,
    updatePagamentoRecebido
};