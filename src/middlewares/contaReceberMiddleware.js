const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.valor === undefined) {
        return res.status(400).json({ message: 'O campo "valor" é obrigatório'})
    }

    if (body.dataVencimento === undefined) {
        return res.status(400).json({ message: 'O campo "dataVencimento" é obrigatório'})
    }

    if (body.vendaId === undefined) {
        return res.status(400).json({ message: 'O campo "vendaId" é obrigatório'})
    }

    if (body.clienteId === undefined) {
        return res.status(400).json({ message: 'O campo "clienteId" é obrigatório'})
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