const tipoProdutoModel = require('../models/tipoProdutoModel');

const getAll = async (req, res) => {

    const [tipoProduto] = await tipoProdutoModel.getAll();

    return res.status(200).json(tipoProduto);
};

const createTipoProduto = async (req, res) => {
    const createdTipoProduto = await tipoProdutoModel.createTipoProduto(req.body);

    return res.status(201).json(createdTipoProduto);
}

const deleteTipoProduto = async (req, res) => {
    const { id } = req.params;

    await tipoProdutoModel.deleteTipoProduto(id);
    return res.status(204).json();
}

const updateTipoProduto = async (req, res) => {
    const { id } = req.params;

    await tipoProdutoModel.updateTipoProduto(id, req.body)
    return res.status(204).json();
}

module.exports = {
    getAll,
    createTipoProduto,
    deleteTipoProduto,
    updateTipoProduto
};