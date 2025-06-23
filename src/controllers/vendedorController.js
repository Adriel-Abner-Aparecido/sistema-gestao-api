const vendedorModel = require('../models/vendedorModel');

const getAll = async (req, res) => {

    const [vendedor] = await vendedorModel.getAll(req.usuario);

    return res.status(200).json(vendedor);
};

const getByIdUsuario = async (req, res) => {

    const { idUser } = req.params

    const [vendedor] = await vendedorModel.getByIdUsuario(idUser, req.usuario)

    return res.status(200).json(vendedor)

}

const getComissao = async (req, res) => {

    const { inicio, final } = req.params

    try {

        const relatorio = await vendedorModel.relatorioComissao(inicio, final, req.usuario)

        return res.status(201).json(relatorio)

    } catch (error) {
        throw new Error(error)
    }

}

const createVendedor = async (req, res) => {

    const createdVendedor = await vendedorModel.createVendedor(req.body, req.usuario);

    return res.status(201).json(createdVendedor);
}

const deleteVendedor = async (req, res) => {
    const { id } = req.params;

    await vendedorModel.deleteVendedor(id);
    return res.status(204).json();
}

const updateVendedor = async (req, res) => {
    const { id } = req.params;

    const atualizado = await vendedorModel.updateVendedor(id, req.body, req.usuario)

    return res.status(201).json(atualizado);
}

module.exports = {
    getAll,
    getByIdUsuario,
    getComissao,
    createVendedor,
    deleteVendedor,
    updateVendedor
};