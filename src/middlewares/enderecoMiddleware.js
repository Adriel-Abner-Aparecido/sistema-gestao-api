const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.fornecedorId === undefined) {
        return res.status(400).json({ message: 'O campo "fornecedorId" é obrigatório' })
    }

    if (body.clienteId === undefined) {
        return res.status(400).json({ message: 'O campo "clienteId" é obrigatório' })
    }

    if (body.rua === undefined) {
        return res.status(400).json({ message: 'O campo "rua" é obrigatório' })
    }

    if (body.numero === undefined) {
        return res.status(400).json({ message: 'O campo "numero" é obrigatório' })
    }

    if (body.bairro === undefined) {
        return res.status(400).json({ message: 'O campo "bairro" é obrigatório' })
    }

    if (body.cep === undefined) {
        return res.status(400).json({ message: 'O campo "cep" é obrigatório' })
    }

    if (body.cidade === undefined) {
        return res.status(400).json({ message: 'O campo "cidade" é obrigatório' })
    }

    if (body.uf === undefined) {
        return res.status(400).json({ message: 'O campo "uf" é obrigatório' })
    }

    next();
};

module.exports = {
    validateMandatory
};