const fluxoDeCaixa = require('../models/fluxoDeCaixaModel');

const getAll = async (req, res) => {

    const { periodo, page, limit } = req.params

    const fluxoCaixa = await fluxoDeCaixa.getAll(periodo, page, limit, req.usuario);

    return res.status(200).json(fluxoCaixa);
};

module.exports = {
    getAll
}