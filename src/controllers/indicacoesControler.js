const { getIndicacoes, createIndicacao } = require("../models/indicacaoModel")

const cadastrarIndicacao = async (req, res) => {

    const { indicacao, indicado } = req.body

    const create = await createIndicacao(indicado, indicacao)

    console.log(create)

    res.status(201).json(create)

}

const getAll = async (req, res) => {

    const indicacoes = await getIndicacoes(req.usuario)

    res.status(200).json(indicacoes)

}

module.exports = {
    cadastrarIndicacao,
    getAll
}