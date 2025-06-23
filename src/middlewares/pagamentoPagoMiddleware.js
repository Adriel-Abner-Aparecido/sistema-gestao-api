const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.contaPagarId === undefined) {
        return res.status(400).json({ message: 'O campo "contaPagarId" é obrigatório'})
    }

    if (body.formasPagamentoId === undefined) {
        return res.status(400).json({ message: 'O campo "formasPagamentoId" é obrigatório'})
    }

    if (body.valorPago === undefined) {
        return res.status(400).json({ message: 'O campo "valorPago" é obrigatório'})
    }

    if (body.parcelas === undefined) {
        return res.status(400).json({ message: 'O campo "parcelas" é obrigatório'})
    }

    if (body.dataPagamento === undefined) {
        return res.status(400).json({ message: 'O campo "dataPagamento" é obrigatório'})
    }

    next();
};

module.exports = {
    validateMandatory
};
