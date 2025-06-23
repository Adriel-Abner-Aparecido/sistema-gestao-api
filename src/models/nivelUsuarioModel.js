const connection = require("./connection")

const getAll = async (usuario) => {

    const query = `SELECT * FROM nivel_usuario WHERE empresa_id = 1 OR empresa_id = ?`

    const params = [usuario.empresa_id]

    const [niveis] = await connection.execute(query, params)

    return niveis

}

module.exports = {
    getAll
}