const { createEmpresa } = require("../models/empresaModel")
const { createUsuario, getUsuarioByEmail } = require("../models/usuarioModel")

const Cadastrar = async (req, res) => {

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
        consumerKey,
        consumerSecret,
        classeImpostoPadrao,
        origem,
        senha
    } = req.body

    const verifiedData = {
        nome: "Empresa",
        nomeFantasia: nomeFantasia || null,
        cnpj: cnpj || null,
        telefone: telefone || null,
        celular: celular || null,
        email: email || null,
        cep: cep || null,
        rua: rua || null,
        numero: numero || null,
        bairro: bairro || null,
        complemento: complemento || null,
        cidade: cidade || null,
        uf: uf || null,
        emailUser: email || null,
        planoId: 1,
        consumerKey: consumerKey || null,
        consumerSecret: consumerSecret || null,
        classeImpostoPadrao: classeImpostoPadrao || null,
        origem: origem || "marketplace"
    }

    try {

        const verificaEmail = await getUsuarioByEmail(email)

        console.log(verificaEmail)

        if (verificaEmail) {
            return res.status(400).json({ message: "Email ja cadastrado em nossa base de dados." })
        }

        const createempresa = await createEmpresa(verifiedData)

        if (createempresa.insertId) {

            const verifiedDataUsuario = {
                empresaId: createempresa.insertId,
                username: nome,
                email,
                senha,
                nivelUsuario: 1
            }

            const createusuario = await createUsuario(verifiedDataUsuario)

            if (createusuario.insertId) {
                return res.status(201).json({ message: "Conta cadastrada com sucesso!", status: "success" })
            }
        }

    } catch (error) {
        return res.status(500).json({ message: error, status: "error" })
    }



}

module.exports = {
    Cadastrar
}