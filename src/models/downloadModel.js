const { connection_ii } = require("../modules/connection")

const verificaChave = async (chave) => {

    const consulta = String(chave).length < 10 ? 'chave' : 'pedido'

    const query = `
        SELECT *
        FROM tblCodigosAtivacao
        WHERE ${consulta} = ?
        AND ativo = -1 OR ativo = 1
    `

    const params = [
        chave
    ]

    try {
        const resultado = await connection_ii.execute(query, params)
        return resultado[0]
    } catch (error) {
        throw new Error(error)
    }

}

module.exports = {
    verificaChave
}