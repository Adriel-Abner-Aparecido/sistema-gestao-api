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

    if (body.dinheiro === undefined) {
        return res.status(400).json({ message: 'O campo "dinheiro" é obrigatório'})
    }

    if (body.debito === undefined) {
        return res.status(400).json({ message: 'O campo "debito" é obrigatório'})
    }

    if (body.credito === undefined) {
        return res.status(400).json({ message: 'O campo "credito" é obrigatório'})
    }

    if (body.parcelaCredito === undefined) {
        return res.status(400).json({ message: 'O campo "parcelaCredito" é obrigatório'})
    }

    if (body.desconto === undefined) {
        return res.status(400).json({ message: 'O campo "desconto" é obrigatório'})
    }

    if (body.troco === undefined) {
        return res.status(400).json({ message: 'O campo "troco" é obrigatório'})
    }

    if (body.crediario === undefined) {
        return res.status(400).json({ message: 'O campo "crediario" é obrigatório'})
    }

    if (body.parcelaCrediario === undefined) {
        return res.status(400).json({ message: 'O campo "parcelaCrediario" é obrigatório'})
    }

    next();
};

module.exports = {
    validateMandatory
};