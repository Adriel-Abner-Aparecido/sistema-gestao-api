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

    if (body.produtoId === undefined) {
        return res.status(400).json({ message: 'O campo "produtoId" é obrigatório'})
    }

    if (body.produtoId === 0) {
        return res.status(400).json({ message: '"produtoId" Não pode ser 0'})
    }

    if (body.produtoId === null) {
        return res.status(400).json({ message: '"produtoId" Não pode ser null'})
    }

    next();
};

module.exports = {
    validateMandatory
};