const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.tipoProdutoId === undefined) {
        return res.status(400).json({ message: 'O campo "tipoProdutoId" é obrigatório'})
    }

    if (body.tipoProdutoId === 0) {
        return res.status(400).json({ message: '"tipoProdutoId" Não pode ser 0'})
    }

    if (body.tipoProdutoId === null) {
        return res.status(400).json({ message: '"tipoProdutoId" Não pode ser null'})
    }

    if (body.marcaId === undefined) {
        return res.status(400).json({ message: 'O campo "marcaId" é obrigatório'})
    }

    if (body.marcaId === "") {
        return res.status(400).json({ message: 'O campo "marcaId" não aceita string vazia, envie null'})
    }

    if (body.categoriaId === undefined) {
        return res.status(400).json({ message: 'O campo "categoriaId" é obrigatório'})
    }

    if (body.categoriaId === "") {
        return res.status(400).json({ message: 'O campo "categoriaId" não aceita string vazia, envie null'})
    }

    if (body.fornecedorId === undefined) {
        return res.status(400).json({ message: 'O campo "fornecedorId" é obrigatório'})
    }

    if (body.fornecedorId === "") {
        return res.status(400).json({ message: 'O campo "fornecedorId" não aceita string vazia, envie null'})
    }

    if (body.unidadeId === undefined) {
        return res.status(400).json({ message: 'O campo "unidadeId" é obrigatório'})
    }

    if (body.unidadeId === "") {
        return res.status(400).json({ message: 'O campo "unidadeId" não aceita string vazia, envie null'})
    }

    if (body.origemId === undefined) {
        return res.status(400).json({ message: 'O campo "origemId" é obrigatório'})
    }

    if (body.origemId === "") {
        return res.status(400).json({ message: 'O campo "origemId" não aceita string vazia, envie null'})
    }

    if (body.colecaoId === undefined) {
        return res.status(400).json({ message: 'O campo "colecaoId" é obrigatório'})
    }

    if (body.colecaoId === "") {
        return res.status(400).json({ message: 'O campo "colecaoId" não aceita string vazia, envie null'})
    }

    if (body.cstIcmsId === undefined) {
        return res.status(400).json({ message: 'O campo "cstIcmsId" é obrigatório'})
    }

    if (body.cstIcmsId === "") {
        return res.status(400).json({ message: 'O campo "cstIcmsId" não aceita string vazia, envie null'})
    }

    if (body.subCategoriaId === undefined) {
        return res.status(400).json({ message: 'O campo "subCategoriaId" é obrigatório'})
    }

    if (body.subCategoriaId === "") {
        return res.status(400).json({ message: 'O campo "subCategoriaId" não aceita string vazia, envie null'})
    }

    if (body.nome === undefined) {
        return res.status(400).json({ message: 'O campo "nome" é obrigatório'})
    }

    if (body.nome === '') {
        return res.status(400).json({ message: '"nome" Não pode ser vazio'})
    }

    if (body.nome === null) {
        return res.status(400).json({ message: '"nome" Não pode ser null'})
    }

    if (body.status === undefined) {
        return res.status(400).json({ message: 'O campo "status" é obrigatório'})
    }

    if (body.status === '') {
        return res.status(400).json({ message: '"status" Não pode ser vazio'})
    }

    if (body.status === null) {
        return res.status(400).json({ message: '"status" Não pode ser null'})
    }

    if (body.icms === undefined) {
        return res.status(400).json({ message: 'O campo "icms" é obrigatório'})
    }

    if (body.ipi === undefined) {
        return res.status(400).json({ message: 'O campo "ipi" é obrigatório'})
    }

    if (body.pis === undefined) {
        return res.status(400).json({ message: 'O campo "pis" é obrigatório'})
    }

    if (body.cofins === undefined) {
        return res.status(400).json({ message: 'O campo "cofins" é obrigatório'})
    }

    if (body.cest === undefined) {
        return res.status(400).json({ message: 'O campo "cest" é obrigatório'})
    }

    if (body.ncm === undefined) {
        return res.status(400).json({ message: 'O campo "ncm" é obrigatório'})
    }

    if (body.observacao === undefined) {
        return res.status(400).json({ message: 'O campo "observacao" é obrigatório'})
    }

    if (body.kitProduto === undefined) {
        return res.status(400).json({ message: 'O campo "kitProduto" é obrigatório'})
    }

    if (body.comissao === undefined) {
        return res.status(400).json({ message: 'O campo "comissao" é obrigatório'})
    }

    if (body.descontoMax === undefined) {
        return res.status(400).json({ message: 'O campo "descontoMax" é obrigatório'})
    }

    if (body.insumo === undefined) {
        return res.status(400).json({ message: 'O campo "insumo" é obrigatório'})
    }

    if (body.classeImposto === undefined) {
        return res.status(400).json({ message: 'O campo "classeImposto" é obrigatório'})
    }

    next();
};

module.exports = {
    validateMandatory
};