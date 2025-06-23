const usuarioModel = require('../models/usuarioModel');

const getAll = async (req, res) => {

    const [usuario] = await usuarioModel.getAll();

    return res.status(200).json(usuario);
};

const getUsuariosEmpresa = async (req, res) => {

    const [usuario] = await usuarioModel.getUsuariosEmpresa(req.usuario);

    return res.status(200).json(usuario);
};

const logarUsuario = async (req, res) => {

    const createdUsuario = await usuarioModel.logarUsuario(req.body);

    return res.status(200).json(createdUsuario);
}

const createUsuario = async (req, res) => {

    const createdUsuario = await usuarioModel.createUsuario(req.body);

    return res.status(200).json(createdUsuario);
}

const deleteUsuario = async (req, res) => {
    const { id } = req.params;

    await usuarioModel.deleteUsuario(id);
    return res.status(204).json();
}

const updateUsuario = async (req, res) => {
    const { id } = req.params;

    const updatedUsuario = await usuarioModel.updateUsuario(id, req.body)

    if (updatedUsuario.erro !== undefined) {
        return res.status(400).json({ erro: updatedUsuario.erro })
    } else {
        return res.status(201).json(updatedUsuario);
    }
}

const esqueceuSenha = async (req, res) => {
    const esqueceuSenha = await usuarioModel.esqueceuSenha(req.body)

    if (esqueceuSenha.erro !== undefined) {
        return res.status(400).json({ erro: esqueceuSenha.erro })
    } else {
        return res.status(201).json(esqueceuSenha);
    }
}

const resetarSenha = async (req, res) => {

    const resetarSenha = await usuarioModel.resetarSenha(req.body)

    if (resetarSenha.erro !== undefined) {
        return res.status(400).json({ erro: resetarSenha.erro })
    } else {
        return res.status(201).json(resetarSenha);
    }

}

const getUsuarioByEmail = async (req, res) => {

    const { email } = req.params;

    try {
        // Não desestruture, pois o valor retornado não é uma array
        const pegaUsuario = await usuarioModel.getUsuarioByEmail(email);

        if (!pegaUsuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        res.status(200).json(pegaUsuario);

    } catch (error) {
        console.error("Erro no banco de dados", error);
        res.status(500).json({ erro: 'Erro no banco de dados' });
    }

};


module.exports = {
    getAll,
    logarUsuario,
    createUsuario,
    deleteUsuario,
    updateUsuario,
    esqueceuSenha,
    resetarSenha,
    getUsuariosEmpresa,
    getUsuarioByEmail
};