const express = require('express');
const dashboard = require('./controllers/dashboardController')
const marcaController = require('./controllers/marcaController');
const marcaMiddleware = require('./middlewares/marcaMiddleware');
const produtoController = require('./controllers/produtoController');
const produtoMiddleware = require('./middlewares/produtoMiddleware');
const colecaoController = require('./controllers/colecaoController');
const colecaoMiddleware = require('./middlewares/colecaoMiddleware');
const categoriaController = require('./controllers/categoriaController');
const categoriaMiddleware = require('./middlewares/categoriaMiddleware');
const subcategoriaController = require('./controllers/subcategoriaController');
const subcategoriaMiddleware = require('./middlewares/subcategoriaMiddleware');
const tipoProdutoController = require('./controllers/tipoProdutoController');
const tipoProdutoMiddleware = require('./middlewares/tipoProdutoMiddleware');
const unidadeController = require('./controllers/unidadeController');
const unidadeMiddleware = require('./middlewares/unidadeMiddleware');
const cstIcmsController = require('./controllers/cstIcmsController');
const cstIcmsMiddleware = require('./middlewares/cstIcmsMiddleware');
const origemController = require('./controllers/origemController');
const origemMiddleware = require('./middlewares/origemMiddleware');
const fornecedorController = require('./controllers/fornecedorController');
const fornecedorMiddleware = require('./middlewares/fornecedorMiddleware');
const clienteController = require('./controllers/clienteController');
const clienteMiddleware = require('./middlewares/clienteMiddleware');
const vendedorController = require('./controllers/vendedorController');
const vendedorMiddleware = require('./middlewares/vendedorMiddleware');
const transportadoraController = require('./controllers/transportadoraController');
const transportadoraMiddleware = require('./middlewares/transportadoraMiddleware');
const enderecoController = require('./controllers/enderecoController');
const enderecoMiddleware = require('./middlewares/enderecoMiddleware');
const KitController = require('./controllers/KitController');
const kitMiddleware = require('./middlewares/kitMiddleware');
const corController = require('./controllers/corController');
const corMiddleware = require('./middlewares/corMiddleware');
const tamanhoController = require('./controllers/tamanhoController');
const tamanhoMiddleware = require('./middlewares/tamanhoMiddleware');
const listaPrecoController = require('./controllers/listaPrecoController');
const listaPrecoMiddleware = require('./middlewares/listaPrecoMiddleware');
const variacaoProdutoController = require('./controllers/variacaoProdutoController');
const variacaoProdutoMiddleware = require('./middlewares/variacaoProdutoMiddleware');
const precoProdutoController = require('./controllers/precoProdutoController');
const precoProdutoMiddleware = require('./middlewares/precoProdutoMiddleware');
const estoqueController = require('./controllers/estoqueController');
const estoqueMiddleware = require('./middlewares/estoqueMiddleware');
const vendaController = require('./controllers/vendaController');
const vendaMiddleware = require('./middlewares/vendaMiddleware');
const produtosVendaController = require('./controllers/produtosVendaController');
const produtosVendaMiddleware = require('./middlewares/produtosVendaMiddleware');
const formaPagamentoController = require('./controllers/formaPagamentoController');
const formaPagamentoMiddleware = require('./middlewares/formaPagamentoMiddleware');
const empresaController = require('./controllers/empresaController');
const empresaMiddleware = require('./middlewares/empresaMiddleware');
const usuarioController = require('./controllers/usuarioController');
const usuarioMiddleware = require('./middlewares/usuarioMiddleware');
const contaReceberController = require('./controllers/contaReceberController');
const contaReceberMiddleware = require('./middlewares/contaReceberMiddleware');
const formasPagamentoController = require('./controllers/formasPagamentoController');
const formasPagamentoMiddleware = require('./middlewares/formasPagamentoMiddleware');
const pagamentoRecebidoController = require('./controllers/pagamentoRecebidoController');
const pagamentoRecebidoMiddleware = require('./middlewares/pagamentoRecebidoMiddleware');
const pagamentoController = require('./controllers/pagamentoController');
const pagamentoMiddleware = require('./middlewares/pagamentoMiddleware');
const contaPagarController = require('./controllers/contaPagarController');
const contaPagarMiddleware = require('./middlewares/contaPagarMiddleware');
const pagamentoPagoController = require('./controllers/pagamentoPagoController');
const pagamentoPagoMiddleware = require('./middlewares/pagamentoPagoMiddleware');
const categoriaContasController = require('./controllers/categoriaContasController');
const categoriaContasMiddleware = require('./middlewares/categoriaContasMiddleware');
const webmaniaController = require('./controllers/webmaniaController');
const webmaniaMiddleware = require('./middlewares/webmaniaMiddleware');
const entradasController = require('./controllers/entradasController')
const produtoDaEntradaController = require('./controllers/produtosDaEntradaController')
const nivelUsuarioController = require('./controllers/nivelUsuarioController')
const notaDaEntradaController = require('./controllers/notaDaEntradaController')

