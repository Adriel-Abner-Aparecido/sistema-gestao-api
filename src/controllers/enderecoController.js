const enderecoModel = require('../models/enderecoModel');

const getAll = async (req, res) => {

    const [endereco] = await enderecoModel.getAll(req.usuario);

    return res.status(200).json(endereco);
};

const getByCliente = async (req, res) => {
    const { idCliente } = req.params;

    const [endereco] = await enderecoModel.getByCliente(req.usuario, idCliente);

    return res.status(200).json(endereco);
};

const getByFornecedor = async (req, res) => {
    const { idFornecedor } = req.params;

    const [endereco] = await enderecoModel.getByFornecedor(req.usuario, idFornecedor);

    return res.status(200).json(endereco);
};

const getByVendedor = async (req, res) => {

    const { idVendedor } = req.params

    const [endereco] = await enderecoModel.getByVendedor(req.usuario, idVendedor)

    return res.status(200).json(endereco)
}

const createEndereco = async (req, res) => {
    const createdEndereco = await enderecoModel.createEndereco(req.body, req.usuario);

    return res.status(201).json(createdEndereco);
}

const deleteEndereco = async (req, res) => {
    const { id } = req.params;

    await enderecoModel.deleteEndereco(id);
    return res.status(204).json();
}

const updateEndereco = async (req, res) => {
    const { id } = req.params;

    const updatedEndereco = await enderecoModel.updateEndereco(id, req.body, req.usuario)
    return res.status(201).json(updatedEndereco);
}

module.exports = {
    getAll,
    getByCliente,
    getByFornecedor,
    getByVendedor,
    createEndereco,
    deleteEndereco,
    updateEndereco
};