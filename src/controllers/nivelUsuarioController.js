const nivelUsuarioModel = require('../models/nivelUsuarioModel')
const getAllNiveis = async (req, res) => {

    const niveis = await nivelUsuarioModel.getAll(req.usuario)

    res.status(200).json(niveis)
}

module.exports = {
    getAllNiveis
}