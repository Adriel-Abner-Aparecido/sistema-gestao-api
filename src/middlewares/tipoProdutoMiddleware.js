const validateMandatory = (req, res, next) => {
    const { body } = req;

    var nome = body.nome;

    if (nome === undefined) {
        return res.status(400).json({ message: 'O campo "nome" é obrigatório'})
    }

    if (nome === '') {
        return res.status(400).json({ message: '"nome" Não pode ser vazio'})
    }

    if (nome.length > 10) {
        return res.status(400).json({ message: '"nome" Não pode conter mais de 10 caracteres'})
    }

    if (nome === null) {
        return res.status(400).json({ message: '"nome" Não pode ser null'})
    }

    next();
};

module.exports = {
    validateMandatory
};