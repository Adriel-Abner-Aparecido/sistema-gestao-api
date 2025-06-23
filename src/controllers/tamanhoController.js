const tamanhoModel = require('../models/tamanhoModel');

const getAll = async (req, res) => {

    const [tamanho] = await tamanhoModel.getAll(req.usuario);

    return res.status(200).json(tamanho);
};

const getTamanho = async (req, res) => {
    const { id } = req.params;

    const [tamanho] = await tamanhoModel.getTamanho(id, req.usuario);

    return res.status(200).json(tamanho);
};

const createTamanho = async (req, res) => {
    const createdTamanho = await tamanhoModel.createTamanho(req.body, req.usuario);

    return res.status(201).json(createdTamanho);
}

const deleteTamanho = async (req, res) => {
    const { id } = req.params;

    await tamanhoModel.deleteTamanho(id);
    return res.status(204).json();
}

const updateTamanho = async (req, res) => {
    const { id } = req.params;

    await tamanhoModel.updateTamanho(id, req.body, req.usuario)
    return res.status(204).json();
}

module.exports = {
    getAll,
    getTamanho,
    createTamanho,
    deleteTamanho,
    updateTamanho
};