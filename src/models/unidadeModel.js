const connection = require('./connection');

const getAll = async () => {
    const unidade = await connection.execute('SELECT * FROM unidade WHERE deleted_at IS NULL');

    return unidade;
};

const createUnidade = async (unidade) => {
    const { nome, sigla } = unidade;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO unidade(nome, sigla, created_at, empresa_id) VALUES (?, ?, ?, ?)';

    const [createdUnidade] = await connection.execute(query, [nome, sigla, dateUTC, 1]);

    return {insertId: createdUnidade.insertId};
}

const deleteUnidade = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedUnidade] = await connection.execute('UPDATE unidade SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedUnidade;
}

const updateUnidade = async (id, unidade) => {
    const { nome, sigla } = unidade;

    const dateUTC = new Date(Date.now()).toUTCString();
    
    const query = 'UPDATE unidade SET nome = ?, sigla = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedUnidade] = await connection.execute(query, [nome, sigla, dateUTC, 1, id]);
    return updatedUnidade;
}

module.exports = {
    getAll,
    createUnidade,
    deleteUnidade,
    updateUnidade
};