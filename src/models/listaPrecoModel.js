const connection = require('./connection');

const getAll = async () => {
    const listaPreco = await connection.execute('SELECT * FROM lista_preco WHERE deleted_at IS NULL');

    return listaPreco;
};

const createListaPreco = async (listaPreco) => {
    const { nome } = listaPreco;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO lista_preco(nome, created_at, empresa_id) VALUES (?, ?, ?)';

    const [createdListaPreco] = await connection.execute(query, [nome, dateUTC, 1]);

    return {insertId: createdListaPreco.insertId};
}

const deleteListaPreco = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedListaPreco] = await connection.execute('UPDATE lista_preco SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedListaPreco;
}

const updateListaPreco = async (id, listaPreco) => {
    const { nome } = listaPreco;

    const dateUTC = new Date(Date.now()).toUTCString();
    
    const query = 'UPDATE lista_preco SET nome = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedListaPreco] = await connection.execute(query, [nome, dateUTC, 1, id]);
    return updatedListaPreco;
}

module.exports = {
    getAll,
    createListaPreco,
    deleteListaPreco,
    updateListaPreco
};