const produtosVendaModel = require('../models/produtosVendaModel');

const getAll = async (req, res) => {

    const [produtosDaVenda] = await produtosVendaModel.getAll(req.usuario);

    return res.status(200).json(produtosDaVenda);
};

const getByVenda = async (req, res) => {
    const { idVenda } = req.params;

    const [produtosDaVenda] = await produtosVendaModel.getByVenda(idVenda, req.usuario);

    return res.status(200).json(produtosDaVenda);
};

const getTopCincoProdutos = async (req, res) => {

    const [produtosDaVenda] = await produtosVendaModel.getTopCincoProdutos(req.usuario);

    return res.status(200).json(produtosDaVenda);
};

const createProdutosDaVenda = async (req, res) => {
    const createdProdutosDaVenda = await produtosVendaModel.createProdutosDaVenda(req.body, req.usuario);

    if (createdProdutosDaVenda.erro !== undefined) {
        return res.status(400).json({ erro: createdProdutosDaVenda.erro })
    } else {
        return res.status(201).json(createdProdutosDaVenda);
    }
}

const deleteProdutosDaVenda = async (req, res) => {
    const { id } = req.params;

    await produtosVendaModel.deleteProdutosDaVenda(id);
    return res.status(204).json();
}

const updateProdutosDaVenda = async (req, res) => {
    const { id } = req.params;

    const updatedProdutosDaVenda = await produtosVendaModel.updateProdutosDaVenda(id, req.body, req.usuario)

    if (updatedProdutosDaVenda.erro !== undefined) {
        return res.status(400).json({ erro: updatedProdutosDaVenda.erro })
    } else {
        return res.status(201).json(updatedProdutosDaVenda);
    }
}

module.exports = {
    getAll,
    getByVenda,
    getTopCincoProdutos,
    createProdutosDaVenda,
    deleteProdutosDaVenda,
    updateProdutosDaVenda
};