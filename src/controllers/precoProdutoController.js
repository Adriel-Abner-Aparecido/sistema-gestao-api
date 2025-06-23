const precoProdutoModel = require('../models/precoProdutoModel');

const getAll = async (req, res) => {

    const [precoProduto] = await precoProdutoModel.getAll(req.usuario);

    return res.status(200).json(precoProduto);
};

const createPrecoProduto = async (req, res) => {
    const createdPrecoProduto = await precoProdutoModel.createPrecoProduto(req.body, req.usuario);

    if (createdPrecoProduto.erro !== undefined) {
        return res.status(400).json({ erro: createdPrecoProduto.erro })
    } else {
        return res.status(201).json(createdPrecoProduto);
    }
}

const deletePrecoProduto = async (req, res) => {
    const { id } = req.params;

    await precoProdutoModel.deletePrecoProduto(id);
    return res.status(204).json();
}

const updatePrecoProduto = async (req, res) => {

    const { id } = req.params;

    const updatedPrecoProduto = await precoProdutoModel.updatePrecoProduto(id, req.body, req.usuario)

    if (updatedPrecoProduto.erro !== undefined) {
        return res.status(400).json({ erro: updatedPrecoProduto.erro })
    } else {
        return res.status(201).json(updatedPrecoProduto);
    }
}

module.exports = {
    getAll,
    createPrecoProduto,
    deletePrecoProduto,
    updatePrecoProduto
};