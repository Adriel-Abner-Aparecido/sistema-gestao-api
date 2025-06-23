const estoqueModel = require('../models/estoqueModel');

const getAll = async (req, res) => {

    const [estoque] = await estoqueModel.getAll(req.usuario);

    return res.status(200).json(estoque);
};

const getPage = async (req, res) => {
    const { page, limit, orderby, order } = req.params;

    const estoque = await estoqueModel.getPage(req.usuario, page, limit, orderby, order);

    return res.status(200).json(estoque);
};

const getEstoqueCompleto = async (req, res) => {

    const [estoque] = await estoqueModel.getEstoqueCompleto(req.usuario);

    return res.status(200).json(estoque);
};

const getEstoqueCompletoTopDez = async (req, res) => {

    const [estoque] = await estoqueModel.getEstoqueCompletoTopDez(req.usuario);

    return res.status(200).json(estoque);
};

const getEstoqueRelatorio = async (req, res) => {

    const [estoque] = await estoqueModel.getEstoqueRelatorio(req.usuario);

    return res.status(200).json(estoque);
};

const getEstoqueByNomeCodigoBarras = async (req, res) => {
    const { nomeCodigoBarras } = req.params;

    const [estoque] = await estoqueModel.getEstoqueByNomeCodigoBarras(nomeCodigoBarras, req.usuario);

    return res.status(200).json(estoque);
};

const getEstoqueById = async (req, res) => {
    const { id } = req.params;

    const [estoque] = await estoqueModel.getEstoqueById(id, req.usuario);

    return res.status(200).json(estoque);
};

const createEstoque = async (req, res) => {
    const createdEstoque = await estoqueModel.createEstoque(req.body, req.usuario);

    if (createdEstoque.erro !== undefined) {
        return res.status(400).json({ erro: createdEstoque.erro })
    } else {
        return res.status(201).json(createdEstoque);
    }
}

const deleteEstoque = async (req, res) => {

    const { id } = req.params;

    await estoqueModel.deleteEstoque(id);
    return res.status(204).json();
}

const updateEstoque = async (req, res) => {

    const { id } = req.params;

    const updatedEstoque = await estoqueModel.updateEstoque(id, req.body, req.usuario)

    if (updatedEstoque.erro !== undefined) {
        return res.status(400).json({ erro: updatedEstoque.erro })
    } else {
        return res.status(201).json(updatedEstoque);
    }
}

module.exports = {
    getAll,
    getPage,
    getEstoqueCompleto,
    getEstoqueCompletoTopDez,
    getEstoqueRelatorio,
    getEstoqueByNomeCodigoBarras,
    getEstoqueById,
    createEstoque,
    deleteEstoque,
    updateEstoque
};