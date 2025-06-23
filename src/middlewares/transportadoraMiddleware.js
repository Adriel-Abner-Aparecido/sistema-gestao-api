const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.nome === undefined) {
        return res.status(400).json({ message: 'O campo "nome" é obrigatório'})
    }

    if (body.nome === '') {
        return res.status(400).json({ message: '"nome" Não pode ser vazio'})
    }

    if (body.nome === null) {
        return res.status(400).json({ message: '"nome" Não pode ser null'})
    }

    if (body.telefone === undefined) {
        return res.status(400).json({ message: 'O campo "telefone" é obrigatório'})
    }

    if (body.celular === undefined) {
        return res.status(400).json({ message: 'O campo "celular" é obrigatório'})
    }

    if (body.email === undefined) {
        return res.status(400).json({ message: 'O campo "email" é obrigatório'})
    }

    if (body.tipoPessoa === undefined) {
        return res.status(400).json({ message: 'O campo "tipoPessoa" é obrigatório'})
    }

    if (body.cnpjCpf === undefined) {
        return res.status(400).json({ message: 'O campo "cnpjCpf" é obrigatório'})
    }

    if (body.fantasia === undefined) {
        return res.status(400).json({ message: 'O campo "fantasia" é obrigatório'})
    }

    if (body.observacao === undefined) {
        return res.status(400).json({ message: 'O campo "observacao" é obrigatório'})
    }

    next();
};

module.exports = {
    validateMandatory
};