const connection = require("./connection")

const createIndicacao = async (indicado, indicacao) => {

    const query = `INSERT INTO indicacao(indicacao, indicado) VALUES (?, ?)`

    const params = [
        indicacao,
        indicado
    ]

    const [createindicacao] = await connection.execute(query, params)

    return {
        insertId: createindicacao.insertId
    }

}

const getIndicacoes = async (usuario) => {

    const [[row]] = await connection.execute(`SELECT COUNT(id) as total FROM indicacao WHERE indicacao = ?`, [usuario.empresa_id])

    const query = `
        SELECT 
            empresa.nome,
            (
                CASE
                    WHEN
                        empresa.nome != 'Empresa' AND
                        empresa.cnpj IS NOT NULL AND
                        empresa.celular IS NOT NULL AND
                        empresa.email IS NOT NULL AND
                        EXISTS (SELECT 1 FROM produto WHERE produto.empresa_id = empresa.id) AND
                        EXISTS (SELECT 1 FROM cliente WHERE cliente.empresa_id = empresa.id) AND
                        EXISTS (SELECT 1 FROM venda WHERE venda.empresa_id = empresa.id)
                    THEN 'Aprovado'
                    ELSE 'Pendente'
                END
            ) AS status,
        indicacao.created_at AS data
        FROM indicacao
        LEFT JOIN empresa ON empresa.id = indicacao.indicado
        WHERE indicacao.indicacao = ?
        AND YEAR(indicacao.created_at) = YEAR(NOW());
    `

    const params = [
        usuario.empresa_id
    ]

    try {
        const [indicacoes] = await connection.execute(query, params)
        return {
            total: row.total,
            indicacoes
        }
    } catch (error) {
        throw new Error(error)
    }

}

const numeroIndicacoes = async (usuario) => {

    const [[row]] = await connection.execute(`
            SELECT COUNT(indicado.id) as total 
            FROM indicacao 
            LEFT JOIN empresa AS indicou ON indicou.id = indicacao.indicacao
            LEFT JOIN empresa AS indicado ON indicado.id = indicacao.indicado
            WHERE indicacao.indicacao = ?
            AND indicado.nome IS NOT NULL
            AND indicado.cnpj IS NOT NULL
            AND indicado.celular IS NOT NULL
            AND indicado.email IS NOT NULL
            AND EXISTS (SELECT 1 FROM produto WHERE produto.empresa_id = indicado.id) 
            AND EXISTS (SELECT 1 FROM cliente WHERE cliente.empresa_id = indicado.id) 
            AND EXISTS (SELECT 1 FROM venda WHERE venda.empresa_id = indicado.id)
            AND YEAR(indicacao.created_at) = YEAR(NOW())
    `, [usuario])

    return row.total

}

module.exports = {
    createIndicacao,
    getIndicacoes,
    numeroIndicacoes
}