const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const cor = await connection.execute('SELECT * FROM cor WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return cor;
};

const getCor = async (corId, usuarioLogado) => {
    const cor = await connection.execute('SELECT * FROM cor WHERE deleted_at IS NULL AND id = ? AND empresa_id = ?', [corId, usuarioLogado.empresa_id]);

    return cor;
};

const createCor = async (cor, usuarioLogado) => {
    const { nome } = cor;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO cor(nome, created_at, empresa_id) VALUES (?, ?, ?)';

    const [createdCor] = await connection.execute(query, [nome, dateUTC, usuarioLogado.empresa_id]);

    return {insertId: createdCor.insertId};
}

const deleteCor = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedCor] = await connection.execute('UPDATE cor SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedCor;
}

const updateCor = async (id, cor, usuarioLogado) => {
    const { nome } = cor;

    const dateUTC = new Date(Date.now()).toUTCString();
    
    const query = 'UPDATE cor SET nome = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedCor] = await connection.execute(query, [nome, dateUTC, usuarioLogado.empresa_id, id]);
    return updatedCor;
}

module.exports = {
    getAll,
    getCor,
    createCor,
    deleteCor,
    updateCor
};