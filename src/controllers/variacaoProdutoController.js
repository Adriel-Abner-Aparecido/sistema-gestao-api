const variacaoProdutoModel = require('../models/variacaoProdutoModel');

const getAll = async (req, res) => {

    const [variacaoProduto] = await variacaoProdutoModel.getAll(req.usuario);

    return res.status(200).json(variacaoProduto);
};

const generateUniqueCode = async (req, res) => {

    try {
        const newCode = await variacaoProdutoModel.generateUniqueProductCode(req.usuario);

        res.status(201).json({ codigo: newCode });

    } catch (error) {

        console.error("Erro ao gerar código:", error);
        res.status(500).json({ error: "Erro interno ao gerar código" });

    }

}

const createVariacaoProduto = async (req, res) => {
    const createdVariacaoProduto = await variacaoProdutoModel.createVariacaoProduto(req.body, req.usuario);

    if (createdVariacaoProduto.erro !== undefined) {
        return res.status(400).json({ erro: createdVariacaoProduto.erro })
    } else {
        return res.status(201).json(createdVariacaoProduto);
    }
}

const deleteVariacaoProduto = async (req, res) => {
    const { id } = req.params;

    await variacaoProdutoModel.deleteVariacaoProduto(id);
    return res.status(204).json();
}

const updateVariacaoProduto = async (req, res) => {
    const { id } = req.params;

    const updatedVariacaoProduto = await variacaoProdutoModel.updateVariacaoProduto(id, req.body, req.usuario)

    if (updatedVariacaoProduto.erro !== undefined) {
        return res.status(400).json({ erro: updatedVariacaoProduto.erro })
    } else {
        return res.status(201).json(updatedVariacaoProduto);
    }
}

module.exports = {
    generateUniqueCode,
    getAll,
    createVariacaoProduto,
    deleteVariacaoProduto,
    updateVariacaoProduto
};