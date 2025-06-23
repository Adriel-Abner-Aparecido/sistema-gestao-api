const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const subcategoria = await connection.execute('SELECT * FROM sub_categoria WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return subcategoria;
};

const getByCategoria = async (categoriaId, usuarioLogado) => {
    const subcategoria = await connection.execute('SELECT * FROM sub_categoria WHERE deleted_at IS NULL and categoria_id = ? AND empresa_id = ?', [categoriaId, usuarioLogado.empresa_id]);

    return subcategoria;
};

const createSubcategoria = async (subcategoria, usuarioLogado) => {
    const { nome, categoriaId } = subcategoria;

    const [categoria] = await connection.execute('SELECT * FROM categoria WHERE id = ? AND empresa_id = ?', [categoriaId, usuarioLogado.empresa_id]);

    if (categoria.length == 0) {
        return { erro: "Não existe essa categoria" };
    } else {
        const dateUTC = new Date(Date.now()).toUTCString();

        const query = 'INSERT INTO sub_categoria(nome, categoria_id, created_at, empresa_id) VALUES (?, ?, ?, ?)';

        const [createdSubcategoria] = await connection.execute(query, [nome, categoriaId, dateUTC, usuarioLogado.empresa_id]);

        return { insertId: createdSubcategoria.insertId };
    }
}

const deleteSubcategoria = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedSubcategoria] = await connection.execute('UPDATE sub_categoria SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedSubcategoria;
}

const updateSubcategoria = async (id, subcategoria, usuarioLogado) => {
    const { nome, categoriaId } = subcategoria;

    const [categoria] = await connection.execute('SELECT * FROM categoria WHERE id = ? AND empresa_id = ?', [categoriaId, usuarioLogado.empresa_id]);

    if (categoria.length == 0) {
        return { erro: "Não existe essa categoria" };
    } else {
        const dateUTC = new Date(Date.now()).toUTCString();

        const query = 'UPDATE sub_categoria SET nome = ?, categoria_id = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

        const [updatedSubcategoria] = await connection.execute(query, [nome, categoriaId, dateUTC, usuarioLogado.empresa_id, id]);
        return updatedSubcategoria;
    }
}

module.exports = {
    getAll,
    getByCategoria,
    createSubcategoria,
    deleteSubcategoria,
    updateSubcategoria
};