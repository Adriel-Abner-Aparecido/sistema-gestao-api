const { createEntrada, getEntradaPage, deleteEntrada } = require('../models/entradasModel')
const { updateFornecedor, createFornecedor } = require('../models/fornecedorModel')
const { createNotaEntrada } = require('../models/notasDaEntradaModel')
const { createContaPagar } = require('../models/contaPagarModel')
const { createProduto, updateProduto } = require('../models/produtoModel')
const { createVariacaoProduto, updateVariacaoProduto } = require('../models/variacaoProdutoModel')
const { createPrecoProduto, updatePrecoProduto } = require('../models/precoProdutoModel')
const { createEstoque, getEstoqueByNomeCodigoBarras, updateEstoque } = require('../models/estoqueModel')
const { updateEndereco, createEndereco } = require('../models/enderecoModel')
const { createProdutosEntrada } = require('../models/produtosDaEntradaModel')

const criarEntrada = async (req, res) => {

    const [criaEntrada] = await createEntrada(req.body, req.usuario)

    return res.status(200).json(criaEntrada)

}

const getEntradasPage = async (req, res) => {

    const { page, limit } = req.params

    const entradas = await getEntradaPage(req.usuario, page, limit)

    return res.status(200).json(entradas)

}

const deletaEntrada = async (req, res) => {

    const { id } = req.params

    try {
        await deleteEntrada(id)
        res.status(200).json({ message: "Entrada deletada com sucesso" })
    } catch (error) {
        console.error('Erro ao tentar apagar entrada')
        res.status(500).json({ message: "Erro ao tentar apaga entrada" })
    }

}

