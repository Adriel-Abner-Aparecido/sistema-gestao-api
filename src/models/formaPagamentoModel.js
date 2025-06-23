const connection = require('./connection');

const getAll = async (usuarioLogado) => {

    const [formaPagamento] = await connection.execute('SELECT * FROM forma_pagamento WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return formaPagamento;

};

const getByVenda = async (idVenda, usuarioLogado) => {
    const formaPagamento = await connection.execute('SELECT * FROM forma_pagamento WHERE deleted_at IS NULL AND venda_id = ? AND empresa_id = ?', [idVenda, usuarioLogado.empresa_id]);

    return formaPagamento;
};

const createFormaPagamento = async (formaPagamento, usuarioLogado) => {
    const { vendaId, dinheiro, debito, credito, parcelaCredito, desconto, troco, crediario, parcelaCrediario } = formaPagamento;

    const [venda] = await connection.execute('SELECT * FROM venda WHERE id = ? AND empresa_id = ?', [vendaId, usuarioLogado.empresa_id]);

    if (venda.length == 0) {
        return { erro: "Não existe essa venda" };
    } else {
        const dateUTC = new Date(Date.now()).toUTCString();

        const query =
            'INSERT INTO forma_pagamento(venda_id, dinheiro, debito, credito, parcela_credito, desconto, troco, crediario, parcela_crediario, created_at, empresa_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        const [createdFormaPagamento] = await connection.execute(query, [vendaId, dinheiro, debito, credito, parcelaCredito, desconto, troco, crediario, parcelaCrediario, dateUTC, usuarioLogado.empresa_id]);

        return { insertId: createdFormaPagamento.insertId };
    }
}

const deleteFormaPagamento = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedFormaPagamento] = await connection.execute('UPDATE forma_pagamento SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedFormaPagamento;
}

const updateFormaPagamento = async (id, formaPagamento, usuarioLogado) => {
    const { vendaId, dinheiro, debito, credito, parcelaCredito, desconto, troco, crediario, parcelaCrediario } = formaPagamento;

    const [venda] = await connection.execute('SELECT * FROM venda WHERE id = ? AND empresa_id = ?', [vendaId, usuarioLogado.empresa_id]);

    if (venda.length == 0) {
        return { erro: "Não existe essa venda" };
    } else {
        const dateUTC = new Date(Date.now()).toUTCString();

        const query =
            'UPDATE forma_pagamento SET venda_id = ?, dinheiro = ?, debito = ?, credito = ?, parcela_credito = ?, desconto = ?, troco = ?, crediario = ?, parcela_crediario = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

        const [updatedFormaPagamento] = await connection.execute(query, [vendaId, dinheiro, debito, credito, parcelaCredito, desconto, troco, crediario, parcelaCrediario, dateUTC, usuarioLogado.empresa_id, id]);
        return updatedFormaPagamento;
    }
}

module.exports = {
    getAll,
    getByVenda,
    createFormaPagamento,
    deleteFormaPagamento,
    updateFormaPagamento
};