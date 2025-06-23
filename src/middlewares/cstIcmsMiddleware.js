const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.cstIcms === undefined) {
        return res.status(400).json({ message: 'O campo "cstIcms" é obrigatório'})
    }

    if (body.cstIcms === '') {
        return res.status(400).json({ message: '"cstIcms" Não pode ser vazio'})
    }

    if (body.cstIcms === null) {
        return res.status(400).json({ message: '"cstIcms" Não pode ser null'})
    }

    if (isNaN(body.cstIcms)) {
        return res.status(400).json({ message: '"cstIcms" Não pode ser string'})
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