const vendasModel = require('../models/vendaModel')
const estoqueModel = require('../models/estoqueModel')
const clienteModel = require('../models/clienteModel')
const produtoModal = require('../models/produtoModel')
const produtosVendaModel = require('../models/produtosVendaModel')
const contaReceberModel = require('../models/contaReceberModel')

const getAllData = async (req, res) => {

    const date = new Date()

    const firstDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0]
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]

    const vendasmesatual = await vendasModel.getVendasMesAtual(req.usuario)

    const [vendas] = await vendasModel.countTotalVendas(req.usuario)

    const [estoque] = await estoqueModel.totalEstoque(req.usuario)

    const [clientes] = await clienteModel.totalClientes(req.usuario)

    const vendasanoatual = await vendasModel.getVendasAnoAtual(req.usuario)

    const [produtosdasvendastopcinco] = await produtosVendaModel.getTopCincoProdutos(req.usuario)

    const [clientestop] = await clienteModel.getTopClientes(req.usuario)

    const [estoquecompletotopdez] = await estoqueModel.getEstoqueCompletoTopDez(req.usuario)

    const crediario = await contaReceberModel.getByVencimento(firstDate, lastDate, '10', '1', req.usuario)

    const foraprazo = await contaReceberModel.getCrediarioEmAtraso('10', '1', req.usuario)

    res.status(201).json({
        vendasmesatual,
        vendas,
        estoque,
        clientes,
        vendasanoatual,
        produtosdasvendastopcinco,
        clientestop,
        estoquecompletotopdez,
        crediario,
        foraprazo
    })

}

module.exports = ({
    getAllData
})