const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.vendaId === undefined) {
        return res.status(400).json({ message: 'O campo "vendaId" é obrigatório'})
    }

    if (body.vendaId === 0) {
        return res.status(400).json({ message: '"vendaId" Não pode ser 0'})
    }

    if (body.vendaId === null) {
        return res.status(400).json({ message: '"vendaId" Não pode ser null'})
    }

    if (body.estoqueId === undefined) {
        return res.status(400).json({ message: 'O campo "estoqueId" é obrigatório'})
    }

    if (body.estoqueId === 0) {
        return res.status(400).json({ message: '"estoqueId" Não pode ser 0'})
    }

    if (body.estoqueId === null) {
        return res.status(400).json({ message: '"estoqueId" Não pode ser null'})
    }

    if (body.valor === undefined) {
        return res.status(400).json({ message: 'O campo "valor" é obrigatório'})
    }

    if (body.valor === null) {
        return res.status(400).json({ message: '"valor" Não pode ser null'})
    }

    if (body.quantidade === undefined) {
        return res.status(400).json({ message: 'O campo "quantidade" é obrigatório'})
    }

    if (body.quantidade === null) {
        return res.status(400).json({ message: '"quantidade" Não pode ser null'})
    }

    next();
};

module.exports = {
    validateMandatory
};