const transportadoraModel = require('../models/transportadoraModel');

const getAll = async (req, res) => {

    const [transportadora] = await transportadoraModel.getAll(req.usuario);

    return res.status(200).json(transportadora);
};

const createTransportadora = async (req, res) => {
    const createdTransportadora = await transportadoraModel.createTransportadora(req.body, req.usuario);

    return res.status(201).json(createdTransportadora);
}

const deleteTransportadora = async (req, res) => {
    const { id } = req.params;

    await transportadoraModel.deleteTransportadora(id);
    return res.status(204).json();
}

const updateTransportadora = async (req, res) => {
    const { id } = req.params;

    await transportadoraModel.updateTransportadora(id, req.body, req.usuario)
    return res.status(204).json();
}

module.exports = {
    getAll,
    createTransportadora,
    deleteTransportadora,
    updateTransportadora
};