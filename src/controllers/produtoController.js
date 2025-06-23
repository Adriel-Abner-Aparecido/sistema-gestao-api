const produtoModel = require('../models/produtoModel');

const getAll = async (req, res) => {

    const [produto] = await produtoModel.getAll(req.usuario);

    return res.status(200).json(produto);
};

const createProduto = async (req, res) => {
    const createdProduto = await produtoModel.createProduto(req.body, req.usuario);

    if (createdProduto.erro !== undefined) {
        return res.status(400).json({ erro: createdProduto.message })
    } else {
        return res.status(201).json(createdProduto);
    }

}

const deleteProduto = async (req, res) => {
    const { id } = req.params;

    const deletedProduto = await produtoModel.deleteProduto(id, req.usuario);
    return res.status(204).json(deletedProduto);
}

const updateProduto = async (req, res) => {
    const { id } = req.params;

    const updatedProduto = await produtoModel.updateProduto(id, req.body, req.usuario)

    if (updatedProduto.erro !== undefined) {
        return res.status(400).json({ erro: updatedProduto.erro })
    } else {
        return res.status(201).json(updatedProduto);
    }
}

module.exports = {
    getAll,
    createProduto,
    deleteProduto,
    updateProduto
};