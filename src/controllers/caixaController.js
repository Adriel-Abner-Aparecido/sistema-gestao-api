const caixaModel = require("../models/caixaModel")

const getCaixa = async (req, res) => {

    const { id } = req.params

    const caixa = await caixaModel.getCaixa(id, req.usuario)

    res.status(200).json(caixa)
}

const getAllCaixas = async (req, res) => {

    const [caixas] = await caixaModel.getAll(req.usuario)

    res.status(200).json(caixas)
}

const getAllCaixasAbertos = async (req, res) => {

    const [caixas] = await caixaModel.getAllCaixaAberto(req.usuario)

    res.status(200).json(caixas)
}

const getPage = async (req, res) => {

    const { page, limit } = req.params

    const caixas = await caixaModel.getCaixaPage(req.usuario, page, limit);

    return res.status(200).json(caixas)
}

const createcaixa = async (req, res) => {

    const createdCaixa = await caixaModel.createCaixa(req.usuario, req.body)

    res.status(200).json(createdCaixa)
}

const updateCaixa = async (req, res) => {

    console.log(req.body)

    const update = await caixaModel.updateCaixa(req.params, req.body, req.usuario)

    res.status(201).json(update)

}

const fechaCaixa = async (req, res) => {

    const fechoucaixa = await caixaModel.fecharCaixa(req.params, req.body, req.usuario)

    res.status(200).json(fechoucaixa)
}

const reabreCaixa = async (req, res) => {

    const reabriu = await caixaModel.reabrirCaixa(req.params, req.body, req.usuario)

    res.status(200).json(reabriu)
}

module.exports = {
    getCaixa,
    getAllCaixas,
    getAllCaixasAbertos,
    getPage,
    createcaixa,
    fechaCaixa,
    reabreCaixa,
    updateCaixa
}