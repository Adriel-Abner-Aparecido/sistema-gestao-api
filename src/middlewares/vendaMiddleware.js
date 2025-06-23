const validateMandatory = (req, res, next) => {
    const { body } = req;

    if (body.clienteId === undefined) {
        return res.status(400).json({ message: 'O campo "clienteId" é obrigatório'})
    }

    if (body.clienteId === 0) {
        return res.status(400).json({ message: '"clienteId" Não pode ser 0'})
    }

    if (body.transportadoraId === undefined) {
        return res.status(400).json({ message: 'O campo "transportadoraId" é obrigatório'})
    }

    if (body.vendedorId === undefined) {
        return res.status(400).json({ message: 'O campo "vendedorId" é obrigatório'})
    }

    if (body.referenciaVenda === undefined) {
        return res.status(400).json({ message: 'O campo "referenciaVenda" é obrigatório'})
    }

    if (body.data === undefined) {
        return res.status(400).json({ message: 'O campo "data" é obrigatório'})
    }

    if (body.desconto === undefined) {
        return res.status(400).json({ message: 'O campo "desconto" é obrigatório'})
    }

    if (body.valor === undefined) {
        return res.status(400).json({ message: 'O campo "valor" é obrigatório'})
    }

    if (body.status === undefined) {
        return res.status(400).json({ message: 'O campo "status" é obrigatório'})
    }

    if (body.observacao === undefined) {
        return res.status(400).json({ message: 'O campo "observacao" é obrigatório'})
    }

    if (body.prazoEntrega === undefined) {
        return res.status(400).json({ message: 'O campo "prazoEntrega" é obrigatório'})
    }

    if (body.valorFrete === undefined) {
        return res.status(400).json({ message: 'O campo "valorFrete" é obrigatório'})
    }

    if (body.valorBaseSt === undefined) {
        return res.status(400).json({ message: 'O campo "valorBaseSt" é obrigatório'})
    }

    if (body.valorSt === undefined) {
        return res.status(400).json({ message: 'O campo "valorSt" é obrigatório'})
    }

    if (body.valorIpi === undefined) {
        return res.status(400).json({ message: 'O campo "valorIpi" é obrigatório'})
    }

    if (body.pesoTotalNota === undefined) {
        return res.status(400).json({ message: 'O campo "pesoTotalNota" é obrigatório'})
    }

    if (body.pesoTotalNotaLiq === undefined) {
        return res.status(400).json({ message: 'O campo "pesoTotalNotaLiq" é obrigatório'})
    }

    if (body.origemVenda === undefined) {
        return res.status(400).json({ message: 'O campo "origemVenda" é obrigatório'})
    }

    if (body.dataEntrega === undefined) {
        return res.status(400).json({ message: 'O campo "dataEntrega" é obrigatório'})
    }

    if (body.observacaoInterna === undefined) {
        return res.status(400).json({ message: 'O campo "observacaoInterna" é obrigatório'})
    }

    if (body.observacaoExterna === undefined) {
        return res.status(400).json({ message: 'O campo "observacaoExterna" é obrigatório'})
    }

    if (body.enderecoEntrega === undefined) {
        return res.status(400).json({ message: 'O campo "enderecoEntrega" é obrigatório'})
    }

    if (body.modalidadeFrete === undefined) {
        return res.status(400).json({ message: 'O campo "modalidadeFrete" é obrigatório'})
    }

    if (body.dataPostagem === undefined) {
        return res.status(400).json({ message: 'O campo "dataPostagem" é obrigatório'})
    }

    if (body.codigoRastreio === undefined) {
        return res.status(400).json({ message: 'O campo "codigoRastreio" é obrigatório'})
    }

    next();
};

module.exports = {
    validateMandatory
};