const fluxoDeCaixaController = require('./controllers/fluxoDeCaixaController');

const mercadoPagoController = require('./controllers/mercadoPagoController');
const caixaController = require('./controllers/caixaController')
const mercadoPagoMiddleware = require('./middlewares/mercadoPagoMiddleware');
const login = require('./middlewares/login');
const caixaMiddleware = require('./middlewares/caixaMiddleware');
const operacoesMiddleware = require('./middlewares/operacoesMiddleware')
const operacoesController = require('./controllers/operacoesController')
const receitaController = require('./controllers/receitaController');
const relatorioClienteController = require('./controllers/relatorioClienteController');
const importarControler = require('./controllers/importarControler')

const deleteController = require('./controllers/deleteController');
const desktopController = require('./controllers/desktopController')
const indicacoesController = require('./controllers/indicacoesControler');
const planosController = require('./controllers/planosController')
const cadastraMiddleware = require("./middlewares/cadastrarMiddleware")
const cadastrarContoller = require('./controllers/cadastroController')
const verificaTokenController = require('./controllers/verificaTokenController')

//const multer = require('multer');
//const upload = multer({ dest: 'uploads/' });

const router = express.Router();

//Rotas Mercado Pago
router.post('/pagamentomercadopago', login, mercadoPagoMiddleware.validatePayment, mercadoPagoController.createPayment);
router.post('/notificacao', mercadoPagoController.handleNotification);

