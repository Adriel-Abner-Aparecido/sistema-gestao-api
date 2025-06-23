const formasPagamentoModel = require('../models/formasPagamentoModel');

const getAll = async (req, res) => {
    const [formasPagamento] = await formasPagamentoModel.getAll(req.usuario);
    return res.status(200).json(formasPagamento);
};

const getById = async (req, res) => {
    const { id } = req.params;

    const [formasPagamento] = await formasPagamentoModel.getById(id, req.usuario);

    return res.status(200).json(formasPagamento);
};

const createFormaPagamento = async (req, res) => {
    const createdFormaPagamento = await formasPagamentoModel.createFormaPagamento(req.body, req.usuario);
    return res.status(201).json(createdFormaPagamento);
}

const deleteFormaPagamento = async (req, res) => {
    const { id } = req.params;

    await formasPagamentoModel.deleteFormaPagamento(id);
    return res.status(204).json();
}

const updateFormaPagamento = async (req, res) => {
    const { id } = req.params;

    await formasPagamentoModel.updateFormaPagamento(id, req.body, req.usuario);
    return res.status(204).json();
}

module.exports = {
    getAll,
    getById,
    createFormaPagamento,
    deleteFormaPagamento,
    updateFormaPagamento
};