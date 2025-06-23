const ValidarCadastro = (req, res, next) => {

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
        consumerKey,
        consumerSecret,
        classeImpostoPadrao,
        origem,
        username,
        senha
    } = req.body

    if (!nome || nome === "") {
        return res.status(400).json({ message: "O campo nome é obrigatório" })
    }

    if (typeof nome !== "string") {
        return res.status(400).json({ message: "O nome precisa ser uma string!" })
    }

    if (!email || email === "") {
        return res.status(400).json({ message: "O campo email é obrigatório" })
    }

    if (typeof email !== "string") {
        return res.status(400).json({ message: "O email precisa ser uma string" })
    }

    if (!celular || celular === "") {
        return res.status(400).json({ message: "O campo celular é obrigatório" })
    }

    if (typeof celular !== "string") {
        return res.status(400).json({ message: "O campo celular precisa ser uma string" })
    }

    if (!senha || senha === "") {
        return res.status(400).json({ message: "O campo senha é obrigatório" })
    }

    // function VerificaSenha(senha, nome) {

    //     const temletramaiuscula = /[A-Z]/.test(senha)
    //     const temnumero = /\d/.test(senha)
    //     const temespecial = /[!@#\$%\^\&*\)\(+=._-]]/.test(senha)
    //     const senhasfracas = ['1234', '123456', '12345678']

    //     if (senha.includes(nome)) return true
    //     if (senhasfracas.includes(senha)) return true
    //     if (!senha || senha.length < 8) return true
    //     if (!temnumero || !temespecial || !temletramaiuscula) return true

    //     return false

    // }

    // if (VerificaSenha(senha, nome)) {
    //     res.status(400).json({ message: "A sua senha é muito fraca! \nA senha deve conter 1 numero, uma letra maiuscula, Um numero e não pode conter parte do seu nome." })
    // }

    next()

}

module.exports = {
    ValidarCadastro
}