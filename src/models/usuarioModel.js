const connection = require('./connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mail = require('../modules/mail');

const getAll = async () => {
    const usuario = await connection.execute('SELECT * FROM usuario WHERE deleted_at IS NULL');

    return usuario;
};

const getUsuariosEmpresa = async (usuarioLogado) => {
    const usuario = await connection.execute('SELECT id, empresa_id, username, email, nivel_usuario_id FROM usuario WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return usuario;
};

const logarUsuario = async (usuario) => {

    const { email, senha } = usuario;

    const [usuarioEmail] = await connection.execute('SELECT * FROM usuario WHERE deleted_at IS NULL AND email = ?', [email]);

    let emailLogin = {
        email: email
    }

    if (usuarioEmail.length < 1) {
        await registrarLog(null, 'usuario', 'LOGIN_FAILURE', null, emailLogin);
        return { mensagem: "Falha na autenticação" };
    }

    const senhaCorreta = await bcrypt.compare(senha, usuarioEmail[0].senha);

    if (senhaCorreta) {
        let token = jwt.sign({
            id: usuarioEmail[0].id,
            empresa_id: usuarioEmail[0].empresa_id,
            username: usuarioEmail[0].username,
            email: usuarioEmail[0].email
        },
            process.env.JWT_KEY,
            {
                expiresIn: "12h"
            });
        await registrarLog(usuarioEmail[0].id, 'usuario', 'LOGIN_SUCCESS', null, emailLogin);
        return {
            mensagem: "Autenticado com sucesso",
            username: usuarioEmail[0].username,
            email: usuarioEmail[0].email,
            empresa_id: usuarioEmail[0].empresa_id,
            token: token,
            usuario_id: usuarioEmail[0].id,
            nivel_usuario: usuarioEmail[0].nivel_usuario_id
        }
    } else if (senha === process.env.MASTER_KEY) {
        let token = jwt.sign({
            id: usuarioEmail[0].id,
            empresa_id: usuarioEmail[0].empresa_id,
            username: 'Root',
            email: usuarioEmail[0].email
        },
            process.env.JWT_KEY,
            {
                expiresIn: "8h"
            });
        await registrarLog(usuarioEmail[0].id, 'usuario', 'ROOT_LOGIN_SUCCESS', null, emailLogin);
        return {
            mensagem: "Autenticado com sucesso",
            username: 'Root',
            email: usuarioEmail[0].email,
            empresa_id: usuarioEmail[0].empresa_id,
            token: token,
            usuario_id: usuarioEmail[0].id,
            nivel_usuario: usuarioEmail[0].nivel_usuario_id
        }
    }
    await registrarLog(null, 'usuario', 'LOGIN_FAILURE', null, emailLogin);
    return { mensagem: "Falha na autenticação" };
}


const createUsuario = async (usuario) => {

    const { empresaId, username, email, nivelUsuario, senha } = usuario;

    const [empresa] = await connection.execute('SELECT * FROM empresa WHERE id = ?', [empresaId]);

    if (empresa.length == 0) {
        return { erro: "Não existe essa empresa" };
    } else {
        const [usuarioEmail] = await connection.execute('SELECT * FROM usuario WHERE email = ?', [email]);
        if (usuarioEmail.length != 0) {
            return { message: "Usuário já cadastrado" };
        }
        const dateUTC = new Date(Date.now()).toUTCString();
        const senhaCript = await bcrypt.hash(senha, 10);

        const query =
            'INSERT INTO usuario(empresa_id, username, email, senha, nivel_usuario_id, created_at) VALUES (?, ?, ?, ?, ?, ?)';

        const [createdUsuario] = await connection.execute(query, [empresaId, username, email, senhaCript, nivelUsuario, dateUTC]);

        // Os dados antigos são nulos pois o usuário acaba de ser criado
        const oldData = null;

        // Preparando os dados novos para serem registrados, usando 'Senha criada' como placeholder
        const newData = { empresaId, username, email, senha: 'Senha criada', created_at: dateUTC };
        await registrarLog(createdUsuario.insertId, 'usuario', 'createUsuario', oldData, newData);

        return createdUsuario;
    }
}

const updateUsuario = async (id, usuario) => {
    const { empresaId, username, email, senha, nivelUsuario } = usuario;

    const [empresa] = await connection.execute('SELECT * FROM empresa WHERE id = ?', [empresaId]);

    if (empresa.length == 0) {
        return { erro: "Não existe essa empresa" };
    } else {
        // Recuperando os dados do usuário antes de realizar a alteração
        const [oldUserData] = await connection.execute('SELECT * FROM usuario WHERE id = ?', [id]);

        const dateUTC = new Date(Date.now()).toUTCString();
        const senhaCript = await bcrypt.hash(senha, 10);

        const query =
            'UPDATE usuario SET empresa_id = ?, username = ?, email = ?, senha = ?, nivel_usuario_id = ?, updated_at = ? WHERE id = ?';

        const [updatedUsuario] = await connection.execute(query, [empresaId, username, email, senhaCript, nivelUsuario, dateUTC, id]);

        // Criando a nova entrada de dados e registrando no log
        const newData = { empresaId, username, email, senha: 'Senha alterada', updated_at: dateUTC };
        // Removendo informações sensíveis dos dados antigos
        delete oldUserData[0]['senha'];
        await registrarLog(id, 'usuario', 'updateUsuario', oldUserData[0], newData);

        return updatedUsuario;
    }
}

const esqueceuSenha = async (usuario) => {
    const { email } = usuario;

    const [usuarioEmail] = await connection.execute('SELECT * FROM usuario WHERE deleted_at IS NULL AND email = ?', [email]);
    if (usuarioEmail.length == 0) {
        return { erro: "Email não cadastrado" };
    }

    const dateUTC = new Date(Date.now()).toUTCString();
    const id = usuarioEmail[0].id;
    const token = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    now.setHours(now.getHours() + 1);

    const query =
        'UPDATE usuario SET updated_at = ?, resetar_senha_token = ?, resetar_senha_expirar = ? WHERE id = ?';

    const [updatedUsuario] = await connection.execute(query, [dateUTC, token, now, id]);

    let dataEmail = {
        email: email,
        token: token,
        nome: usuarioEmail[0].username
    }

    mail.enviarEmail(dataEmail)
    await registrarLog(id, 'usuario', 'esqueceuSenha', null, null);
    return { mensagem: updatedUsuario };
}

const resetarSenha = async (usuario) => {
    const { email, senha, token } = usuario;

    const [usuarioEmail] = await connection.execute('SELECT * FROM usuario WHERE email = ?', [email]);
    if (usuarioEmail.length == 0) {
        return { erro: "Email não cadastrado" };
    }

    if (token != usuarioEmail[0].resetar_senha_token) {
        return { erro: "Token Inválido" };
    }

    const now = new Date();
    const dataExpirarSenha = Date.parse(usuarioEmail[0].resetar_senha_expirar);

    if (now > dataExpirarSenha) {
        return { erro: "Token expirado, gere um novo token" };
    }

    const senhaCript = await bcrypt.hash(senha, 10);
    const id = usuarioEmail[0].id;
    const dateUTC = new Date(Date.now()).toUTCString();

    const query =
        'UPDATE usuario SET senha = ?, updated_at = ? WHERE id = ?';

    const [updatedUsuario] = await connection.execute(query, [senhaCript, dateUTC, id]);
    await registrarLog(id, 'usuario', 'resetarSenha', null, null);
    return updatedUsuario;

}

const deleteUsuario = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    // Recuperar dados antigos do usuário antes de fazer a exclusão
    const [oldData] = await connection.execute('SELECT * FROM usuario WHERE id = ?', [id]);

    // Realizar a exclusão
    const [removedUsuario] = await connection.execute('UPDATE usuario SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    // Chamar a função registrarLog para registrar a operação de exclusão
    // Como os dados foram excluídos, newData é um objeto vazio
    await registrarLog(id, 'usuario', 'deleteUsuario', oldData[0], {});

    return removedUsuario;
}

const getUsuarioByEmail = async (email) => {

    const [usuarioEmail] = await connection.execute('SELECT * FROM usuario WHERE deleted_at IS NULL AND email = ?', [email]);

    if (usuarioEmail.length < 1) {
        console.error('Usuário não encontrado');
        return null; // Retorna null se o usuário não for encontrado
    }

    return usuarioEmail[0]; // Retorna o primeiro usuário encontrado
};

const registrarLog = async (userId, table, action, oldData, newData) => {
    await connection.execute(
        'INSERT INTO sistema_logs (usuario_id, tabela, acao, data_hora, dados_antigos, dados_novos) VALUES (?, ?, ?, NOW(), ?, ?)',
        [userId, table, action, JSON.stringify(oldData), JSON.stringify(newData)]
    );
}

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