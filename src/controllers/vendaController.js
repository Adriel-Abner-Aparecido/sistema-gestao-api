const vendaModel = require('../models/vendaModel');
const produtosVendaModel = require('../models/produtosVendaModel');
const contaReceberModel = require('../models/contaReceberModel');
const pagamentoRecebidoModel = require('../models/pagamentoRecebidoModel');
const empresaModel = require('../models/empresaModel');
const operacoesModel = require("../models/operacoesModel");
const webmaniaModel = require('../models/webmaniaModel');
const estoqueModel = require('../models/estoqueModel');
const { default: axios } = require('axios');

const WEBMANIA_URL = "https://webmaniabr.com/api/1/nfe/emissao/";

const getAll = async (req, res) => {

    const [venda] = await vendaModel.getAll(req.usuario);

    return res.status(200).json(venda);
};

const getBusca = async (req, res) => {

    const { busca, limit, page } = req.params

    const resultado = await vendaModel.getBusca(busca, page, limit, req.usuario)

    res.status(200).json(resultado)

}

const getById = async (req, res) => {
    const { id } = req.params;

    const { venda, produtosDaVenda, contaReceber } = await vendaModel.getById(id, req.usuario);

    return res.status(200).json({ venda, produtosDaVenda, contaReceber });
};

const getVendaCliente = async (req, res) => {

    const [venda] = await vendaModel.getVendaCliente(req.usuario);

    return res.status(200).json(venda);
};

const getVendasAnoAtual = async (req, res) => {

    const [venda] = await vendaModel.getVendasAnoAtual(req.usuario);

    return res.status(200).json(venda);
};

const getVendasMesAtual = async (req, res) => {

    const [venda] = await vendaModel.getVendasMesAtual(req.usuario);

    return res.status(200).json(venda);
};

const getVendasDiaAtual = async (req, res) => {

    const [venda] = await vendaModel.getVendasDiaAtual(req.usuario);

    return res.status(200).json(venda);
};

const getPage = async (req, res) => {
    const { page, limit } = req.params;

    const venda = await vendaModel.getPage(req.usuario, page, limit);

    return res.status(200).json(venda);
};

const getVendasPorPeriodo = async (req, res) => {
    const { dataInicio, dataFim } = req.params;

    const [venda] = await vendaModel.getVendasPorPeriodo(req.usuario, dataInicio, dataFim);

    return res.status(200).json(venda);
};

const getVendasPorProdutoPeriodo = async (req, res) => {
    const { dataInicio, dataFim } = req.params;

    const [produtosDaVenda] = await vendaModel.getVendasPorProdutoPeriodo(req.usuario, dataInicio, dataFim);

    return res.status(200).json(produtosDaVenda);
};

const getVendasPorCategoriaPeriodo = async (req, res) => {
    const { dataInicio, dataFim } = req.params;

    const [produtosDaVenda] = await vendaModel.getVendasPorCategoriaPeriodo(req.usuario, dataInicio, dataFim);

    return res.status(200).json(produtosDaVenda);
};

const getReciboVenda = async (req, res) => {

    try {

        const { idVenda } = req.params

        if (!idVenda || !req.usuario) {
            return res.status(400).json({ error: 'ID da venda ou usuário não fornecido.' });
        }

        const recibo = await vendaModel.getReciboVenda(idVenda, req.usuario)

        res.status(200).json(recibo)

    } catch (error) {
        console.error("Erro ao obter recibo:", error)
        res.status(500).json({ message: 'Erro ao obter recibo de venda.' })
    }

}

const getRelatoriVendasLucroBruto = async (req, res) => {

    const { inicio, final } = req.params

    try {

        const produtos = await vendaModel.getRelatoriVendasLucroBruto(inicio, final, req.usuario)

        res.status(201).json(produtos)

    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor!!!" })

        throw new Error(error)
    }

}

const relatorioVendasVendedor = async (req, res) => {

    const { inicio, final } = req.params

    try {

        const relatorio = await vendaModel.relatorioVendasVendedor(inicio, final, req.usuario)

        res.status(201).json(relatorio)

    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor.' })
        throw new Error("Erro interno do servidor", error)
    }

}

const createVenda = async (req, res) => {
    const createdVenda = await vendaModel.createVenda(req.body, req.usuario);

    if (createdVenda.erro !== undefined) {
        return res.status(400).json({ erro: createdVenda.erro })
    } else {
        return res.status(201).json(createdVenda);
    }

}

const deleteVenda = async (req, res) => {
    const { id } = req.params;

    const deletedVenda = await vendaModel.deleteVenda(id, req.usuario);
    return res.status(204).json(deletedVenda);
}

const updateVenda = async (req, res) => {

    const { id } = req.params;

    const updatedVenda = await vendaModel.updateVenda(id, req.body, req.usuario)

    if (updatedVenda.erro !== undefined) {
        return res.status(400).json({ erro: updatedVenda.erro })
    } else {
        return res.status(201).json(updatedVenda);
    }

}

