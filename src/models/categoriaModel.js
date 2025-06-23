const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const categoria = await connection.execute('SELECT * FROM categoria WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return categoria;
};

const getCategoria = async (categoriaId, usuarioLogado) => {
    const categoria = await connection.execute('SELECT * FROM categoria WHERE deleted_at IS NULL AND id = ? AND empresa_id = ?', [categoriaId, usuarioLogado.empresa_id]);

    return categoria;
};

const createCategoria = async (categoria, usuarioLogado) => {
    const { nome } = categoria;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO categoria(nome, created_at, empresa_id) VALUES (?, ?, ?)';

    const [createdCategoria] = await connection.execute(query, [nome, dateUTC, usuarioLogado.empresa_id]);

    // Registra log após criação da categoria
    await registrarLog(usuarioLogado.id, 'categoria', 'createCategoria', null, { nome, created_at: dateUTC, empresa_id: usuarioLogado.empresa_id });

    return {insertId: createdCategoria.insertId};
}

const deleteCategoria = async (id, usuarioLogado) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [oldCategoriaData] = await connection.execute('SELECT * FROM categoria WHERE id = ?', [id]);

    const [removedCategoria] = await connection.execute('UPDATE categoria SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    // Registra log após exclusão da categoria
    await registrarLog(usuarioLogado.id, 'categoria', 'deleteCategoria', oldCategoriaData[0], { deleted_at: dateUTC });

    return removedCategoria;
}

const updateCategoria = async (id, categoria, usuarioLogado) => {
    const { nome } = categoria;

    const dateUTC = new Date(Date.now()).toUTCString();

    const [oldCategoriaData] = await connection.execute('SELECT * FROM categoria WHERE id = ?', [id]);

    const query = 'UPDATE categoria SET nome = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedCategoria] = await connection.execute(query, [nome, dateUTC, usuarioLogado.empresa_id, id]);

    // Registra log após atualização da categoria
    const newData = { nome, updated_at: dateUTC, empresa_id: usuarioLogado.empresa_id };
    await registrarLog(usuarioLogado.id, 'categoria', 'updateCategoria', oldCategoriaData[0], newData);

    return updatedCategoria;
}

const registrarLog = async (userId, table, action, oldData, newData) => {
    await connection.execute(
        'INSERT INTO sistema_logs (usuario_id, tabela, acao, data_hora, dados_antigos, dados_novos) VALUES (?, ?, ?, NOW(), ?, ?)',
        [userId, table, action, JSON.stringify(oldData), JSON.stringify(newData)]
    );
}

module.exports = {
    getAll,
    getCategoria,
    createCategoria,
    deleteCategoria,
    updateCategoria
};