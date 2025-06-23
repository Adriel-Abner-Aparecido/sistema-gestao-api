const empresaModel = require('../models/empresaModel');
const { createIndicacao } = require('../models/indicacaoModel');

const getAll = async (req, res) => {

    const [empresa] = await empresaModel.getAll();

    return res.status(200).json(empresa);
};

const getMinhaEmpresa = async (req, res) => {
    const [empresa] = await empresaModel.getMinhaEmpresa(req.usuario);

    return res.status(200).json(empresa);
};

const createEmpresa = async (req, res) => {

    // Obtenha o caminho da imagem do logotipo após o upload.

    const caminhoImagem = req.body.logo_image ? req.body.logo_image : null;

    // Extraia os outros campos do formulário.
    const {
        nome,
        nomeFantasia,
        cnpj,
        telefone,
        celular,
        email,
        cep,
        rua,
        numero,
        bairro,
        complemento,
        cidade,
        uf,
        emailUser,
        planoId,
        consumerKey,
        consumerSecret,
        classeImpostoPadrao,
        origem,
        indicacao
    } = req.body;

    const createdEmpresa = await empresaModel.createEmpresa({
        nome,
        nomeFantasia,
        cnpj,
        telefone,
        celular,
        email,
        cep,
        rua,
        numero,
        bairro,
        complemento,
        cidade,
        uf,
        emailUser,
        planoId,
        consumerKey,
        consumerSecret,
        classeImpostoPadrao,
        logoImage: caminhoImagem,
        origem
    });

    if (indicacao) {
        await createIndicacao(createdEmpresa.insertId, indicacao)
    }


    return res.status(201).json(createdEmpresa);
}
//teste
const deleteEmpresa = async (req, res) => {
    const { id } = req.params;

    await empresaModel.deleteEmpresa(id);
    return res.status(204).json();
}

const updateEmpresa = async (req, res) => {

    const { id } = req.params;
    const { nome, nomeFantasia, cnpj, telefone, celular, email, cep, rua, numero, bairro, complemento, cidade, uf, planoId, consumerKey, consumerSecret, classeImpostoPadrao } = req.body;

    // Obtenha o caminho da imagem do logotipo após o upload, mas verifique se ele existe no FormData.
    const caminhoImagem = req.body.logo_image ? req.body.logo_image : null;

    // Atualize os detalhes da empresa, incluindo o novo caminho da imagem (se existir no FormData).
    const updatedEmpresa = await empresaModel.updateEmpresa(id, {
        nome,
        nomeFantasia,
        cnpj,
        telefone,
        celular,
        email,
        cep,
        rua,
        numero,
        bairro,
        complemento,
        cidade,
        uf,
        planoId,
        consumerKey,
        consumerSecret,
        classeImpostoPadrao,
        logoImage: caminhoImagem, // Salve o caminho da nova imagem (se existir).
    });

    return res.status(201).json(updatedEmpresa);

}

module.exports = {
    getAll,
    createEmpresa,
    deleteEmpresa,
    updateEmpresa,
    getMinhaEmpresa
};