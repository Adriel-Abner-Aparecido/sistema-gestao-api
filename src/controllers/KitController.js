const kitModel = require('../models/kitModel');

const getAll = async (req, res) => {

    const [kit] = await kitModel.getAll(req.usuario);

    return res.status(200).json(kit);
};

const createKit = async (req, res) => {
    const createdKit = await kitModel.createKit(req.body, req.usuario);

    if (createdKit.erro !== undefined) {
        return res.status(400).json({ erro: createdKit.erro })
    } else {
        return res.status(201).json(createdKit);
    }
}

const deleteKit = async (req, res) => {
    const { id } = req.params;

    const deletedKit = await kitModel.deleteKit(id);
    return res.status(204).json(deletedKit);
}

const updateKit = async (req, res) => {
    const { id } = req.params;

    const updatedKit = await kitModel.updateKit(id, req.body, req.usuario)

    if (updatedKit.erro !== undefined) {
        return res.status(400).json({ erro: updatedKit.erro })
    } else {
        return res.status(201).json(updatedKit);
    }
}

module.exports = {
    getAll,
    createKit,
    deleteKit,
    updateKit
};