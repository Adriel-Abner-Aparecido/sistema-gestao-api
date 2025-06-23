const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.origem === undefined) {
        return res.status(400).json({ message: 'O campo "origem" é obrigatório'})
    }

    if (body.origem === '') {
        return res.status(400).json({ message: '"origem" Não pode ser vazio'})
    }

    if (body.origem === null) {
        return res.status(400).json({ message: '"origem" Não pode ser null'})
    }

    if (isNaN(body.origem)) {
        return res.status(400).json({ message: '"origem" Não pode ser string'})
    }

    if (body.descricao === undefined) {
        return res.status(400).json({ message: 'O campo "descricao" é obrigatório'})
    }

    if (body.descricao === '') {
        return res.status(400).json({ message: '"descricao" Não pode ser vazio'})
    }

    if (body.descricao === null) {
        return res.status(400).json({ message: '"descricao" Não pode ser null'})
    }

    next();
};

module.exports = {
    validateMandatory
};