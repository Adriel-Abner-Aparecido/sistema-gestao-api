const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const cstIcms = await connection.execute('SELECT * FROM cst_icms WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return cstIcms;
};

const createCstIcms = async (nCstIcms, usuarioLogado) => {
    const { cstIcms, descricao } = nCstIcms;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO cst_icms(cst_icms, descricao, created_at, empresa_id) VALUES (?, ?, ?, ?)';

    const [createdCstIcms] = await connection.execute(query, [cstIcms, descricao, dateUTC, usuarioLogado.empresa_id]);

    return {insertId: createdCstIcms.insertId};
}

const deleteCstIcms = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedCstIcms] = await connection.execute('UPDATE cst_icms SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedCstIcms;
}

const updateCstIcms = async (id, nCstIcms, usuarioLogado) => {
    const { cstIcms, descricao } = nCstIcms;

    const dateUTC = new Date(Date.now()).toUTCString();
    
    const query = 'UPDATE cst_icms SET cst_icms = ?, descricao = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedCstIcms] = await connection.execute(query, [cstIcms, descricao, dateUTC, usuarioLogado.empresa_id, id]);
    return updatedCstIcms;
}

module.exports = {
    getAll,
    createCstIcms,
    deleteCstIcms,
    updateCstIcms
};