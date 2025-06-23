const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.variacaoProdutoId === undefined) {
        return res.status(400).json({ message: 'O campo "variacaoProdutoId" é obrigatório'})
    }

    if (body.variacaoProdutoId === 0) {
        return res.status(400).json({ message: '"variacaoProdutoId" Não pode ser 0'})
    }

    if (body.variacaoProdutoId === null) {
        return res.status(400).json({ message: '"variacaoProdutoId" Não pode ser null'})
    }

    if (body.validade === undefined) {
        return res.status(400).json({ message: 'O campo "validade" é obrigatório'})
    }

    if (body.localizacao === undefined) {
        return res.status(400).json({ message: 'O campo "localizacao" é obrigatório'})
    }

    if (body.quantidade === undefined) {
        return res.status(400).json({ message: 'O campo "quantidade" é obrigatório'})
    }

    if (body.quantidadeMin === undefined) {
        return res.status(400).json({ message: 'O campo "quantidadeMin" é obrigatório'})
    }

    if (body.quantidadeMax === undefined) {
        return res.status(400).json({ message: 'O campo "quantidadeMax" é obrigatório'})
    }

    next();
};

module.exports = {
    validateMandatory
};