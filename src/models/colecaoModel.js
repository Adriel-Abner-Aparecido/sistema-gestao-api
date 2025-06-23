const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const colecao = await connection.execute('SELECT * FROM colecao WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return colecao;
};

const createColecao = async (colecao, usuarioLogado) => {
    const { nome } = colecao;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO colecao(nome, created_at, empresa_id) VALUES (?, ?, ?)';

    const [createdColecao] = await connection.execute(query, [nome, dateUTC, usuarioLogado.empresa_id]);

    return {insertId: createdColecao.insertId};
}

const deleteColecao = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedColecao] = await connection.execute('UPDATE colecao SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedColecao;
}

const updateColecao = async (id, colecao, usuarioLogado) => {
    const { nome } = colecao;

    const dateUTC = new Date(Date.now()).toUTCString();
    
    const query = 'UPDATE colecao SET nome = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedColecao] = await connection.execute(query, [nome, dateUTC, usuarioLogado.empresa_id, id]);
    return updatedColecao;
}

module.exports = {
    getAll,
    createColecao,
    deleteColecao,
    updateColecao
};