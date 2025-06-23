const pagamentoModel = require('../models/pagamentoModel');

const getAll = async (req, res) => {
    const pagamentos = await pagamentoModel.getAll(req.usuario);

    return res.status(200).json(pagamentos);
};

const getPagamento = async (req, res) => {
    const { id } = req.params;

    const [pagamento] = await pagamentoModel.getPagamento(id, req.usuario);

    return res.status(200).json(pagamento);
};

const createPagamento = async (req, res) => {
    const createdPagamento = await pagamentoModel.createPagamento(req.body, req.usuario);

    return res.status(201).json(createdPagamento);
}

const deletePagamento = async (req, res) => {
    const { id } = req.params;

    await pagamentoModel.deletePagamento(id);
    return res.status(204).json();
}

const updatePagamento = async (req, res) => {
    const { id } = req.params;

    await pagamentoModel.updatePagamento(id, req.body, req.usuario)
    return res.status(204).json();
}

const getVencimentoInfo = async (req, res) => {
    const vencimentoInfo = await pagamentoModel.getVencimentoInfo(req.usuario);

    return res.status(200).json(vencimentoInfo);
};

module.exports = {
    getAll,
    getPagamento,
    createPagamento,
    deletePagamento,
    updatePagamento,
    getVencimentoInfo
};
