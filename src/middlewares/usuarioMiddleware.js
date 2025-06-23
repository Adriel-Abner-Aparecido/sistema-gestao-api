const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.empresaId === undefined) {
        return res.status(400).json({ message: 'O campo "empresaId" é obrigatório' })
    }

    if (body.empresaId === 0) {
        return res.status(400).json({ message: '"empresaId" Não pode ser 0' })
    }

    if (body.empresaId === null) {
        return res.status(400).json({ message: '"empresaId" Não pode ser null' })
    }

    if (body.username === undefined) {
        return res.status(400).json({ message: 'O campo "username" é obrigatório' })
    }

    if (body.username === null) {
        return res.status(400).json({ message: '"username" Não pode ser null' })
    }

    if (body.username === '') {
        return res.status(400).json({ message: '"username" Não pode ser vazio' })
    }

    if (body.email === undefined) {
        return res.status(400).json({ message: 'O campo "email" é obrigatório' })
    }

    if (body.email === null) {
        return res.status(400).json({ message: '"email" Não pode ser null' })
    }

    if (body.email === '') {
        return res.status(400).json({ message: '"email" Não pode ser vazio' })
    }

    if (body.senha === undefined) {
        return res.status(400).json({ message: 'O campo "senha" é obrigatório' })
    }

    if (body.senha === null) {
        return res.status(400).json({ message: '"senha" Não pode ser null' })
    }

    if (body.senha === '') {
        return res.status(400).json({ message: '"senha" Não pode ser vazio' })
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, senha } = req.body;

    if (email === undefined) {
        return res.status(400).json({ message: 'O campo "email" é obrigatório' })
    }

    if (email === null) {
        return res.status(400).json({ message: '"email" Não pode ser null' })
    }

    if (senha === undefined) {
        return res.status(400).json({ message: 'O campo "senha" é obrigatório' })
    }

    if (senha === null) {
        return res.status(400).json({ message: '"senha" Não pode ser null' })
    }

    next();
};

const validateEsqueceuSenha = (req, res, next) => {
    const { body } = req;

    if (body.email === undefined) {
        return res.status(400).json({ message: 'O campo "email" é obrigatório' })
    }

    if (body.email === null) {
        return res.status(400).json({ message: '"email" Não pode ser null' })
    }

    next();
};

const validateResetarSenha = (req, res, next) => {
    const { body } = req;

    if (body.email === undefined) {
        return res.status(400).json({ message: 'O campo "email" é obrigatório' })
    }

    if (body.email === null) {
        return res.status(400).json({ message: '"email" Não pode ser null' })
    }

    if (body.senha === undefined) {
        return res.status(400).json({ message: 'O campo "senha" é obrigatório' })
    }

    if (body.senha === null) {
        return res.status(400).json({ message: '"senha" Não pode ser null' })
    }

    if (body.token === undefined) {
        return res.status(400).json({ message: 'O campo "token" é obrigatório' })
    }

    if (body.token === null) {
        return res.status(400).json({ message: '"token" Não pode ser null' })
    }

    next();
};

module.exports = {
    validateMandatory,
    validateLogin,
    validateEsqueceuSenha,
    validateResetarSenha
};