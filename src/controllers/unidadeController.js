const unidadeModel = require('../models/unidadeModel');

const getAll = async (req, res) => {

    const [unidade] = await unidadeModel.getAll(req.usuario);

    return res.status(200).json(unidade);
};

const createUnidade = async (req, res) => {
    const createdUnidade = await unidadeModel.createUnidade(req.body, req.usuario);

    return res.status(201).json(createdUnidade);
}

const deleteUnidade = async (req, res) => {
    const { id } = req.params;

    await unidadeModel.deleteUnidade(id);
    return res.status(204).json();
}

const updateUnidade = async (req, res) => {
    const { id } = req.params;

    await unidadeModel.updateUnidade(id, req.body, req.usuario)
    return res.status(204).json();
}

module.exports = {
    getAll,
    createUnidade,
    deleteUnidade,
    updateUnidade
};