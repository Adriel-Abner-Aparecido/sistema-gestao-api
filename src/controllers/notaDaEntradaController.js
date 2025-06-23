const notasDaEntradaModel = require('../models/notasDaEntradaModel')

const createNotaDaEntrada = async (req, res) => {

    try {
        const create = await notasDaEntradaModel.createNotaEntrada(req.body, req.usuario)

        res.status(200).json(create)

    } catch (error) {
        console.error('Erro interno do servidor.', error)
        res.status(500).json({
            message: 'Erro interno no servidor ao tentar salvar nota da entrada.'
        })
    }

}

const getById = async (req, res) => {

    const { id } = req.params

    if (id || id !== null || id !== undefined) {
        try {
            const dados = await notasDaEntradaModel.getById(id, req.usuario)
            res.status(200).json(dados)
        } catch (error) {
            console.erro("Erro ao buscar dados da nota de entrada")
            res.status(500).json({
                message: "Erro interno do servidor ao tentar buscar dados da nota de entrada!"
            })
        }
    } else {
        res.status(404).json({
            message: "Id da nota não informado"
        })
    }

}

module.exports = {
    createNotaDaEntrada,
    getById
}