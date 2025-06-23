const categoriaModel = require('../models/categoriaModel');

const getAll = async (req, res) => {

    const [categoria] = await categoriaModel.getAll(req.usuario);

    return res.status(200).json(categoria);
};

const getCategoria = async (req, res) => {
    const { id } = req.params;

    const [categoria] = await categoriaModel.getCategoria(id, req.usuario);

    return res.status(200).json(categoria);
};

const createCategoria = async (req, res) => {
    const createdCategoria = await categoriaModel.createCategoria(req.body, req.usuario);

    return res.status(201).json(createdCategoria);
}

const deleteCategoria = async (req, res) => {
    const { id } = req.params;

    await categoriaModel.deleteCategoria(id, req.usuario);
    return res.status(204).json();
}

const updateCategoria = async (req, res) => {
    const { id } = req.params;

    await categoriaModel.updateCategoria(id, req.body, req.usuario);
    return res.status(204).json();
}

module.exports = {
    getAll,
    getCategoria,
    createCategoria,
    deleteCategoria,
    updateCategoria
};