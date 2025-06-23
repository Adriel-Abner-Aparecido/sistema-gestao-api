const categoriaContasModel = require('../models/categoriaContasModel');

const getAll = async (req, res) => {

    const [categoriaContas] = await categoriaContasModel.getAll(req.usuario);

    return res.status(200).json(categoriaContas);
};

const createCategoriaContas = async (req, res) => {
    const createdCategoriaContas = await categoriaContasModel.createCategoriaContas(req.body, req.usuario);

    return res.status(201).json(createdCategoriaContas);
}

const deleteCategoriaContas = async (req, res) => {
    const { id } = req.params;

    await categoriaContasModel.deleteCategoriaContas(id);
    return res.status(204).json();
}

const updateCategoriaContas = async (req, res) => {
    const { id } = req.params;

    await categoriaContasModel.updateCategoriaContas(id, req.body, req.usuario)
    return res.status(204).json();
}

module.exports = {
    getAll,
    createCategoriaContas,
    deleteCategoriaContas,
    updateCategoriaContas
};
