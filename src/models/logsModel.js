const connection = require("./connection")

const registrarLog = async (userId, table, action, oldData, newData) => {

    await connection.execute(
        'INSERT INTO sistema_logs (usuario_id, tabela, acao, data_hora, dados_antigos, dados_novos) VALUES (?, ?, ?, NOW(), ?, ?)',
        [userId, table, action, JSON.stringify(oldData), JSON.stringify(newData)]
    )

}

module.exports = {
    registrarLog
}