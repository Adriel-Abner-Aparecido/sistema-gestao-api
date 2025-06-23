const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const tamanho = await connection.execute('SELECT * FROM tamanho WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return tamanho;
};

const getTamanho = async (tamanhoId, usuarioLogado) => {
    const tamanho = await connection.execute('SELECT * FROM tamanho WHERE deleted_at IS NULL AND id = ? AND empresa_id = ?', [tamanhoId, usuarioLogado.empresa_id]);

    return tamanho;
};

const createTamanho = async (tamanho, usuarioLogado) => {
    const { nome } = tamanho;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO tamanho(nome, created_at, empresa_id) VALUES (?, ?, ?)';

    const [createdTamanho] = await connection.execute(query, [nome, dateUTC, usuarioLogado.empresa_id]);

    return {insertId: createdTamanho.insertId};
}

const deleteTamanho = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedTamanho] = await connection.execute('UPDATE tamanho SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedTamanho;
}

const updateTamanho = async (id, tamanho, usuarioLogado) => {
    const { nome } = tamanho;

    const dateUTC = new Date(Date.now()).toUTCString();
    
    const query = 'UPDATE tamanho SET nome = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedTamanho] = await connection.execute(query, [nome, dateUTC, usuarioLogado.empresa_id, id]);
    return updatedTamanho;
}

module.exports = {
    getAll,
    getTamanho,
    createTamanho,
    deleteTamanho,
    updateTamanho
};