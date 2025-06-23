const pagamentoPagoModel = require('../models/pagamentoPagoModel');

const getAll = async (req, res) => {
    const [pagamentoPago] = await pagamentoPagoModel.getAll(req.usuario);
    return res.status(200).json(pagamentoPago);
};

const createPagamentoPago = async (req, res) => {
    const createdPagamentoPago = await pagamentoPagoModel.createPagamentoPago(req.body, req.usuario);
    return res.status(201).json(createdPagamentoPago);
}

const deletePagamentoPago = async (req, res) => {
    const { id } = req.params;
    await pagamentoPagoModel.deletePagamentoPago(id);
    return res.status(204).json();
}

const updatePagamentoPago = async (req, res) => {
    const { id } = req.params;
    const updatedPagamentoPago = await pagamentoPagoModel.updatePagamentoPago(id, req.body, req.usuario);
    return res.status(201).json(updatedPagamentoPago);
}

module.exports = {
    getAll,
    createPagamentoPago,
    deletePagamentoPago,
    updatePagamentoPago
};
