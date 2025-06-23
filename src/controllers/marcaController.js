const marcaModel = require('../models/marcaModel');

const getAll = async (req, res) => {

    const [marca] = await marcaModel.getAll(req.usuario);

    return res.status(200).json(marca);
};

const createMarca = async (req, res) => {
    const createdMarca = await marcaModel.createMarca(req.body, req.usuario);

    return res.status(201).json(createdMarca);
}

const deleteMarca = async (req, res) => {
    const { id } = req.params;

    await marcaModel.deleteMarca(id);
    return res.status(204).json();
}

const updateMarca = async (req, res) => {
    const { id } = req.params;

    await marcaModel.updateMarca(id, req.body, req.usuario)
    return res.status(204).json();
}

module.exports = {
    getAll,
    createMarca,
    deleteMarca,
    updateMarca
};