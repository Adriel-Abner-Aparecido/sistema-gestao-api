const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const formasPagamento = await connection.execute('SELECT * FROM formas_pagamento WHERE deleted_at IS NULL', [usuarioLogado.empresa_id]);
    return formasPagamento;
};

const getById = async (idFormasPagamento) => {
    const formasPagamento = await connection.execute('SELECT * FROM formas_pagamento WHERE deleted_at IS NULL AND id = ?', [idFormasPagamento]);

    return formasPagamento;
};

const createFormaPagamento = async (formaPagamento) => {
    const { nome } = formaPagamento;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO formas_pagamento(nome, created_at, empresa_id) VALUES (?, ?, ?)';

    const [createdFormaPagamento] = await connection.execute(query, [nome, dateUTC, 1]);

    return { insertId: createdFormaPagamento.insertId };
}

const deleteFormaPagamento = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedFormaPagamento] = await connection.execute('UPDATE formas_pagamento SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedFormaPagamento;
}

const updateFormaPagamento = async (id, formaPagamento) => {
    const { nome } = formaPagamento;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'UPDATE formas_pagamento SET nome = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedFormaPagamento] = await connection.execute(query, [nome, dateUTC, 1, id]);

    return updatedFormaPagamento;
}

module.exports = {
    getAll,
    getById,
    createFormaPagamento,
    deleteFormaPagamento,
    updateFormaPagamento
};