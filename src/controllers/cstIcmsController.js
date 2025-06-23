const cstIcmsModel = require('../models/cstIcmsModel');

const getAll = async (req, res) => {

    const [cstIcms] = await cstIcmsModel.getAll(req.usuario);

    return res.status(200).json(cstIcms);
};

const createCstIcms = async (req, res) => {
    const createdCstIcms = await cstIcmsModel.createCstIcms(req.body, req.usuario);

    return res.status(201).json(createdCstIcms);
}

const deleteCstIcms = async (req, res) => {
    const { id } = req.params;

    await cstIcmsModel.deleteCstIcms(id);
    return res.status(204).json();
}

const updateCstIcms = async (req, res) => {
    const { id } = req.params;

    await cstIcmsModel.updateCstIcms(id, req.body, req.usuario)
    return res.status(204).json();
}

module.exports = {
    getAll,
    createCstIcms,
    deleteCstIcms,
    updateCstIcms
};