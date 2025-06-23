const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const categoriaContas = await connection.execute('SELECT * FROM categoria_contas WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return categoriaContas;
};

const createCategoriaContas = async (categoriaContas, usuarioLogado) => {
    const { nome } = categoriaContas;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO categoria_contas(nome, created_at, empresa_id) VALUES (?, ?, ?)';

    const [createdCategoriaContas] = await connection.execute(query, [nome, dateUTC, usuarioLogado.empresa_id]);

    return {insertId: createdCategoriaContas.insertId};
}

const deleteCategoriaContas = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedCategoriaContas] = await connection.execute('UPDATE categoria_contas SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedCategoriaContas;
}

const updateCategoriaContas = async (id, categoriaContas, usuarioLogado) => {
    const { nome } = categoriaContas;

    const dateUTC = new Date(Date.now()).toUTCString();
    
    const query = 'UPDATE categoria_contas SET nome = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedCategoriaContas] = await connection.execute(query, [nome, dateUTC, usuarioLogado.empresa_id, id]);
    return updatedCategoriaContas;
}

module.exports = {
    getAll,
    createCategoriaContas,
    deleteCategoriaContas,
    updateCategoriaContas
};
