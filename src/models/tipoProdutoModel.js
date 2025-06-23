const connection = require('./connection');

const getAll = async () => {
    const tipoProduto = await connection.execute('SELECT * FROM tipo_produto WHERE deleted_at IS NULL');

    return tipoProduto;
};

const createTipoProduto = async (tipoProduto) => {
    const { nome } = tipoProduto;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO tipo_produto(nome, created_at, empresa_id) VALUES (?, ?, ?)';

    const [createdTipoProduto] = await connection.execute(query, [nome, dateUTC, 1]);

    return {insertId: createdTipoProduto.insertId};
}

const deleteTipoProduto = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedTipoProduto] = await connection.execute('UPDATE tipo_produto SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedTipoProduto;
}

const updateTipoProduto = async (id, tipoProduto, usuarioLogado) => {
    const { nome } = tipoProduto;

    const dateUTC = new Date(Date.now()).toUTCString();
    
    const query = 'UPDATE tipo_produto SET nome = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedTipoProduto] = await connection.execute(query, [nome, dateUTC, 1, id]);
    return updatedTipoProduto;
}

module.exports = {
    getAll,
    createTipoProduto,
    deleteTipoProduto,
    updateTipoProduto
};