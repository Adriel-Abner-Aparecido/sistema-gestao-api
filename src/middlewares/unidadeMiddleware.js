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

    if (body.sigla === undefined) {
        return res.status(400).json({ message: 'O campo "sigla" é obrigatório'})
    }

    if (body.sigla === '') {
        return res.status(400).json({ message: '"sigla" Não pode ser vazio'})
    }

    if (body.sigla === null) {
        return res.status(400).json({ message: '"sigla" Não pode ser null'})
    }

    next();
};

module.exports = {
    validateMandatory
};