const { createCliente } = require("../models/clienteModel");
const { createEndereco } = require("../models/enderecoModel");
const { createEstoque } = require("../models/estoqueModel");
const { createFornecedor } = require("../models/fornecedorModel");
const { createPrecoProduto } = require("../models/precoProdutoModel");
const { createProduto } = require("../models/produtoModel");
const { createVariacaoProduto } = require("../models/variacaoProdutoModel");

const importarProdutos = async (req, res) => {
    try {
        const produtos = req.body;
        let contador = 0;

        // Criar um array de promessas para processar tudo em paralelo
        const promessas = produtos.map(async (produto) => {
            const dadosProduto = {
                fornecedorId: null,
                tipoProdutoId: 3,
                marcaId: produto.marcaId || null,
                categoriaId: produto.categoriaId || null,
                unidadeId: produto.unidadeId,
                origemId: null,
                colecaoId: produto.colecaoId || null,
                subCategoriaId: produto.subCategoriaId || null,
                nome: produto.nome,
                cstIcmsId: null,
                status: 0,
                icms: null,
                ipi: null,
                pis: null,
                cofins: null,
                cest: null,
                ncm: produto.ncm || null,
                observacao: null,
                kitProduto: null,
                comissao: null,
                descontoMax: null,
                insumo: null,
                classeImposto: produto.classeImposto || null
            };

            const cadastraProduto = await createProduto(dadosProduto, req.usuario);

            if (cadastraProduto.insertId) {
                const dadosVariacao = {
                    produtoId: cadastraProduto.insertId,
                    corId: null,
                    tamanhoId: null,
                    codigoBarras: produto.codigoBarras,
                    codigoProduto: produto.codigoProduto,
                    descricao: produto.descricao
                };

                const cadastraVariacao = await createVariacaoProduto(dadosVariacao, req.usuario);

                if (cadastraVariacao.insertId) {
                    const dadosPrecoProduto = {
                        variacaoProdutoId: cadastraVariacao.insertId,
                        listaPrecoId: 1,
                        valor: produto.valor || 0,
                        markup: 0,
                        valorCusto: produto.valorCusto || 0
                    };

                    const dadosEstoque = {
                        variacaoProdutoId: cadastraVariacao.insertId,
                        validade: null,
                        localizacao: null,
                        quantidade: produto.quantidade,
                        quantidadeMin: produto.quantidadeMin,
                        quantidadeMax: produto.quantidadeMax
                    };

                    // Executa Preço e Estoque em paralelo
                    await Promise.all([
                        createPrecoProduto(dadosPrecoProduto, req.usuario),
                        createEstoque(dadosEstoque, req.usuario)
                    ]);

                    contador++;
                }
            }
        });

        // Aguarda todas as operações finalizarem
        await Promise.all(promessas);

        res.status(201).json({ message: "Produtos importados", total: contador });

    } catch (error) {
        console.error("Erro ao importar produtos:", error);
        res.status(500).json({ message: "Erro ao importar produtos", error });
    }
};

const importarClientes = async (req, res) => {
    try {
        const clientes = req.body;
        let contador = 0;

        // Criar um array de promessas para processar tudo em paralelo
        const promessas = clientes.map(async (cliente) => {
            const dadosCliente = {
                nome: cliente.nome,
                telefone: cliente.telefone || null,
                celular: cliente.celular || null,
                email: cliente.email || null,
                tipoPessoa: cliente.tipoPessoa || "Pessoa Física",
                cnpjCpf: cliente.cnpjCpf || null,
                fantasia: cliente.fantasia || null,
                observacao: cliente.observacao || null,
                inscricaoEstadual: cliente.inscricaoEstadual || null,
                dataNascimento: cliente.dataNascimento || null,
                // dados endereco

            };

            const cadastraCliente = await createCliente(dadosCliente, req.usuario);

            if (cadastraCliente.insertId) {
                const dadosEndereco = {
                    fornecedorId: null,
                    clienteId: cadastraCliente.insertId,
                    vendedorId: null,
                    rua: cliente.rua,
                    numero: cliente.numero,
                    bairro: cliente.bairro,
                    cep: cliente.cep,
                    cidade: cliente.cidade,
                    uf: cliente.uf,
                    complemento: cliente.complemento
                };

                await createEndereco(dadosEndereco, req.usuario);

                contador++;

            }
        });

        // Aguarda todas as operações finalizarem
        await Promise.all(promessas);

        res.status(201).json({ message: "Clientes importados", total: contador });

    } catch (error) {
        console.error("Erro ao importar clientes:", error);
        res.status(500).json({ message: "Erro ao importar produtos", error });
    }
};

const importarFornecedores = async (req, res) => {

    console.log(req.body)

    try {
        const fornecedores = req.body;
        let contador = 0;

        // Criar um array de promessas para processar tudo em paralelo
        const promessas = fornecedores.map(async (fornecedor) => {
            const dadosFornecedor = {
                nome: fornecedor.nome,
                telefone: fornecedor.telefone || null,
                celular: fornecedor.celular || null,
                email: fornecedor.email || null,
                tipoPessoa: fornecedor.tipoPessoa || "Pessoa Física",
                cnpjCpf: fornecedor.cnpjCpf || null,
                fantasia: fornecedor.fantasia || null,
                observacao: fornecedor.observacao || null,
                inscricaoEstadual: fornecedor.inscricaoEstadual || null,
                dataNascimento: fornecedor.dataNascimento || null,
                // dados endereco

            };

            const cadastraFornecedor = await createFornecedor(dadosFornecedor, req.usuario);

            if (cadastraFornecedor.insertId) {
                const dadosEndereco = {
                    fornecedorId: cadastraFornecedor.insertId,
                    clienteId: null,
                    vendedorId: null,
                    rua: fornecedor.rua,
                    numero: fornecedor.numero,
                    bairro: fornecedor.bairro,
                    cep: fornecedor.cep,
                    cidade: fornecedor.cidade,
                    uf: fornecedor.uf,
                    complemento: fornecedor.complemento
                };

                await createEndereco(dadosEndereco, req.usuario);

                contador++;

            }
        });

        // Aguarda todas as operações finalizarem
        await Promise.all(promessas);

        res.status(201).json({ message: "Fornecedores importados", total: contador });

    } catch (error) {
        console.error("Erro ao importar fornecedores:", error);
        res.status(500).json({ message: "Erro ao importar produtos", error });
    }
};

module.exports = {
    importarProdutos,
    importarClientes,
    importarFornecedores
}