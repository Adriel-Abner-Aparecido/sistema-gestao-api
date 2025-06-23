const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const kit = await connection.execute('SELECT * FROM kit WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return kit;
};

const createKit = async (kit, usuarioLogado) => {
    const { nome, produtoId } = kit;

    const [produto] = await connection.execute('SELECT * FROM produto WHERE id = ? AND empresa_id = ?', [produtoId, usuarioLogado.empresa_id]);

    if (produto.length == 0) {
        return { erro: "Não existe esse produto" };
    } else {
        const dateUTC = new Date(Date.now()).toUTCString();

        const query = 'INSERT INTO kit(nome, produto_id, created_at, empresa_id) VALUES (?, ?, ?, ?)';

        const [createdKit] = await connection.execute(query, [nome, produtoId, dateUTC, usuarioLogado.empresa_id]);

        return { insertId: createdKit.insertId };
    }
}

const deleteKit = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedKit] = await connection.execute('UPDATE kit SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedKit;
}

const updateKit = async (id, kit, usuarioLogado) => {
    const { nome, produtoId } = kit;

    const [produto] = await connection.execute('SELECT * FROM produto WHERE id = ? AND empresa_id = ?', [produtoId, usuarioLogado.empresa_id]);

    if (produto.length == 0) {
        return { erro: "Não existe esse produto" };
    } else {
        const dateUTC = new Date(Date.now()).toUTCString();

        const query = 'UPDATE kit SET nome = ?, produto_id = ?, updated_at = ? empresa_id = ? WHERE id = ?';

        const [updatedKit] = await connection.execute(query, [nome, produtoId, dateUTC, usuarioLogado.empresa_id, id]);
        return updatedKit;
    }
}

module.exports = {
    getAll,
    createKit,
    deleteKit,
    updateKit
};