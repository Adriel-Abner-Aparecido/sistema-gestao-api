const formaPagamentoModel = require('../models/formaPagamentoModel');

const getAll = async (req, res) => {

    const formapagamento = await formaPagamentoModel.getAll(req.usuario);

    return res.status(200).json(formapagamento);
};

const getByVenda = async (req, res) => {
    const { idVenda } = req.params;

    const [estoque] = await formaPagamentoModel.getByVenda(idVenda, req.usuario);

    return res.status(200).json(estoque);
};

const createFormaPagamento = async (req, res) => {
    const createdFormaPagamento = await formaPagamentoModel.createFormaPagamento(req.body, req.usuario);

    if (createdFormaPagamento.erro !== undefined) {
        return res.status(400).json({ erro: createdFormaPagamento.erro })
    } else {
        return res.status(201).json(createdFormaPagamento);
    }
}

const deleteFormaPagamento = async (req, res) => {
    const { id } = req.params;

    await formaPagamentoModel.deleteFormaPagamento(id);
    return res.status(204).json();
}

const updateFormaPagamento = async (req, res) => {
    const { id } = req.params;

    const updatedFormaPagamento = await formaPagamentoModel.updateFormaPagamento(id, req.body, req.usuario)

    if (updatedFormaPagamento.erro !== undefined) {
        return res.status(400).json({ erro: updatedFormaPagamento.erro })
    } else {
        return res.status(201).json(updatedFormaPagamento);
    }
}

module.exports = {
    getAll,
    getByVenda,
    createFormaPagamento,
    deleteFormaPagamento,
    updateFormaPagamento
};