//Rotas Marcas
router.get('/marcas', login, marcaController.getAll);
router.post('/marcas', login, marcaMiddleware.validateMandatory, marcaController.createMarca);
router.delete('/marcas/:id', login, marcaController.deleteMarca);
router.put('/marcas/:id', login, marcaMiddleware.validateMandatory, marcaController.updateMarca);
//Rotas Produtos
router.get('/produtos', login, produtoController.getAll);
router.post('/produtos', login, produtoMiddleware.validateMandatory, produtoController.createProduto);
router.delete('/produtos/:id', login, produtoController.deleteProduto);
router.put('/produtos/:id', login, produtoMiddleware.validateMandatory, produtoController.updateProduto);
//Rotas Coleções
router.get('/colecoes', login, colecaoController.getAll);
router.post('/colecoes', login, colecaoMiddleware.validateMandatory, colecaoController.createColecao);
router.delete('/colecoes/:id', login, colecaoController.deleteColecao);
router.put('/colecoes/:id', login, colecaoMiddleware.validateMandatory, colecaoController.updateColecao);
//Rotas Categorias
router.get('/categorias', login, categoriaController.getAll);
router.get('/categoria/:id', login, categoriaController.getCategoria);
router.post('/categorias', login, categoriaMiddleware.validateMandatory, categoriaController.createCategoria);
router.delete('/categorias/:id', login, categoriaController.deleteCategoria);
router.put('/categorias/:id', login, categoriaMiddleware.validateMandatory, categoriaController.updateCategoria);
//Rotas Subcategorias
router.get('/subcategorias', login, subcategoriaController.getAll);
router.get('/subcategorias/:categoriaid', login, subcategoriaController.getByCategoria);
router.post('/subcategorias', login, subcategoriaMiddleware.validateMandatory, subcategoriaController.createSubcategoria);
router.delete('/subcategorias/:id', login, subcategoriaController.deleteSubcategoria);
router.put('/subcategorias/:id', login, subcategoriaMiddleware.validateMandatory, subcategoriaController.updateSubcategoria);
//Rotas Tipo produtos
router.get('/tipoprodutos', login, tipoProdutoController.getAll);
router.post('/tipoprodutos', login, tipoProdutoMiddleware.validateMandatory, tipoProdutoController.createTipoProduto);
router.delete('/tipoprodutos/:id', login, tipoProdutoController.deleteTipoProduto);
router.put('/tipoprodutos/:id', login, tipoProdutoMiddleware.validateMandatory, tipoProdutoController.updateTipoProduto);
//Rotas Unidades
router.get('/unidades', login, unidadeController.getAll);
router.post('/unidades', login, unidadeMiddleware.validateMandatory, unidadeController.createUnidade);
router.delete('/unidades/:id', login, unidadeController.deleteUnidade);
router.put('/unidades/:id', login, unidadeMiddleware.validateMandatory, unidadeController.updateUnidade);
//Rotas cst icms
router.get('/csticms', login, cstIcmsController.getAll);
router.post('/csticms', login, cstIcmsMiddleware.validateMandatory, cstIcmsController.createCstIcms);
router.delete('/csticms/:id', login, cstIcmsController.deleteCstIcms);
router.put('/csticms/:id', login, cstIcmsMiddleware.validateMandatory, cstIcmsController.updateCstIcms);
//Rotas Origens
router.get('/origens', login, origemController.getAll);
router.post('/origens', login, origemMiddleware.validateMandatory, origemController.createOrigem);
router.delete('/origens/:id', login, origemController.deleteOrigem);
router.put('/origens/:id', login, origemMiddleware.validateMandatory, origemController.updateOrigem);
//Rotas Fornecedores
router.get('/fornecedores', login, fornecedorController.getAll);
router.get('/fornecedores/:limit/:page', login, fornecedorController.getPage)
router.get('/fornecedornomecnpj/:nomecnpj', login, fornecedorController.getByNome);
router.get('/fornecedorid/:id', login, fornecedorController.getById);
router.post('/fornecedores', login, fornecedorMiddleware.validateMandatory, fornecedorController.createFornecedor);
router.delete('/fornecedores/:id', login, fornecedorController.deleteFornecedor);
router.put('/fornecedores/:id', login, fornecedorMiddleware.validateMandatory, fornecedorController.updateFornecedor);
//Rotas Clientes
router.get('/clientes', login, clienteController.getAll);
router.get('/clientespage/:limit/:page', login, clienteController.getPage);
router.get('/clientes/:id', login, clienteController.getById);
router.get('/clientenomecpf/:nomecpf', login, clienteController.getByNome);
router.get('/clientestop', login, clienteController.getTopClientes);
router.post('/clientes', login, clienteMiddleware.validateMandatory, clienteController.createCliente);
router.delete('/clientes/:id', login, clienteController.deleteCliente);
router.put('/clientes/:id', login, clienteMiddleware.validateMandatory, clienteController.updateCliente);
//Rotas Vendedores
router.get('/vendedores', login, vendedorController.getAll);
router.get('/vendedorbyusuarioid/:idUser', login, vendedorController.getByIdUsuario)
router.get('/comissaovendedores/periodo/:inicio/:final', login, vendedorController.getComissao)
router.post('/vendedores', login, vendedorMiddleware.validateMandatory, vendedorController.createVendedor);
router.delete('/vendedores/:id', login, vendedorController.deleteVendedor);
router.put('/vendedores/:id', login, vendedorMiddleware.validateMandatory, vendedorController.updateVendedor);
//Rotas transportadoras
router.get('/transportadoras', login, transportadoraController.getAll);
router.post('/transportadoras', login, transportadoraMiddleware.validateMandatory, transportadoraController.createTransportadora);
router.delete('/transportadoras/:id', login, transportadoraController.deleteTransportadora);
router.put('/transportadoras/:id', login, transportadoraMiddleware.validateMandatory, transportadoraController.updateTransportadora);
//Rotas endereços
router.get('/enderecos', login, enderecoController.getAll);
router.get('/enderecoscliente/:idCliente', login, enderecoController.getByCliente);
router.get('/enderecosfornecedor/:idFornecedor', login, enderecoController.getByFornecedor);
router.get('/enderecovendedor/:idVendedor', login, enderecoController.getByVendedor);
router.post('/enderecos', login, enderecoMiddleware.validateMandatory, enderecoController.createEndereco);
router.delete('/enderecos/:id', login, enderecoController.deleteEndereco);
router.put('/enderecos/:id', login, enderecoMiddleware.validateMandatory, enderecoController.updateEndereco);
//Rotas Kits
router.get('/kits', login, KitController.getAll);
router.post('/kits', login, kitMiddleware.validateMandatory, KitController.createKit);
router.delete('/kits/:id', login, KitController.deleteKit);
router.put('/kits/:id', login, kitMiddleware.validateMandatory, KitController.updateKit);
//Rotas Cores
router.get('/cores', login, corController.getAll);
router.get('/cor/:id', login, corController.getCor);
router.post('/cores', login, corMiddleware.validateMandatory, corController.createCor);
router.delete('/cores/:id', login, corController.deleteCor);
router.put('/cores/:id', login, corMiddleware.validateMandatory, corController.updateCor);
//Rotas Tamanhos
router.get('/tamanhos', login, tamanhoController.getAll);
router.get('/tamanho/:id', login, tamanhoController.getTamanho);
router.post('/tamanhos', login, tamanhoMiddleware.validateMandatory, tamanhoController.createTamanho);
router.delete('/tamanhos/:id', login, tamanhoController.deleteTamanho);
router.put('/tamanhos/:id', login, tamanhoMiddleware.validateMandatory, tamanhoController.updateTamanho);
//Rotas Lista preços
router.get('/listaprecos', login, listaPrecoController.getAll);
router.post('/listaprecos', login, listaPrecoMiddleware.validateMandatory, listaPrecoController.createListaPreco);
router.delete('/listaprecos/:id', login, listaPrecoController.deleteListaPreco);
router.put('/listaprecos/:id', login, listaPrecoMiddleware.validateMandatory, listaPrecoController.updateListaPreco);
//Rotas variacões dos produtos
router.get('/variacaoprodutos', login, variacaoProdutoController.getAll);
router.get('/geradordecodigo', login, variacaoProdutoController.generateUniqueCode);
router.post('/variacaoprodutos', login, variacaoProdutoMiddleware.validateMandatory, variacaoProdutoController.createVariacaoProduto);
router.delete('/variacaoprodutos/:id', login, variacaoProdutoController.deleteVariacaoProduto);
router.put('/variacaoprodutos/:id', login, variacaoProdutoMiddleware.validateMandatory, variacaoProdutoController.updateVariacaoProduto);
//Rotas preços produtos
router.get('/precoprodutos', login, precoProdutoController.getAll);
router.post('/precoprodutos', login, precoProdutoMiddleware.validateMandatory, precoProdutoController.createPrecoProduto);
router.delete('/precoprodutos/:id', login, precoProdutoController.deletePrecoProduto);
router.put('/precoprodutos/:id', login, precoProdutoMiddleware.validateMandatory, precoProdutoController.updatePrecoProduto);
//Rotas estoques
router.get('/estoques', login, estoqueController.getAll);
router.get('/estoquepage/:limit/:page/:orderby/:order', login, estoqueController.getPage);
router.get('/estoquecompleto', login, estoqueController.getEstoqueCompleto);
router.get('/estoquecompletotopdez', login, estoqueController.getEstoqueCompletoTopDez);
router.get('/estoquerelatorio', login, estoqueController.getEstoqueRelatorio);
router.get('/estoquenomecodigo/:nomeCodigoBarras', login, estoqueController.getEstoqueByNomeCodigoBarras);
router.get('/estoques/:id', login, estoqueController.getEstoqueById);
router.post('/estoques', login, estoqueMiddleware.validateMandatory, estoqueController.createEstoque);
router.delete('/estoques/:id', login, estoqueController.deleteEstoque);
router.put('/estoques/:id', login, estoqueMiddleware.validateMandatory, estoqueController.updateEstoque);
//Rotas vendas
router.get('/vendas', login, vendaController.getAll);
router.get('/vendas/:id', login, vendaController.getById);
router.get('/buscarvendas/:limit/:page/:busca', login, vendaController.getBusca)
router.get('/vendascliente', login, vendaController.getVendaCliente);
router.get('/vendasanoatual', login, vendaController.getVendasAnoAtual);
router.get('/vendasmesatual', login, vendaController.getVendasMesAtual);
router.get('/vendasdiaatual', login, vendaController.getVendasDiaAtual);
router.get('/vendaspage/:limit/:page', login, vendaController.getPage);
router.get('/vendas/periodo/:dataInicio/:dataFim', login, vendaController.getVendasPorPeriodo);
router.get('/vendasporproduto/periodo/:dataInicio/:dataFim', login, vendaController.getVendasPorProdutoPeriodo);
router.get('/vendasporcategoria/periodo/:dataInicio/:dataFim', login, vendaController.getVendasPorCategoriaPeriodo);
router.get('/recibovenda/:idVenda', login, vendaController.getReciboVenda)
router.get('/lucrobrutoporproduto/periodo/:inicio/:final', login, vendaController.getRelatoriVendasLucroBruto)
router.get('/vendasbyvendedor/periodo/:inicio/:final', login, vendaController.relatorioVendasVendedor)
router.post('/vendas', login, vendaMiddleware.validateMandatory, vendaController.createVenda);
router.post('/finalizarvenda', login, vendaController.finalizarVenda)
router.delete('/vendas/:id', login, vendaController.deleteVenda);
router.put('/vendas/:id', login, vendaMiddleware.validateMandatory, vendaController.updateVenda);
//Rotas produtos das vendas
router.get('/produtosdasvendas', login, produtosVendaController.getAll);
router.get('/produtosdasvendas/:idVenda', login, produtosVendaController.getByVenda);
router.get('/produtosdasvendastopcinco', login, produtosVendaController.getTopCincoProdutos);
router.post('/produtosdasvendas', login, produtosVendaMiddleware.validateMandatory, produtosVendaController.createProdutosDaVenda);
router.delete('/produtosdasvendas/:id', login, produtosVendaController.deleteProdutosDaVenda);
router.put('/produtosdasvendas/:id', login, produtosVendaMiddleware.validateMandatory, produtosVendaController.updateProdutosDaVenda);
//Rotas forma pagamentos
router.get('/formapagamentos', login, formaPagamentoController.getAll);
router.get('/formapagamentos/:idVenda', login, formaPagamentoController.getByVenda);
router.post('/formapagamentos', login, formaPagamentoMiddleware.validateMandatory, formaPagamentoController.createFormaPagamento);
router.delete('/formapagamentos/:id', login, formaPagamentoController.deleteFormaPagamento);
router.put('/formapagamentos/:id', login, formaPagamentoMiddleware.validateMandatory, formaPagamentoController.updateFormaPagamento);
//Rotas empresas
router.get('/empresas', empresaController.getAll);
router.get('/minhaempresa', login, empresaController.getMinhaEmpresa);
router.post('/empresas', empresaMiddleware.validateMandatory, empresaController.createEmpresa);
router.delete('/empresas/:id', empresaController.deleteEmpresa);
router.put('/empresas/:id', empresaMiddleware.validateMandatory, empresaController.updateEmpresa);
//Rotas usuarios
router.get('/usuarios', usuarioController.getAll);
router.get('/usuarioemail/:email', usuarioController.getUsuarioByEmail)
router.get('/usuariosempresa', login, usuarioController.getUsuariosEmpresa);
router.post('/login', usuarioMiddleware.validateLogin, usuarioController.logarUsuario);
router.post('/esqueceusenha', usuarioMiddleware.validateEsqueceuSenha, usuarioController.esqueceuSenha);
router.post('/resetarsenha', usuarioMiddleware.validateResetarSenha, usuarioController.resetarSenha);
router.post('/usuarios', usuarioMiddleware.validateMandatory, usuarioController.createUsuario);
router.delete('/usuarios/:id', usuarioController.deleteUsuario);
router.put('/usuarios/:id', usuarioMiddleware.validateMandatory, usuarioController.updateUsuario);
// Rotas nivel Usuario
router.get('/nivelusuario', login, nivelUsuarioController.getAllNiveis)
//Rotas conta receber
router.get('/contareceber', login, contaReceberController.getAll);
router.get('/buscarcontareceber/:limit/:page/:busca', login, contaReceberController.buscaContaReceber)
router.get('/contareceberbyvenda/:idVenda', login, contaReceberController.getByVenda);
router.get('/contareceberpage/:limit/:page', login, contaReceberController.getPage);
router.get('/contareceber/:inicio/:fim/:limit/:page', login, contaReceberController.getByVencimento);
router.get('/contareceber/periodo/:inicio/:fim', login, contaReceberController.getRelatorioByPeriodo);
router.get('/contareceber/relatorio/:inicio/:fim', login, contaReceberController.contaReceberPeriodo);
router.get('/contareceber/cliente/:id', login, contaReceberController.getByCliente);
router.get('/contareceber/foravencimento/:limit/:page', login, contaReceberController.getByForaVencimento)
router.post('/contareceber', login, contaReceberMiddleware.validateMandatory, contaReceberController.createContaReceber);
router.delete('/contareceber/:id', login, contaReceberController.deleteContaReceber);
router.put('/contareceber/:id', login, contaReceberMiddleware.validateMandatory, contaReceberController.updateContaReceber);
router.get('/contareceberbydate', login, contaReceberController.getByDate);
//Rotas formas pagamento
router.get('/formaspagamento', login, formasPagamentoController.getAll);
router.get('/formaspagamento/:id', login, formasPagamentoController.getById);
router.post('/formaspagamento', login, formasPagamentoMiddleware.validateMandatory, formasPagamentoController.createFormaPagamento);
router.delete('/formaspagamento/:id', login, formasPagamentoController.deleteFormaPagamento);
router.put('/formaspagamento/:id', login, formasPagamentoMiddleware.validateMandatory, formasPagamentoController.updateFormaPagamento);
//Rotas pagamento recebido
router.get('/pagamentorecebido', login, pagamentoRecebidoController.getAll);
router.get('/pagamentorecebidobycontareceber/:idContaReceber', login, pagamentoRecebidoController.getByContaReceber);
router.get('/receitas/periodo/:dataInicio/:dataFim', login, pagamentoRecebidoController.getFinanceiroReceitasPorPeriodo);
router.get('/formaspagamento/periodo/:dataInicio/:dataFim', login, pagamentoRecebidoController.getFormaPagamentoPorPeriodo);
router.post('/pagamentorecebido', login, pagamentoRecebidoMiddleware.validateMandatory, pagamentoRecebidoController.createPagamentoRecebido);
router.delete('/pagamentorecebido/:id', login, pagamentoRecebidoController.deletePagamentoRecebido);
router.put('/pagamentorecebido/:id', login, pagamentoRecebidoMiddleware.validateMandatory, pagamentoRecebidoController.updatePagamentoRecebido);
//Rotas pagamento
router.get('/pagamentos', login, pagamentoController.getAll);
router.get('/pagamento/:id', login, pagamentoController.getPagamento);
router.get('/vencimento-info', login, pagamentoController.getVencimentoInfo);
router.post('/pagamentos', login, pagamentoMiddleware.validateMandatory, pagamentoController.createPagamento);
router.delete('/pagamentos/:id', login, pagamentoController.deletePagamento);
router.put('/pagamentos/:id', login, pagamentoMiddleware.validateMandatory, pagamentoController.updatePagamento);
// Rotas conta pagar
router.get('/contapagar', login, contaPagarController.getAll);
router.get('/contapagarbyfornecedor/:idFornecedor', login, contaPagarController.getByFornecedor);
router.get('/contapagarpage/:limit/:page', login, contaPagarController.getPage);
router.post('/contapagar', login, contaPagarMiddleware.validateMandatory, contaPagarController.createContaPagar);
router.delete('/contapagar/:id', login, contaPagarController.deleteContaPagar);
router.put('/contapagar/:id', login, contaPagarMiddleware.validateMandatory, contaPagarController.updateContaPagar);
router.get('/contapagarbydate', login, contaPagarController.getByDate);
// Rotas pagamento pago
router.get('/pagamentopago', login, pagamentoPagoController.getAll);
router.post('/pagamentopago', login, pagamentoPagoMiddleware.validateMandatory, pagamentoPagoController.createPagamentoPago);
router.delete('/pagamentopago/:id', login, pagamentoPagoController.deletePagamentoPago);
router.put('/pagamentopago/:id', login, pagamentoPagoMiddleware.validateMandatory, pagamentoPagoController.updatePagamentoPago);
//Rotas Categoria Contas
router.get('/categoriacontas', login, categoriaContasController.getAll);
router.post('/categoriacontas', login, categoriaContasMiddleware.validateMandatory, categoriaContasController.createCategoriaContas);
router.delete('/categoriacontas/:id', login, categoriaContasController.deleteCategoriaContas);
router.put('/categoriacontas/:id', login, categoriaContasMiddleware.validateMandatory, categoriaContasController.updateCategoriaContas);
// Rotas para NFEs
router.get('/nfe', login, webmaniaController.getAllNFE);
router.get('/nfe/:id', login, webmaniaController.getNFE);
router.get('/nfepage/:limit/:page', login, webmaniaController.getPageNFE);
router.get('/consultanfe/:uuid', login, webmaniaController.consultaNfe)
router.get('/relatorio/:dataInicio/:dataFinal/:modelo/:status', login, webmaniaController.relatorioNotasPorPeriodo)
router.post('/nfe', login, webmaniaMiddleware.validateNFEData, webmaniaController.createNFE);
router.post('/cancelarnf', login, webmaniaController.cancelarNotaFiscal)
router.post('/updatestatusnfe', webmaniaController.updateStatus);
router.post('/atualizar-empresa-webmania', login, webmaniaController.updateEmpresa);
router.post('/atualizar-endereco-empresa', login, webmaniaController.updateEnderecoFiscal);
router.post('/atualizar-config-nfe', login, webmaniaController.updateConfigNFe);
router.post('/atualizar-config-nfce', login, webmaniaController.updateConfigNFCe);
router.post('/atualizar-certificado', login, webmaniaController.updateCertificado);
// Rotas de Fluxo de caixa
router.get('/fluxodecaixa/:periodo/:limit/:page', login, fluxoDeCaixaController.getAll);
// Rotas caixa
router.get('/caixa/:id', login, caixaController.getCaixa)
router.get('/caixas', login, caixaController.getAllCaixas);
router.get('/caixasabertos', login, caixaController.getAllCaixasAbertos)
router.get('/caixaspages/:limit/:page', login, caixaController.getPage)
router.post('/caixa', login, caixaMiddleware.validateCaixa, caixaController.createcaixa);
router.put('/caixas/:id', login, caixaController.updateCaixa);
router.put('/fecharcaixa/:id', login, caixaMiddleware.validateCaixa, caixaController.fechaCaixa);
router.put('/reabrircaixa/:id', login, caixaMiddleware.validateCaixa, caixaController.reabreCaixa);
// Rptas Operações de Caixa
router.get('/operacaocaixa/:id', login, operacoesController.getByCaixa)
router.post('/operacoescaixa', login, operacoesMiddleware.validateOperacao, operacoesController.createOperacao);
router.put('/operacoescaixa/:id', login, operacoesController.updateOperacao)
router.delete('/deleteoperacao/:id', login, operacoesController.deleteOperacao)
// Rotas entradas de produtos
router.get('/entradas/:limit/:page', login, entradasController.getEntradasPage)
router.post('/salvarentrada', login, entradasController.salvarEntrada)
router.post('/entradas', login, entradasController.criarEntrada)
router.delete('/entradas/:id', login, entradasController.deletaEntrada)
// Rotas produtos da Entrada
router.get('/produtosdaentrada/:id', login, produtoDaEntradaController.getEntradaById)
router.get('/notafiscalentrada/:id', login, notaDaEntradaController.getById)
router.post('/produtosdaentrada', login, produtoDaEntradaController.create)
router.post('/notafiscalentrada', login, notaDaEntradaController.createNotaDaEntrada)
router.get('/cnpj/:cnpj', receitaController.getCNPJInfo);
router.get('/inscricaoestadual/:cnpj', receitaController.getIncricaoEstadual)

