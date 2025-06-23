const connection = require("./connection");

const getByIdCaixa = async (caixaId, usuario) => {

    const [saldos] = await connection.execute(`
    SELECT 
        COALESCE(SUM(CASE WHEN tipo_operacao = 'entrada' THEN valor_pagamento ELSE 0 END),0) AS total_entradas,
        COALESCE(SUM(CASE WHEN tipo_operacao = 'saida' THEN valor_pagamento ELSE 0 END),0) AS total_saidas,
        COALESCE(SUM(CASE WHEN tipo_operacao = 'entrada' THEN valor_pagamento ELSE 0 END),0) - 
        COALESCE(SUM(CASE WHEN tipo_operacao = 'saida' THEN valor_pagamento ELSE 0 END),0) AS saldo
    FROM operacoes_caixa
    WHERE caixa_id=? AND empresa_id=? AND deleted_at IS NULL
    `, [caixaId, usuario.empresa_id])

    const [operacoes] = await connection.execute(`SELECT * FROM operacoes_caixa WHERE deleted_at IS NULL AND caixa_id=? AND empresa_id=? ORDER BY id DESC`, [caixaId, usuario.empresa_id])

    const queryFormasPagamento = `
        SELECT
            COALESCE(SUM(CASE WHEN oc.tipo_operacao = 'entrada' THEN oc.valor_pagamento ELSE 0 END), 0) AS valor_pagamento,
            fp.nome
        FROM 
            operacoes_caixa AS oc
        LEFT JOIN
            formas_pagamento AS fp ON oc.forma_pagamento_id = fp.id
        WHERE
            oc.deleted_at IS NULL
            AND oc.caixa_id = ?
            AND oc.empresa_id = ?
        GROUP BY 
            fp.nome;
    `;

    const paramsFormasPagamento = [
        caixaId,
        usuario.empresa_id
    ];

    const [formasPagamentoOperacao] = await connection.execute(queryFormasPagamento, paramsFormasPagamento)

    return { operacoes, saldos, formasPagamentoOperacao }

}

const createOperacao = async (operacao, usuario) => {

    console.log(operacao)

    const { caixaId, formaPagamento, valorPagamento, horaPagamento, tipoOperacao, observacao, contaPagarId, contaReceberId } = operacao

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = `
        INSERT INTO 
            operacoes_caixa(
                            caixa_id, 
                            forma_pagamento_id, 
                            valor_pagamento, 
                            hora_pagamento, 
                            created_at, 
                            tipo_operacao, 
                            observacao, 
                            conta_pagar_id,
                            conta_receber_id, 
                            empresa_id,
                            usuario_id
                            ) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `;

    const params = [
        parseInt(caixaId),
        formaPagamento,
        valorPagamento,
        horaPagamento,
        dateUTC,
        tipoOperacao,
        observacao,
        contaPagarId ?? null,
        contaReceberId ?? null,
        usuario.empresa_id,
        usuario.id
    ]

    const [createdoperacao] = await connection.execute(query, params)

    return createdoperacao

}

const deleteOperacao = async (id) => {

    const dateUTC = new Date(Date.now()).toUTCString();

    const [deleteoperacao] = await connection.execute(`UPDATE operacoes_caixa SET deleted_at=? WHERE id=?`, [dateUTC, id])

    return deleteoperacao

}

const updateOperacao = async (id, operacao) => {

    const { formaPagamento, valorPagamento, horaPagamento, tipoOperacao, observacao, contaPagarId, contaReceberId } = operacao

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = `
        UPDATE 
            operacoes_caixa 
        SET
            forma_pagamento_id = ?,
            valor_pagamento = ?,
            hora_pagamento = ?,
            updated_at = ?,
            tipo_operacao = ?,
            observacao = ?,
            conta_pagar_id = ?,
            conta_receber_id = ?
        WHERE
            id = ?
    `

    const params = [
        formaPagamento,
        valorPagamento,
        horaPagamento,
        dateUTC,
        tipoOperacao,
        observacao,
        contaPagarId ?? null,
        contaReceberId ?? null,
        id
    ]

    const [update] = await connection.execute(query, params)

    return update

}

module.exports = {
    createOperacao,
    getByIdCaixa,
    deleteOperacao,
    updateOperacao
}