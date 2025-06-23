const pagamentoRecebidoModel = require('../models/pagamentoRecebidoModel');

const getAll = async (req, res) => {

    const [pagamentoRecebido] = await pagamentoRecebidoModel.getAll(req.usuario);

    return res.status(200).json(pagamentoRecebido);

};

const getByContaReceber = async (req, res) => {

    const { idContaReceber } = req.params;

    const [pagamentoRecebido] = await pagamentoRecebidoModel.getByContaReceber(idContaReceber, req.usuario);

    return res.status(200).json(pagamentoRecebido);

};

const getFinanceiroReceitasPorPeriodo = async (req, res) => {

    const { dataInicio, dataFim } = req.params;

    const [pagamentoRecebido] = await pagamentoRecebidoModel.getFinanceiroReceitasPorPeriodo(req.usuario, dataInicio, dataFim);

    return res.status(200).json(pagamentoRecebido);

};

const getFormaPagamentoPorPeriodo = async (req, res) => {

    const { dataInicio, dataFim } = req.params;

    const pagamentoRecebido = await pagamentoRecebidoModel.getFormaPagamentoPorPeriodo(req.usuario, dataInicio, dataFim);

    return res.status(200).json(pagamentoRecebido);

};

const createPagamentoRecebido = async (req, res) => {

    const createdPagamentoRecebido = await pagamentoRecebidoModel.createPagamentoRecebido(req.body, req.usuario);

    return res.status(201).json(createdPagamentoRecebido);

}

const deletePagamentoRecebido = async (req, res) => {

    const { id } = req.params;

    await pagamentoRecebidoModel.deletePagamentoRecebido(id);

    return res.status(204).json();

}

const updatePagamentoRecebido = async (req, res) => {

    const { id } = req.params;

    const updatedPagamentoRecebido = await pagamentoRecebidoModel.updatePagamentoRecebido(id, req.body, req.usuario);

    return res.status(201).json(updatedPagamentoRecebido);

}

module.exports = {
    getAll,
    getByContaReceber,
    getFinanceiroReceitasPorPeriodo,
    getFormaPagamentoPorPeriodo,
    createPagamentoRecebido,
    deletePagamentoRecebido,
    updatePagamentoRecebido
};