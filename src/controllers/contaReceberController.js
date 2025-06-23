const contaReceberModel = require('../models/contaReceberModel');

const getAll = async (req, res) => {

    const [contaReceber] = await contaReceberModel.getAll(req.usuario);

    return res.status(200).json(contaReceber);
};

const buscaContaReceber = async (req, res) => {

    const { busca, limit, page } = req.params

    const contas = await contaReceberModel.buscaContaReceber(busca, page, limit, req.usuario)

    res.status(200).json(contas)

}

const getByVenda = async (req, res) => {
    const { idVenda } = req.params;

    const [contaReceber] = await contaReceberModel.getByVenda(idVenda, req.usuario);

    return res.status(200).json(contaReceber);
};

const getByDate = async (req, res) => {
    const { startDate, endDate } = req.query;

    // Validar se startDate e endDate foram fornecidos
    if (!startDate || !endDate) {
        return res.status(400).json({ mensagem: "Data de início e data de fim são necessárias." });
    }

    try {
        const contaReceber = await contaReceberModel.getByDate(startDate, endDate, req.usuario);
        return res.status(200).json(contaReceber);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao buscar contas por data", error: error.message });
    }
};

const getByVencimento = async (req, res) => {

    const { inicio, fim, limit, page } = req.params

    try {

        const crediario = await contaReceberModel.getByVencimento(inicio, fim, limit, page, req.usuario)

        return res.status(200).json(crediario)

    } catch (error) {
        res.status(500).json({ error: error })
        throw new Error(error)
    }

}

const getRelatorioByPeriodo = async (req, res) => {

    const { inicio, fim } = req.params

    try {

        const crediario = await contaReceberModel.relatorioByPeriodo(inicio, fim, req.usuario)

        return res.status(200).json(crediario)

    } catch (error) {
        res.status(500).json({ error: error })
        throw new Error(error)
    }

}

const getByForaVencimento = async (req, res) => {

    const { limit, page } = req.params

    try {

        const atrasado = await contaReceberModel.getCrediarioEmAtraso(limit, page, req.usuario)

        res.status(200).json(atrasado)

    } catch (error) {
        res.status(500).json({ error: error })
        throw new Error(error)
    }

}

const getByCliente = async (req, res) => {

    const { id } = req.params

    try {

        const crediario = await contaReceberModel.relatorioByCliente(id, req.usuario)

        res.status(200).json(crediario)

    } catch (error) {
        res.status(500).json({ error: error })
        throw new Error(error)
    }

}

const contaReceberPeriodo = async (req, res) => {

    const { inicio, fim } = req.params

    try {

        const relatorio = await contaReceberModel.contaReceberPorPeriodo(inicio, fim, req.usuario)

        res.status(200).json(relatorio)

    } catch (error) {
        res.status(500).json({ error: error })
        throw new Error(error)
    }

}

const getPage = async (req, res) => {

    const { page, limit } = req.params;

    const contaReceber = await contaReceberModel.getPage(req.usuario, page, limit);

    return res.status(200).json(contaReceber);

};

const createContaReceber = async (req, res) => {
    const createdContaReceber = await contaReceberModel.createContaReceber(req.body, req.usuario);

    return res.status(201).json(createdContaReceber);
}

const deleteContaReceber = async (req, res) => {
    const { id } = req.params;

    await contaReceberModel.deleteContaReceber(id);
    return res.status(204).json({ message: "COnta receber removida!" });
}

const updateContaReceber = async (req, res) => {
    const { id } = req.params;

    const updatedContaReceber = await contaReceberModel.updateContaReceber(id, req.body, req.usuario);
    return res.status(201).json(updatedContaReceber);
}

module.exports = {
    getAll,
    buscaContaReceber,
    getByVenda,
    getPage,
    createContaReceber,
    deleteContaReceber,
    updateContaReceber,
    getByDate,
    getByVencimento,
    getByForaVencimento,
    getRelatorioByPeriodo,
    getByCliente,
    contaReceberPeriodo
};