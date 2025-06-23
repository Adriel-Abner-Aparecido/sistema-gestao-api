const listaPrecoModel = require('../models/listaPrecoModel');

const getAll = async (req, res) => {

    const [listaPreco] = await listaPrecoModel.getAll();

    return res.status(200).json(listaPreco);
};

const createListaPreco = async (req, res) => {
    const createdListaPreco = await listaPrecoModel.createListaPreco(req.body);

    return res.status(201).json(createdListaPreco);
}

const deleteListaPreco = async (req, res) => {
    const { id } = req.params;

    await listaPrecoModel.deleteListaPreco(id);
    return res.status(204).json();
}

const updateListaPreco = async (req, res) => {
    const { id } = req.params;

    await listaPrecoModel.updateListaPreco(id, req.body)
    return res.status(204).json();
}

module.exports = {
    getAll,
    createListaPreco,
    deleteListaPreco,
    updateListaPreco
};