// Rota para relatório de clientes
router.get('/relatorio/clientes', login, relatorioClienteController.getRelatorioClientes);

// Rota para exclusão de registros pelo `empresa_id`
router.delete('/excluir-registros-empresa', login, deleteController.deleteAllRecordsByEmpresaId);
router.delete('/zerar-dados-empresa', login, deleteController.zerarDadosDaEmpresa)

// Rota para dashboard
router.get('/dashboard', login, dashboard.getAllData)
router.get('/teste', login, vendaController.countVendas)

//Rotas para importação de planilhas
router.post('/importarplanilhaprodutos', login, importarControler.importarProdutos)
router.post('/importarplanilhaclientes', login, importarControler.importarClientes)
router.post('/importarplanilhafornecedores', login, importarControler.importarFornecedores)

//Rotas Indicação
router.get('/indicacoes', login, indicacoesController.getAll)

router.get('/testeapploja', async (_, res) => {

    res.status(200).json({ message: "teste de conexão" })

})

//Rota download sistema desktop
router.post('/desktop/download', desktopController.downloadDesktop)

//rotas de ativacao de planos
router.post('/cadastrarindicacao', indicacoesController.cadastrarIndicacao)
router.post('/ativarplanoporindicacao', login, planosController.ativarPlanoPorIndicacao)

//rotas de cadastro refatoração
router.post('/cadastrar', cadastraMiddleware.ValidarCadastro, cadastrarContoller.Cadastrar)
router.post('/verificatoken', verificaTokenController.VerificaToken)

module.exports = router;