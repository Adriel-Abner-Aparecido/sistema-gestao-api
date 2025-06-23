const connection = require("./connection")

const buscaPlano = async (planoId) => {

    const [[plano]] = await connection.execute(`SELECT * FROM plano WHERE id = ?`, [planoId])

    return plano

}

module.exports = {
    buscaPlano,
}