const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.valor === undefined) {
        return res.status(400).json({ message: 'O campo "valor" é obrigatório'})
    }

    if (body.status === undefined) {
        return res.status(400).json({ message: 'O campo "status" é obrigatório'})
    }

    if (body.tipo === undefined) {
        return res.status(400).json({ message: 'O campo "tipo" é obrigatório'})
    }

    if (body.externalReference === undefined) {
        return res.status(400).json({ message: 'O campo "externalReference" é obrigatório'})
    }

    if (body.data === undefined) {
        return res.status(400).json({ message: 'O campo "data" é obrigatório'})
    }

    if (body.idPagamentoMercadoPago === undefined) {
        return res.status(400).json({ message: 'O campo "idPagamentoMercadoPago" é obrigatório'})
    }

    if (body.idPlanoComprado === undefined) {
        return res.status(400).json({ message: 'O campo "idPlanoComprado" é obrigatório'})
    }

    next();
};

module.exports = {
    validateMandatory
};
