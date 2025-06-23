const { execute } = require('../models/connection');
const { createEndereco, updateEndereco } = require('../models/enderecoModel');
const fornecedorModel = require('../models/fornecedorModel');

const getAll = async (req, res) => {

    const [fornecedor] = await fornecedorModel.getAll(req.usuario);

    return res.status(200).json(fornecedor);
};

const getPage = async (req, res) => {

    const { page, limit } = req.params

    const fornecedor = await fornecedorModel.getPerPage(req.usuario, page, limit)

    return res.status(200).json(fornecedor)

}

const getByNome = async (req, res) => {

    const { nomecnpj } = req.params;

    const [fornecedor] = await fornecedorModel.getByNome(nomecnpj, req.usuario);

    const resultado = fornecedor ? (Array.isArray(fornecedor) ? fornecedor : [fornecedor]) : []

    return res.status(200).json(resultado);

};

const getById = async (req, res) => {

    const { id } = req.params;

    const [fornecedor] = await fornecedorModel.getFornecedor(id, req.usuario);

    return res.status(200).json(fornecedor);

};

const createFornecedor = async (req, res) => {

    const fornecedor = req.body

    console.log("Controller", fornecedor)

    try {

        const dadosFornecedor = {
            celular: fornecedor.celular || null,
            cnpjCpf: fornecedor.cnpjCpf || null,
            email: fornecedor.email || null,
            fantasia: fornecedor.fantasia || null,
            nome: fornecedor.nome,
            observacao: fornecedor.observacao || null,
            telefone: fornecedor.telefone || null,
            tipoPessoa: fornecedor.tipoPessoa || 'Pessoa Jurídica',
            inscricaoEstadual: fornecedor.inscricaoEstadual || null,
        }

        const createdFornecedor = await fornecedorModel.createFornecedor(dadosFornecedor, req.usuario);

        if (createdFornecedor.insertId) {

            const dadosEndereco = {
                bairro: fornecedor.bairro || null,
                cep: fornecedor.cep || null,
                cidade: fornecedor.cidade || null,
                clienteId: null,
                fornecedorId: createdFornecedor.insertId,
                vendedorId: null,
                numero: fornecedor.numero || null,
                rua: fornecedor.rua || null,
                uf: fornecedor.uf || null,
                complemento: fornecedor.complemento || null
            }

            const create = await createEndereco(dadosEndereco, req.usuario)

            if (create.insertId) {
                res.status(201).json({ message: "Fornecedor cadastrado com sucesso." })
            }

        }

    } catch (error) {

        res.status(500).json({ message: "Erro interno do servidor", error })

        throw new Error(error)

    }

}

const deleteFornecedor = async (req, res) => {
    const { id } = req.params;

    await fornecedorModel.deleteFornecedor(id);
    return res.status(204).json();
}

const updateFornecedor = async (req, res) => {

    const { id } = req.params;

    const verificaId = await fornecedorModel.getFornecedor(id, req.usuario)

    if (verificaId.length === 0) {
        res.status(404).json({ message: "Fornecedor não encontrado" })
    }

    const fornecedor = req.body

    console.log(fornecedor)

    try {

        const dadosFornecedor = {
            celular: fornecedor.celular,
            cnpjCpf: fornecedor.cnpjCpf,
            email: fornecedor.email,
            fantasia: fornecedor.fantasia,
            nome: fornecedor.nome,
            observacao: fornecedor.observacao,
            telefone: fornecedor.telefone,
            tipoPessoa: fornecedor.tipoPessoa,
            inscricaoEstadual: fornecedor.inscricaoEstadual,
        }

        const updatedFornecedor = await fornecedorModel.updateFornecedor(fornecedor.id, dadosFornecedor, req.usuario);

        if (updatedFornecedor.affectedRows === 1) {

            const dadosEndereco = {
                id: fornecedor.enderecoId || null,
                bairro: fornecedor.bairro || null,
                cep: fornecedor.cep || null,
                cidade: fornecedor.cidade || null,
                clienteId: null,
                fornecedorId: fornecedor.fornecedorId,
                vendedorId: null,
                numero: fornecedor.numero || null,
                rua: fornecedor.rua || null,
                uf: fornecedor.uf || null,
                complemento: fornecedor.complemento || null
            }

            const update = await updateEndereco(fornecedor.enderecoId, dadosEndereco)

            if (update.affectedRows === 1) {
                res.status(201).json({ message: "Fornecedor atualizado com sucesso." })
            }

        }

    } catch (error) {

        res.status(500).json({ message: "Erro interno do servidor", error })

        throw new Error(error)

    }

}

module.exports = {
    getAll,
    getPage,
    getByNome,
    getById,
    createFornecedor,
    deleteFornecedor,
    updateFornecedor
};