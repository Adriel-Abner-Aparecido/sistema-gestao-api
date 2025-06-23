const colecaoModel = require('../models/colecaoModel');

const getAll = async (req, res) => {

    const [colecao] = await colecaoModel.getAll(req.usuario);

    return res.status(200).json(colecao);
};

const createColecao = async (req, res) => {
    const createdColecao = await colecaoModel.createColecao(req.body, req.usuario);

    return res.status(201).json(createdColecao);
}

const deleteColecao = async (req, res) => {
    const { id } = req.params;

    await colecaoModel.deleteColecao(id);
    return res.status(204).json();
}

const updateColecao = async (req, res) => {
    const { id } = req.params;

    await colecaoModel.updateColecao(id, req.body, req.usuario)
    return res.status(204).json();
}

module.exports = {
    getAll,
    createColecao,
    deleteColecao,
    updateColecao
};