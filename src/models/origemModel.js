const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const origem = await connection.execute('SELECT * FROM origem WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return origem;
};

const createOrigem = async (nOrigem, usuarioLogado) => {
    const { origem, descricao } = nOrigem;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO origem(origem, descricao, created_at, empresa_id) VALUES (?, ?, ?, ?)';

    const [createdOrigem] = await connection.execute(query, [origem, descricao, dateUTC, usuarioLogado.empresa_id]);

    return {insertId: createdOrigem.insertId};
}

const deleteOrigem = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedOrigem] = await connection.execute('UPDATE origem SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedOrigem;
}

const updateOrigem = async (id, nOrigem, usuarioLogado) => {
    const { origem, descricao } = nOrigem;

    const dateUTC = new Date(Date.now()).toUTCString();
    
    const query = 'UPDATE origem SET origem = ?, descricao = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedOrigem] = await connection.execute(query, [origem, descricao, dateUTC, usuarioLogado.empresa_id, id]);
    return updatedOrigem;
}

module.exports = {
    getAll,
    createOrigem,
    deleteOrigem,
    updateOrigem
};