const origemModel = require('../models/origemModel');

const getAll = async (req, res) => {

    const [origem] = await origemModel.getAll(req.usuario);

    return res.status(200).json(origem);
};

const createOrigem = async (req, res) => {
    const createdOrigem = await origemModel.createOrigem(req.body, req.usuario);

    return res.status(201).json(createdOrigem);
}

const deleteOrigem = async (req, res) => {
    const { id } = req.params;

    await origemModel.deleteOrigem(id);
    return res.status(204).json();
}

const updateOrigem = async (req, res) => {
    const { id } = req.params;

    await origemModel.updateOrigem(id, req.body, req.usuario)
    return res.status(204).json();
}

module.exports = {
    getAll,
    createOrigem,
    deleteOrigem,
    updateOrigem
};