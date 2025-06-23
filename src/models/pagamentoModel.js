const connection = require('./connection');
const empresaModel = require('../models/empresaModel');

const getAll = async (usuarioLogado) => {
    const [pagamentos] = await connection.execute('SELECT * FROM pagamentos WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return pagamentos;
};

const getPagamento = async (pagamentoId, usuarioLogado) => {
    const pagamento = await connection.execute('SELECT * FROM pagamentos WHERE deleted_at IS NULL AND id = ? AND empresa_id = ?', [pagamentoId, usuarioLogado.empresa_id]);

    return pagamento;
};

const getPagamentosPendentes = async () => {
    const [pagamentos] = await connection.execute('SELECT * FROM pagamentos WHERE deleted_at IS NULL AND status = "Pendente"');

    return pagamentos;
};

const createPagamento = async (pagamento, usuarioLogado) => {
    // Extrair os campos relevantes do objeto "pagamento"
    const { valor, status, tipo, externalReference, data, idPagamentoMercadoPago, idPlanoComprado } = pagamento;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO pagamentos(valor, status, tipo, external_reference, data, id_pagamento_mercado_pago, id_plano_comprado, created_at, empresa_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const [createdPagamento] = await connection.execute(query, [valor, status, tipo, externalReference, data, idPagamentoMercadoPago, idPlanoComprado, dateUTC, usuarioLogado.empresa_id]);

    return { insertId: createdPagamento.insertId };
}

const deletePagamento = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedPagamento] = await connection.execute('UPDATE pagamentos SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedPagamento;
}

const updatePagamento = async (id, pagamento, usuarioLogado) => {
    // Extrair os campos relevantes do objeto "pagamento"
    const { valor, status, tipo, externalReference, data, idPagamentoMercadoPago, idPlanoComprado } = pagamento;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'UPDATE pagamentos SET valor = ?, status = ?, tipo = ?, external_reference = ?, data = ?, id_pagamento_mercado_pago = ?, id_plano_comprado = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedPagamento] = await connection.execute(query, [valor, status, tipo, externalReference, data, idPagamentoMercadoPago, idPlanoComprado, dateUTC, usuarioLogado.empresa_id, id]);
    return updatedPagamento;
}

const updatePagamentoStatus = async (idPagamento, status) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'UPDATE pagamentos SET status = ?, updated_at = ? WHERE id_pagamento_mercado_pago = ?';
    const [updatedRows] = await connection.execute(query, [status, dateUTC, idPagamento]);
    return updatedRows;
};

const getVencimentoInfo = async (usuarioLogado) => {
    // Obtendo a data de hoje
    const currentDate = new Date();

    // Consultando o banco de dados para obter o último pagamento APROVADO
    const [pagamentos] = await connection.execute(
        'SELECT * FROM pagamentos WHERE deleted_at IS NULL AND status = "Aprovado" AND empresa_id = ? ORDER BY id DESC LIMIT 1',
        [usuarioLogado.empresa_id]
    );

    if (!pagamentos.length) {
        return { mensagem: "Nenhum pagamento aprovado encontrado", dias: null };
    }

    const dataPagamento = new Date(pagamentos[0].data);
    // Adicionando um ano (365 dias) à data do pagamento para encontrar a data de vencimento
    dataPagamento.setDate(dataPagamento.getDate() + 365);

    // Calculando a diferença em dias entre a data de vencimento e a data atual
    const diffTime = dataPagamento - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        await empresaModel.updateEmpresaPlanoId(usuarioLogado.empresa_id, 1);
        return { mensagem: "vencida", dias: Math.abs(diffDays) };
    } else if (diffDays <= 5) {
        return { mensagem: "à vencer", dias: diffDays };
    }

    return { mensagem: "em dia", dias: diffDays };
};

module.exports = {
    getAll,
    getPagamento,
    createPagamento,
    deletePagamento,
    updatePagamento,
    updatePagamentoStatus,
    getPagamentosPendentes,
    getVencimentoInfo
};
