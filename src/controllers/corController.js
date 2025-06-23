const corModel = require('../models/corModel');

const getAll = async (req, res) => {

    const [cor] = await corModel.getAll(req.usuario);

    return res.status(200).json(cor);
};

const getCor = async (req, res) => {
    const { id } = req.params;

    const [cor] = await corModel.getCor(id, req.usuario);

    return res.status(200).json(cor);
};

const createCor = async (req, res) => {
    const createdCor = await corModel.createCor(req.body, req.usuario);

    return res.status(201).json(createdCor);
}

const deleteCor = async (req, res) => {
    const { id } = req.params;

    await corModel.deleteCor(id);
    return res.status(204).json();
}

const updateCor = async (req, res) => {
    const { id } = req.params;

    await corModel.updateCor(id, req.body, req.usuario)
    return res.status(204).json();
}

module.exports = {
    getAll,
    getCor,
    createCor,
    deleteCor,
    updateCor
};