const finalizarVenda = async (req, res) => {

    const data = req.body
    const dateIso = new Date(Date.now()).toISOString()

    try {

        const empresa = await empresaModel.getMinhaEmpresa(req.usuario)

        const cadastravenda = await vendaModel.createVenda(data.venda, req.usuario)

        if (cadastravenda.insertId) {
            for (const produto of data.produtos) {
                const produtodavenda = {
                    vendaId: cadastravenda.insertId,
                    estoqueId: produto.estoqueId,
                    valor: produto.subtotal,
                    quantidade: produto.quantidade,
                }
                await produtosVendaModel.createProdutosDaVenda(produtodavenda, req.usuario)

                const [estoque] = await estoqueModel.getEstoqueById(produto.estoqueId, req.usuario)

                const novoestoque = {
                    variacaoProdutoId: estoque[0].variacao_produto_id,
                    validade: estoque[0].validade ?? null,
                    localizacao: estoque[0].localizacao ?? null,
                    quantidade: estoque[0].quantidade >= 0 ? estoque[0].quantidade - produto.quantidade : 0,
                    quantidadeMin: estoque[0].quantidade_min,
                    quantidadeMax: estoque[0].quantidade_max
                }

                if (estoque[0]) {
                    await estoqueModel.updateEstoque(produto.estoqueId, novoestoque, req.usuario)
                }

            }

            for (const formapagamento of data.formasPagamento) {
                const contareceberdata = {
                    vendaId: cadastravenda.insertId,
                    clienteId: data.venda.clienteId,
                    valor: formapagamento.valor_pagamento,
                    dataVencimento: dateIso,
                    tipo: `Venda ${cadastravenda.insertId}`,
                    categoriaConta: null,
                }

                const contareceber = await contaReceberModel.createContaReceber(contareceberdata, req.usuario)

                if (contareceber.insertId) {
                    const pagamentorecebido = {
                        valorPago: formapagamento.valor_pagamento ?? 0,
                        dataPagamento: dateIso,
                        contaReceberId: contareceber.insertId,
                        formasPagamentoId: formapagamento.forma_pagamento ?? 1,
                        parcelas: formapagamento.parcelas ?? 1,
                        troco: formapagamento.troco ?? 0
                    }

                    await pagamentoRecebidoModel.createPagamentoRecebido(pagamentorecebido, req.usuario)

                    if (empresa[0][0].plano_id !== 1) {
                        const operacao = {
                            caixaId: data.caixa,
                            formaPagamento: parseInt(formapagamento.forma_pagamento),
                            valorPagamento: parseFloat(formapagamento.valor_pagamento),
                            horaPagamento: dateIso,
                            tipoOperacao: "Entrada",
                            observacao: `Venda PDV ${cadastravenda.insertId}`,
                            contaReceberId: contareceber.insertId
                        }
                        await operacoesModel.createOperacao(operacao, req.usuario)
                    }
                }

            }

            if (data.emiteNota) {

                const nfedata = {
                    operacao: data.operacao,
                    natureza_operacao: data.natureza_operacao,
                    modelo: data.modelo,
                    finalidade: data.finalidade,
                    ambiente: data.ambiente,
                    cliente: data.cliente,
                    produtos: data.produtos,
                    pedido: data.pedido,
                    subTotal: data.subTotal
                }

                if (empresa[0][0].plano_id != 4) {
                    return res.status(400).json({
                        message: 'Erro ao emitir nota fiscal',
                        details: 'Apenas o plano ouro pode emitir nota fiscal'
                    });
                }

                const response = await axios.post(WEBMANIA_URL, nfedata, {
                    headers: {
                        'X-Consumer-Key': empresa[0][0].webmania_consumer_key,
                        'X-Consumer-Secret': empresa[0][0].webmania_consumer_secret,
                        'X-Access-Token': process.env.WEBMANIA_ACCESS_TOKEN,
                        'X-Access-Token-Secret': process.env.WEBMANIA_ACCESS_TOKEN_SECRET,
                        'Content-Type': 'application/json'
                    }
                });

                const responseData = response.data;

                console.log(responseData)

                if (responseData.error) {
                    return res.status(200).json({ message: `Erro: ${responseData.error}`, type: "error" })
                }

                if (response.status === 200) {
                    // Se a NFE for aprovada, salva no banco de dados
                    await webmaniaModel.createNFE({ ...responseData, venda: cadastravenda.insertId }, req.usuario);

                    if (responseData.status === 'aprovado') {
                        return res.status(201).json({ message: "Venda finalizada com sucesso e nota fiscal emitida com sucesso!", responseApi: responseData, type: "success" });
                    } else if (responseData.status === 'reprovado') {
                        return res.status(201).json({
                            message: `Nota Fiscal Reprovada. Motivo: ${responseData.motivo}`,
                            type: "error"
                        });
                    } else {
                        return res.status(200).json({
                            message: `Erro na emissão da Nota Fiscal. Motivo: ${responseData.error}`,
                            type: "error"
                        });
                    }
                } else {
                    // Resposta com status inesperado
                    return res.status(400).json({
                        message: `Erro inesperado na comunicação com a Webmania. Detalhes: ${responseData.error}`,
                        type: "error"
                    });
                }

            }

        }

        return res.status(201).json({ message: "Venda finalizada com sucesso!!", type: "success", url: { a4: `${process.env.REDIRECT_URL}/recibo/a4/${cadastravenda.insertId}`, mm58: `${process.env.REDIRECT_URL}/recibo/58mm/${cadastravenda.insertId}`, mm80: `${process.env.REDIRECT_URL}/recibo/80mm/${cadastravenda.insertId}` } })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Erro interno do servidor!", type: "error" })
    }

}

const countVendas = async (req, res) => {
    const [vendas] = await vendaModel.countTotalVendas(req.usuario)

    res.status(200).json(vendas)
}

module.exports = {
    getAll,
    getBusca,
    getById,
    getVendaCliente,
    getVendasAnoAtual,
    getVendasMesAtual,
    getVendasDiaAtual,
    getVendasPorPeriodo,
    getVendasPorProdutoPeriodo,
    getVendasPorCategoriaPeriodo,
    getPage,
    getReciboVenda,
    getRelatoriVendasLucroBruto,
    relatorioVendasVendedor,
    createVenda,
    deleteVenda,
    updateVenda,
    finalizarVenda,
    countVendas
};