const salvarEntrada = async (req, res) => {

    const data = req.body

    console.log(data)

    let fornecedorId
    let entradaId

    try {

        if (data.produtos.length === 0) {
            res.status(200).json({ message: "Voce precisa selecionar pelo menos um produto." })
        }

        //Cadastra o fornecedor
        if (data.cadastraFornecedor) {

            const dataFornecedor = data.fornecedor

            if (data.fornecedor.id) {

                fornecedorId = data.fornecedor.id

                await updateFornecedor(fornecedorId, dataFornecedor, req.usuario)

                if (data.fornecedor.enderecoId) {
                    await updateEndereco(data.fornecedor.enderecoId, dataFornecedor, req.usuario)
                } else {
                    await createEndereco(dataFornecedor, req.usuario)
                }

                console.log("Atualizou dados")

            } else {

                const cadastraFornecedor = await createFornecedor(dataFornecedor, req.usuario)

                if (cadastraFornecedor.insertId) {

                    const dataEndereco = {
                        fornecedorId: cadastraFornecedor.insertId,
                        ...dataFornecedor
                    }

                    await createEndereco(dataEndereco, req.usuario)
                }

                fornecedorId = cadastraFornecedor.insertId

            }

        }

        //Cadastra a entrada
        const dataEntrada = {
            fornecedorId: fornecedorId ?? null,
            motivo: data.notafiscal.motivo ?? 'Produto para venda',
            numeroNota: data.notafiscal.numeronfe ?? null,
            observacao: data.notafiscal.observacao ?? null,
            valorNota: data.notafiscal.valorNota ?? 0,
        }

        const cadastrarEntrada = await createEntrada(dataEntrada, req.usuario)

        if (cadastrarEntrada.insertId) {

            entradaId = cadastrarEntrada.insertId

            //Cadastra a nota

            const dataNotaEntrada = {
                entradaId: entradaId,
                valorNf: data.notafiscal.totalnfe,
                numeroNf: data.notafiscal.numeronfe,
                dataEmissao: data.notafiscal.dataemissao,
                tipoPag: data.notafiscal.tipopag,
                cnpjTransp: data.notafiscal.cnpjtransp,
                nomeTransp: data.notafiscal.nometransp,
                valorFrete: data.notafiscal.valorfrete ?? 0
            }

            await createNotaEntrada(dataNotaEntrada, req.usuario)

            //cadastra a contas a pagar

            if (data.cadastrarContaPagar) {
                if (data.duplicatas && data.duplicatas.length > 0) {
                    for (const parcela of data.duplicatas) {
                        const dataContaPagar = {
                            vendaId: null,
                            fornecedorId: fornecedorId,
                            valor: parcela.valor,
                            dataVencimento: parcela.dataVencimento,
                            tipo: "Compra",
                            categoriaConta: null
                        }
                        await createContaPagar(dataContaPagar, req.usuario)
                    }
                } else {
                    const dataContaPagar = {
                        vendaId: null,
                        fornecedorId: fornecedorId,
                        valor: data.notafiscal.totalnfe,
                        dataVencimento: data.notafiscal.dataemissao,
                        tipo: "Compra",
                        categoriaConta: null
                    }
                    await createContaPagar(dataContaPagar, req.usuario)
                }
            }

            //salvar produtos da entrada

            for (const produto of data.produtos) {

                const [verificaNomeProduto] = await getEstoqueByNomeCodigoBarras(produto.nome, req.usuario)
                const [verificaCodigoBarras] = await getEstoqueByNomeCodigoBarras(produto.codigoBarras, req.usuario)

                console.log(verificaNomeProduto[0])
                console.log(verificaCodigoBarras[0])

                let produtoId, variacaoId, precoId, estoqueId, qtdEstoque = 0

                if (verificaNomeProduto.length > 0) {
                    ({ produto_id: produtoId, variacao_produto_id: variacaoId, preco_produto_id: precoId, estoque_id: estoqueId, quantidade: qtdEstoque } = verificaNomeProduto[0]);
                } else if (verificaCodigoBarras.length > 0) {
                    ({ produto_id: produtoId, variacao_produto_id: variacaoId, preco_produto_id: precoId, estoque_id: estoqueId, quantidade: qtdEstoque } = verificaCodigoBarras[0]);
                }

                const dataProduto = {
                    fornecedorId: fornecedorId ?? null,
                    tipoProdutoId: produto.tipoProdutoId || 3,
                    marcaId: null,
                    categoriaId: null,
                    unidadeId: produto.unidadeId,
                    origemId: null,
                    colecaoId: null,
                    subCategoriaId: null,
                    nome: produto.nome,
                    cstIcmsId: null,
                    status: 0,
                    icms: null,
                    ipi: null,
                    pis: null,
                    cofins: null,
                    cest: null,
                    ncm: String(produto.ncm) || null,
                    observacao: null,
                    kitProduto: null,
                    comissao: null,
                    descontoMax: null,
                    insumo: null,
                    classeImposto: produto.classeImposto
                }

                if (verificaCodigoBarras.length > 0 || verificaNomeProduto.length > 0) {

                    console.log("encontrou um produto")

                    await updateProduto(produtoId, dataProduto, req.usuario)

                    const dataVariacaoProduto = {
                        produtoId: produtoId,
                        corId: null,
                        tamanhoId: null,
                        codigoBarras: produto.codigoBarras,
                        codigoProduto: produto.codigoProduto,
                        descricao: produto.descricao,
                    }

                    await updateVariacaoProduto(variacaoId, dataVariacaoProduto, req.usuario)

                    const dataPrecoProduto = {
                        variacaoProdutoId: variacaoId,
                        listaPrecoId: 1,
                        valor: produto.valor !== "" ? produto.valor : 0,
                        markup: produto.markup !== "" ? produto.markup : 0,
                        valorCusto: produto.valorCusto !== "" ? produto.valorCusto : 0
                    }

                    if (data.alteraValor) {
                        await updatePrecoProduto(precoId, dataPrecoProduto, req.usuario)
                    }

                    const dataEstoqueProduto = {
                        variacaoProdutoId: variacaoId,
                        validade: null,
                        localizacao: null,
                        quantidade: produto.quantidade + qtdEstoque,
                        quantidadeMin: produto.quantidadeMin,
                        quantidadeMax: produto.quantidadeMax
                    }

                    if (data.movimentaEstoque) {
                        await updateEstoque(estoqueId, dataEstoqueProduto, req.usuario)
                    }

                    const dataProdutoEntrada = {
                        entradaId: entradaId,
                        produtoId: produtoId,
                        variacaoId: variacaoId,
                        valorCusto: produto.valorCusto !== "" ? produto.valorCusto : 0,
                        markup: produto.markup !== "" ? produto.markup : 0,
                        quantidade: produto.quantidade,
                        valor: produto.valor !== "" ? produto.valor : 0,
                        valorTotal: produto.valorTotal !== 0 ? produto.valorTotal : 0
                    }

                    await createProdutosEntrada(dataProdutoEntrada, req.usuario)

                } else {

                    const createproduto = await createProduto(dataProduto, req.usuario)

                    if (createproduto.insertId) {

                        const dataVariacaoProduto = {
                            produtoId: createproduto.insertId,
                            corId: null,
                            tamanhoId: null,
                            codigoBarras: produto.codigoBarras,
                            codigoProduto: produto.codigoProduto,
                            descricao: produto.descricao,
                        }

                        const variacao = await createVariacaoProduto(dataVariacaoProduto, req.usuario)

                        if (variacao.insertId) {

                            const dataPrecoProduto = {
                                variacaoProdutoId: variacao.insertId,
                                listaPrecoId: 1,
                                valor: produto.valor !== "" ? produto.valor : 0,
                                markup: produto.markup !== "" ? produto.markup : 0,
                                valorCusto: produto.valorCusto !== "" ? produto.valorCusto : 0
                            }

                            await createPrecoProduto(dataPrecoProduto, req.usuario)

                            const dataEstoqueProduto = {
                                variacaoProdutoId: variacao.insertId,
                                validade: null,
                                localizacao: null,
                                quantidade: produto.quantidade,
                                quantidadeMin: produto.quantidadeMin,
                                quantidadeMax: produto.quantidadeMax,
                            }

                            await createEstoque(dataEstoqueProduto, req.usuario)

                            const dataProdutoEntrada = {
                                entradaId: entradaId,
                                produtoId: createproduto.insertId,
                                variacaoId: variacao.insertId,
                                valorCusto: produto.valorCusto !== "" ? produto.valorCusto : 0,
                                markup: produto.markup !== "" ? produto.markup : 0,
                                quantidade: produto.quantidade,
                                valor: produto.valor !== "" ? produto.valor : 0,
                                valorTotal: produto.valorTotal !== 0 ? produto.valorTotal : 0
                            }

                            await createProdutosEntrada(dataProdutoEntrada, req.usuario)

                            console.log("Criou produto, variacao, preco, estoque")

                        }

                    }

                }

            }

        }

        res.status(201).json({ message: "Entrada registrada com sucesso!" })

        //cadastra os produtos
    } catch (error) {
        res.status(500).json({ message: "Erro interno do servidor" + error, type: "error" })
        throw new Error(error)
    }
}

module.exports = {
    criarEntrada,
    getEntradasPage,
    deletaEntrada,
    salvarEntrada
}