const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.nome === undefined) {
        return res.status(400).json({ message: 'O campo "nome" é obrigatório' });
    }

    if (body.nome === '') {
        return res.status(400).json({ message: '"nome" Não pode ser vazio' });
    }

    if (body.nome === null) {
        return res.status(400).json({ message: '"nome" Não pode ser null' });
    }

    if (body.cnpj === undefined) {
        return res.status(400).json({ message: 'O campo "cnpj" é obrigatório' });
    }

    if (body.telefone === undefined) {
        return res.status(400).json({ message: 'O campo "telefone" é obrigatório' });
    }

    if (body.celular === undefined) {
        return res.status(400).json({ message: 'O campo "celular" é obrigatório' });
    }

    if (body.email === undefined) {
        return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    }

    if (body.emailUser === undefined) {
        return res.status(400).json({ message: 'O campo "emailUser" é obrigatório' });
    }

    if (body.planoId === undefined) {
        return res.status(400).json({ message: 'O campo "planoId" é obrigatório' });
    }

    if (body.consumerKey === undefined) {
        return res.status(400).json({ message: 'O campo "consumerKey" é obrigatório' });
    }

    if (body.consumerSecret === undefined) {
        return res.status(400).json({ message: 'O campo "consumerSecret" é obrigatório' });
    }

    if (body.classeImpostoPadrao === undefined) {
        return res.status(400).json({ message: 'O campo "classeImpostoPadrao" é obrigatório' });
    }

    if (body.origem === undefined) {
        return res.status(400).json({ message: 'O campo "origem" é obrigatório' });
    }

    next();
};

module.exports = {
    validateMandatory
};
