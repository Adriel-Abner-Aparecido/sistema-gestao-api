const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const marca = await connection.execute('SELECT * FROM marca WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return marca;
};

const createMarca = async (marca, usuarioLogado) => {
    const { nome } = marca;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO marca(nome, created_at, empresa_id) VALUES (?, ?, ?)';

    const [createdMarca] = await connection.execute(query, [nome, dateUTC, usuarioLogado.empresa_id]);

    return {insertId: createdMarca.insertId};
}

const deleteMarca = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedMarca] = await connection.execute('UPDATE marca SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedMarca;
}

const updateMarca = async (id, marca, usuarioLogado) => {
    const { nome } = marca;

    const dateUTC = new Date(Date.now()).toUTCString();
    
    const query = 'UPDATE marca SET nome = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedMarca] = await connection.execute(query, [nome, dateUTC, usuarioLogado.empresa_id, id]);
    return updatedMarca;
}

module.exports = {
    getAll,
    createMarca,
    deleteMarca,
    updateMarca
};