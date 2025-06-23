const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.valor === undefined) {
        return res.status(400).json({ message: 'O campo "valor" é obrigatório'})
    }

    if (body.dataVencimento === undefined) {
        return res.status(400).json({ message: 'O campo "dataVencimento" é obrigatório'})
    }

    if (body.fornecedorId === undefined) {
        return res.status(400).json({ message: 'O campo "fornecedorId" é obrigatório'})
    }

    if (body.tipo === undefined) {
        return res.status(400).json({ message: 'O campo "tipo" é obrigatório'})
    }

    if (body.categoriaConta === undefined) {
        return res.status(400).json({ message: 'O campo "categoriaConta" é obrigatório'})
    }

    next();
};

module.exports = {
    validateMandatory
};
