const connection = require("./connection")
const { registrarLog } = require("./logsModel")

const getCaixa = async (id, usuario) => {

    const query = `
        SELECT 
            caixa.id, 
            caixa.status, 
            caixa.hora_abertura, 
            IFNULL(caixa.hora_fechamento, null) AS hora_fechamento, 
            IFNULL(caixa.valor_abertura, 0) AS valor_abertura, 
            caixa.observacao, 
            caixa.usuario_id, 
            caixa.created_at, 
            usuario.username as nome_usuario, 
            IFNULL(caixa.valor_fechamento, 0) AS valor_fechamento,
            (
                SELECT 
                    COALESCE(SUM(valor_pagamento), 0) 
                FROM operacoes_caixa 
                WHERE operacoes_caixa.caixa_id = caixa.id 
                AND operacoes_caixa.tipo_operacao = 'Entrada'
                AND operacoes_caixa.deleted_at IS NULL
            ) AS total_entradas,
            (
                SELECT 
                    COALESCE(SUM(valor_pagamento), 0) 
                FROM operacoes_caixa 
                WHERE operacoes_caixa.caixa_id = caixa.id 
                AND operacoes_caixa.tipo_operacao = 'Saida'
                AND operacoes_caixa.deleted_at IS NULL
            ) AS total_saidas,
            (
                (
                    SELECT COALESCE(SUM(IFNULL(valor_pagamento, 0)), 0) 
                    FROM operacoes_caixa 
                    WHERE operacoes_caixa.caixa_id = caixa.id 
                    AND operacoes_caixa.tipo_operacao = 'Entrada'
                    AND operacoes_caixa.deleted_at IS NULL
                ) 
                - 
                (
                    SELECT COALESCE(SUM(IFNULL(valor_pagamento, 0)), 0) 
                    FROM operacoes_caixa 
                    WHERE operacoes_caixa.caixa_id = caixa.id 
                    AND operacoes_caixa.tipo_operacao = 'Saida'
                    AND operacoes_caixa.deleted_at IS NULL
                ) + IFNULL(caixa.valor_abertura, 0)
            ) AS saldo_final
        FROM caixa
        LEFT JOIN usuario ON caixa.usuario_id = usuario.id 
        WHERE caixa.deleted_at IS NULL
        AND caixa.id = ?
        AND caixa.empresa_id = ?
    `
    const [caixa] = await connection.execute(query, [id, usuario.empresa_id])

    if (caixa.length === 0) {
        return { message: 'Caixa não encontrado' }
    }

    return caixa

}

const getAll = async (usuario) => {

    const caixas = await connection.execute(`SELECT * FROM caixa WHERE deleted_at IS NULL AND empresa_id= ? ORDER BY id DESC`, [usuario.empresa_id])

    return caixas
}

const getAllCaixaAberto = async (usuario) => {

    const caixas = await connection.execute(`SELECT * FROM caixa WHERE deleted_at IS NULL AND status="Aberto" AND empresa_id= ? ORDER BY id DESC`, [usuario.empresa_id])

    return caixas

}

const getCaixaPage = async (usuario, page, limitItems) => {
    let caixa;
    let limit;

    const [linhas] = await connection.execute(
        `SELECT * FROM caixa WHERE deleted_at IS NULL AND empresa_id = ?`,
        [usuario.empresa_id]
    );

    limit = (page > 1) ? (page - 1) * limitItems : 0;

    const query = `
        SELECT 
            caixa.id, 
            caixa.status, 
            caixa.hora_abertura, 
            IFNULL(caixa.hora_fechamento, null) AS hora_fechamento, 
            IFNULL(caixa.valor_abertura, 0) AS valor_abertura, 
            caixa.observacao, 
            caixa.usuario_id, 
            caixa.created_at, 
            usuario.username as nome_usuario, 
            IFNULL(caixa.valor_fechamento, 0) AS valor_fechamento,
            (
                SELECT 
                    COALESCE(SUM(valor_pagamento), 0) 
                FROM operacoes_caixa 
                WHERE operacoes_caixa.caixa_id = caixa.id 
                AND operacoes_caixa.tipo_operacao = 'Entrada'
                AND operacoes_caixa.deleted_at IS NULL
            ) AS total_entradas,
            (
                SELECT 
                    COALESCE(SUM(valor_pagamento), 0) 
                FROM operacoes_caixa 
                WHERE operacoes_caixa.caixa_id = caixa.id 
                AND operacoes_caixa.tipo_operacao = 'Saida'
                AND operacoes_caixa.deleted_at IS NULL
            ) AS total_saidas,
            (
                (
                    SELECT COALESCE(SUM(IFNULL(valor_pagamento, 0)), 0) 
                    FROM operacoes_caixa 
                    WHERE operacoes_caixa.caixa_id = caixa.id 
                    AND operacoes_caixa.tipo_operacao = 'Entrada'
                    AND operacoes_caixa.deleted_at IS NULL
                ) 
                - 
                (
                    SELECT COALESCE(SUM(IFNULL(valor_pagamento, 0)), 0) 
                    FROM operacoes_caixa 
                    WHERE operacoes_caixa.caixa_id = caixa.id 
                    AND operacoes_caixa.tipo_operacao = 'Saida'
                    AND operacoes_caixa.deleted_at IS NULL
                ) + IFNULL(caixa.valor_abertura, 0)
            ) AS saldo_final
        FROM caixa
        LEFT JOIN usuario ON caixa.usuario_id = usuario.id 
        WHERE caixa.deleted_at IS NULL 
        AND caixa.empresa_id = ? 
        ORDER BY caixa.id DESC 
        LIMIT ?, ?`;

    [caixa] = await connection.execute(query, [usuario.empresa_id, `${limit}`, limitItems]);

    return {
        total_caixas: linhas.length,
        caixa
    };
};

