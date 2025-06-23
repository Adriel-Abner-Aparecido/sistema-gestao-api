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

    if (body.categoriaId === undefined) {
        return res.status(400).json({ message: 'O campo "categoriaId" é obrigatório'})
    }

    if (body.categoriaId === 0) {
        return res.status(400).json({ message: '"categoriaId" Não pode ser 0'})
    }

    if (body.categoriaId === null) {
        return res.status(400).json({ message: '"categoriaId" Não pode ser null'})
    }

    next();
};

module.exports = {
    validateMandatory
};