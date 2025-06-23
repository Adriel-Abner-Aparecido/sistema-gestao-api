const operacoesModel = require("../models/operacoesModel")

const createOperacao = async (req, res) => {

    const createdoperacao = await operacoesModel.createOperacao(req.body, req.usuario)

    res.status(200).json(createdoperacao)

}

const getByCaixa = async (req, res) => {

    const { id } = req.params

    const operacoescaixa = await operacoesModel.getByIdCaixa(id, req.usuario)

    res.status(200).json(operacoescaixa);

}

const deleteOperacao = async (req, res) => {

    const { id } = req.params

    const deleteOperacao = await operacoesModel.deleteOperacao(id)

    res.status(200).json(deleteOperacao)
}

const updateOperacao = async (req, res) => {

    const { id } = req.params

    const update = await operacoesModel.updateOperacao(id, req.body)

    res.status(201).json(update)

}

module.exports = {
    createOperacao,
    getByCaixa,
    deleteOperacao,
    updateOperacao
}