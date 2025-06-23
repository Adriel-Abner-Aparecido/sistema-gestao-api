const clienteModel = require('../models/clienteModel');
const { createEndereco, updateEndereco } = require('../models/enderecoModel');

const getAll = async (req, res) => {

    const [cliente] = await clienteModel.getAll(req.usuario);

    return res.status(200).json(cliente);
};

const getTopClientes = async (req, res) => {

    const [cliente] = await clienteModel.getTopClientes(req.usuario);

    return res.status(200).json(cliente);
};

const getPage = async (req, res) => {
    const { page, limit } = req.params;

    const cliente = await clienteModel.getPage(req.usuario, page, limit);

    return res.status(200).json(cliente);
};

const getById = async (req, res) => {
    const { id } = req.params;

    const [cliente] = await clienteModel.getById(id, req.usuario);

    return res.status(200).json(cliente);
};

const getByNome = async (req, res) => {

    const { nomecpf } = req.params;

    const cliente = await clienteModel.getByNome(nomecpf, req.usuario);

    const resultado = Array.isArray(cliente) ? cliente : []

    return res.status(200).json(resultado);
};

const createCliente = async (req, res) => {

    const cliente = req.body

    try {

        const dataCliente = {
            nome: cliente.nome,
            telefone: cliente.telefone,
            celular: cliente.celular,
            email: cliente.email,
            tipoPessoa: cliente.tipoPessoa,
            cnpjCpf: cliente.cnpjCpf,
            fantasia: cliente.fantasia,
            observacao: cliente.observacao,
            inscricaoEstadual: cliente.inscricaoEstadual,
            dataNascimento: cliente.dataNascimento,
        }

        const createdCliente = await clienteModel.createCliente(dataCliente, req.usuario);

        if (createdCliente) {

            const dataEndereco = {
                fornecedorId: null,
                clienteId: createdCliente.insertId,
                vendedorId: null,
                rua: cliente.rua ?? null,
                numero: cliente.numero ?? null,
                bairro: cliente.bairro ?? null,
                cep: cliente.cep ?? null,
                cidade: cliente.cidade ?? null,
                uf: cliente.uf ?? null,
                complemento: cliente.complemento ?? null
            }

            await createEndereco(dataEndereco, req.usuario)

            return res.status(201).json(createdCliente);

        }

    } catch (error) {

        res.status(500).json({ error })
        throw new Error(error)

    }

}

const deleteCliente = async (req, res) => {
    const { id } = req.params;

    const deletedCliente = await clienteModel.deleteCliente(id);

    return res.status(201).json(deletedCliente);
}

const updateCliente = async (req, res) => {

    const { id } = req.params;
    const cliente = req.body;

    console.log(cliente)

    try {

        const dataCliente = {
            nome: cliente.nome,
            telefone: cliente.telefone,
            celular: cliente.celular,
            email: cliente.email,
            tipoPessoa: cliente.tipoPessoa,
            cnpjCpf: cliente.cnpjCpf,
            fantasia: cliente.fantasia,
            observacao: cliente.observacao,
            inscricaoEstadual: cliente.inscricaoEstadual,
            dataNascimento: cliente.dataNascimento,
        }

        const updatedCliente = await clienteModel.updateCliente(id, dataCliente, req.usuario)

        console.log(updatedCliente)

        if (updatedCliente.affectedRows === 1) {

            const dataEndereco = {
                fornecedorId: null,
                clienteId: cliente.id,
                vendedorId: null,
                rua: cliente.rua,
                numero: cliente.numero,
                bairro: cliente.bairro,
                cep: cliente.cep,
                cidade: cliente.cidade,
                uf: cliente.uf,
                complemento: cliente.complemento
            }

            await updateEndereco(cliente.enderecoId || null, dataEndereco, req.usuario)

            return res.status(201).json(updatedCliente);

        }

    } catch (error) {
        res.status(500).json({ error: error })
    }

}

module.exports = {
    getAll,
    getPage,
    getById,
    getByNome,
    getTopClientes,
    createCliente,
    deleteCliente,
    updateCliente
};