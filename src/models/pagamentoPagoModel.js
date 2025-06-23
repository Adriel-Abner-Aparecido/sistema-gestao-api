const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const pagamentoPago = await connection.execute('SELECT * FROM pagamento_pago WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return pagamentoPago;
};

const createPagamentoPago = async (pagamentoPago, usuarioLogado) => {

    console.log("Pagamento Pago", pagamentoPago)

    const { contaPagarId, formasPagamentoId, valorPago, parcelas, dataPagamento } = pagamentoPago;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO pagamento_pago(conta_pagar_id, formas_pagamento_id, valor_pago, parcelas, data_pagamento, created_at, empresa_id) VALUES (?, ?, ?, ?, ?, ?, ?)';

    const [createdPagamentoPago] = await connection.execute(query, [contaPagarId, formasPagamentoId, valorPago, parcelas, dataPagamento, dateUTC, usuarioLogado.empresa_id]);

    return { insertId: createdPagamentoPago.insertId };
}

const deletePagamentoPago = async (id) => {

    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedPagamentoPago] = await connection.execute('UPDATE pagamento_pago SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedPagamentoPago;

}

const updatePagamentoPago = async (id, pagamentoPago, usuarioLogado) => {

    const { contaPagarId, formasPagamentoId, valorPago, parcelas, dataPagamento } = pagamentoPago;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'UPDATE pagamento_pago SET conta_pagar_id = ?, formas_pagamento_id = ?, valor_pago = ?, parcelas = ?, data_pagamento = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedPagamentoPago] = await connection.execute(query, [contaPagarId, formasPagamentoId, valorPago, parcelas, dataPagamento, dateUTC, usuarioLogado.empresa_id, id]);

    return updatedPagamentoPago;

}

module.exports = {
    getAll,
    createPagamentoPago,
    deletePagamentoPago,
    updatePagamentoPago
};
