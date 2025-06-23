const contaPagarModel = require('../models/contaPagarModel');

const getAll = async (req, res) => {
    const [contaPagar] = await contaPagarModel.getAll(req.usuario);

    return res.status(200).json(contaPagar);
};

const getByFornecedor = async (req, res) => {
    const { idFornecedor } = req.params;

    const [contaPagar] = await contaPagarModel.getByFornecedor(idFornecedor, req.usuario);

    return res.status(200).json(contaPagar);
};

const getByDate = async (req, res) => {
    const { startDate, endDate } = req.query;

    // Validar se startDate e endDate foram fornecidos
    if (!startDate || !endDate) {
        return res.status(400).json({ mensagem: "Data de início e data de fim são necessárias." });
    }

    try {
        const contaPagar = await contaPagarModel.getByDate(startDate, endDate, req.usuario);
        return res.status(200).json(contaPagar);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao buscar contas por data", error: error.message });
    }
};

const getPage = async (req, res) => {
    const { page, limit } = req.params;

    const contaPagar = await contaPagarModel.getPage(req.usuario, page, limit);

    return res.status(200).json(contaPagar);
};

const createContaPagar = async (req, res) => {
    const createdContaPagar = await contaPagarModel.createContaPagar(req.body, req.usuario);

    return res.status(201).json(createdContaPagar);
}

const deleteContaPagar = async (req, res) => {
    const { id } = req.params;

    await contaPagarModel.deleteContaPagar(id);
    return res.status(204).json();
}

const updateContaPagar = async (req, res) => {
    const { id } = req.params;

    const updatedContaPagar = await contaPagarModel.updateContaPagar(id, req.body, req.usuario);
    return res.status(201).json(updatedContaPagar);
}

module.exports = {
    getAll,
    getByFornecedor,
    getPage,
    createContaPagar,
    deleteContaPagar,
    updateContaPagar,
    getByDate
};