const createCaixa = async (usuario, caixa) => {

    const { status, valorAbertura, observacao } = caixa

    const dateUTC = new Date(Date.now()).toUTCString();

    const caixacreate = `INSERT INTO caixa(hora_abertura, hora_fechamento, created_at, updated_at, status, empresa_id, usuario_id, valor_abertura, observacao) VALUES ( ? , ? , ? , ? , ? , ? , ? , ?, ?)`

    const [caixacreated] = await connection.execute(caixacreate, [dateUTC, null, dateUTC, null, status, usuario.empresa_id, usuario.id, valorAbertura, observacao])

    return caixacreated
}

const fecharCaixa = async (idCaixa, caixa, usuario) => {

    console.log(caixa)

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = `
        UPDATE 
            caixa 
        SET 
            valor_abertura = ?, 
            observacao=?, 
            hora_fechamento=?, 
            status=?, 
            valor_fechamento=?, 
            updated_at=? 
        WHERE id=? 
        AND empresa_id=?
    `;

    params = [
        caixa.valor_abertura,
        caixa.observacao,
        dateUTC,
        caixa.status,
        caixa.valor_fechamento,
        dateUTC,
        idCaixa.id,
        usuario.empresa_id,
    ]

    const [fechoucaixa] = await connection.execute(query, params)

    return fechoucaixa
}

const reabrirCaixa = async (idCaixa, caixa, usuario) => {

    const dateUTC = new Date(Date.now()).toUTCString();

    const fechacaixa = `UPDATE caixa SET hora_fechamento=?, status=?, updated_at=? WHERE id=? AND empresa_id=?`

    const [fechoucaixa] = await connection.execute(fechacaixa, [dateUTC, caixa.status, dateUTC, idCaixa.id, usuario.empresa_id,])

    return fechoucaixa
}

const updateCaixa = async (idCaixa, caixa, usuario) => {

    const [buscaCaixa] = await connection.execute("SELECT * FROM caixa WHERE id = ? AND empresa_id = ?", [idCaixa.id, usuario.empresa_id])

    if (buscaCaixa.length === 0) {
        return { message: "Caixa não encontrado!" }
    }

    const { hora_abertura, hora_fechamento, status, valor_abertura, valor_fechamento, observacao } = caixa

    const dateUtc = new Date(Date.now()).toUTCString();

    const query = `
        UPDATE caixa
        SET
            hora_abertura = ?,
            hora_fechamento = ?,
            status = ?,
            updated_at = ?,
            valor_abertura = ?,
            valor_fechamento = ?,
            observacao = ?,
            updated_at = ?
        WHERE
            id = ?
        AND
            empresa_id = ?
    `

    const params = [
        hora_abertura,
        hora_fechamento,
        status,
        dateUtc,
        valor_abertura,
        valor_fechamento,
        observacao,
        dateUtc,
        idCaixa.id,
        usuario.empresa_id
    ]

    const [update] = await connection.execute(query, params)

    await registrarLog(usuario.id, "caixa", "update-caixa", buscaCaixa[0], { ...caixa, updated_at: dateUtc })

    return update
}

module.exports = {
    getCaixa,
    getAll,
    getAllCaixaAberto,
    getCaixaPage,
    createCaixa,
    fecharCaixa,
    reabrirCaixa,
    updateCaixa
}