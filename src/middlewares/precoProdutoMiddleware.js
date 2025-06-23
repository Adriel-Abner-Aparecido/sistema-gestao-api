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

    if (body.listaPrecoId === undefined) {
        return res.status(400).json({ message: 'O campo "listaPrecoId" é obrigatório'})
    }

    if (body.listaPrecoId === 0) {
        return res.status(400).json({ message: '"listaPrecoId" Não pode ser 0'})
    }

    if (body.listaPrecoId === null) {
        return res.status(400).json({ message: '"listaPrecoId" Não pode ser null'})
    }

    if (body.valor === undefined) {
        return res.status(400).json({ message: 'O campo "valor" é obrigatório'})
    }

    if (body.valor === null) {
        return res.status(400).json({ message: '"valor" Não pode ser null'})
    }

    if (body.markup === undefined) {
        return res.status(400).json({ message: 'O campo "markup" é obrigatório'})
    }

    if (body.markup === null) {
        return res.status(400).json({ message: '"markup" Não pode ser null'})
    }

    if (body.valorCusto === undefined) {
        return res.status(400).json({ message: 'O campo "valorCusto" é obrigatório'})
    }

    next();
};

module.exports = {
    validateMandatory
};