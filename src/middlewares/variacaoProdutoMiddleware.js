const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.produtoId === undefined) {
        return res.status(400).json({ message: 'O campo "produtoId" é obrigatório'})
    }

    if (body.produtoId === 0) {
        return res.status(400).json({ message: '"produtoId" Não pode ser 0'})
    }

    if (body.produtoId === null) {
        return res.status(400).json({ message: '"produtoId" Não pode ser null'})
    }

    if (body.corId === undefined) {
        return res.status(400).json({ message: 'O campo "corId" é obrigatório'})
    }

    if (body.corId === "") {
        return res.status(400).json({ message: 'O campo "corId" não aceita string vazia, envie null'})
    }

    if (body.tamanhoId === undefined) {
        return res.status(400).json({ message: 'O campo "tamanhoId" é obrigatório'})
    }

    if (body.tamanhoId === "") {
        return res.status(400).json({ message: 'O campo "tamanhoId" não aceita string vazia, envie null'})
    }

    if (body.codigoBarras === undefined) {
        return res.status(400).json({ message: 'O campo "codigoBarras" é obrigatório'})
    }

    if (body.codigoProduto === undefined) {
        return res.status(400).json({ message: 'O campo "codigoProduto" é obrigatório'})
    }

    if (body.descricao === undefined) {
        return res.status(400).json({ message: 'O campo "descricao" é obrigatório'})
    }

    next();
};

module.exports = {
    validateMandatory
};