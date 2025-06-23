const connection = require('./connection');

const getAll = async (usuarioLogado) => {

    const produto = await connection.execute('SELECT * FROM produto WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return produto;

};

const deleteProduto = async (id, usuarioLogado) => {

    const dateUTC = new Date(Date.now()).toUTCString();

    const [oldProdutoData] = await connection.execute('SELECT * FROM produto WHERE id = ?', [id]);

    const [removedProduto] = await connection.execute('UPDATE produto SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    // Registra log após exclusão do produto
    await registrarLog(usuarioLogado.id, 'produto', 'deleteProduto', oldProdutoData[0], { deleted_at: dateUTC });

    return removedProduto;

}

const createProduto = async (produto, usuarioLogado) => {

    console.log(produto)

    const { tipoProdutoId, marcaId, categoriaId, fornecedorId, unidadeId, origemId, colecaoId, cstIcmsId, subCategoriaId,
        nome, status, icms, ipi, pis, cofins, cest, ncm, observacao, kitProduto, comissao, descontoMax, insumo, classeImposto } = produto;

    const [tipoProduto] = await connection.execute('SELECT * FROM tipo_produto WHERE id = ?', [tipoProdutoId]);

    const [todosProdutos] = await connection.execute('SELECT * FROM produto WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    const [empresa] = await connection.execute('SELECT * FROM empresa WHERE id = ?', [usuarioLogado.empresa_id]);

    if (empresa[0].plano_id == 1) {
        if (todosProdutos.length >= 100) {
            return { message: "O plano gratuito não pode cadastrar mais de 100 produtos" };
        }
    } else if (empresa[0].plano_id == 2) {
        if (todosProdutos.length >= 1000) {
            return { message: "O plano Bronze não pode cadastrar mais de 500 produtos" };
        }
    } else if (empresa[0].plano_id == 3) {
        if (todosProdutos.length >= 2000) {
            return { message: "O plano Prata não pode cadastrar mais de 2000 produtos" };
        }
    } else if (empresa[0].plano_id == 4) {
        if (todosProdutos.length >= 15000) {
            return { message: "Voce atingiu o limite maximo de 15000 produtos" }
        }
    }

    if (tipoProduto.length == 0) {
        return { erro: "Não existe esse tipo Produto" };
    } else {
        const dateUTC = new Date(Date.now()).toUTCString();

        const query = `
            INSERT INTO 
                produto(
                        tipo_produto_id, 
                        marca_id, 
                        categoria_id, 
                        fornecedor_id, 
                        unidade_id, 
                        origem_id, 
                        colecao_id, 
                        cst_icms_id, 
                        sub_categoria_id, 
                        nome, 
                        status, 
                        icms, 
                        ipi, 
                        pis, 
                        cofins, 
                        cest, 
                        ncm, 
                        observacao, 
                        kit_produto, 
                        comissao, 
                        desconto_max, 
                        insumo, 
                        classe_imposto, 
                        created_at, 
                        empresa_id
                        )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const ncmTratado = ncm && typeof ncm === "string" ? ncm.replace(/\s+/g, '') : null

        const params = [
            tipoProdutoId,
            marcaId,
            categoriaId,
            fornecedorId,
            unidadeId,
            origemId,
            colecaoId,
            cstIcmsId,
            subCategoriaId,
            nome,
            status,
            icms,
            ipi,
            pis,
            cofins,
            cest,
            ncmTratado,
            observacao,
            kitProduto,
            comissao,
            descontoMax,
            insumo,
            classeImposto,
            dateUTC,
            usuarioLogado.empresa_id
        ]


        const logData = {
            nome,
            status,
            icms,
            ipi,
            pis,
            cofins,
            cest,
            ncm,
            observacao,
            kitProduto,
            comissao,
            descontoMax,
            insumo,
            classeImposto,
            created_at: dateUTC,
            empresa_id: usuarioLogado.empresa_id,
        };

        try {

            const [createdProduto] = await connection.execute(query, params);
            // Registra log após criação do produto
            await registrarLog(usuarioLogado.id, 'produto', 'createProduto', null, logData);

            return { insertId: createdProduto.insertId };

        } catch (error) {
            throw new Error("Erro ao tentar cadastrar um novo produto")
        }

    }
}

const updateProduto = async (id, produto, usuarioLogado) => {

    console.log(produto)

    const { tipoProdutoId, marcaId, categoriaId, fornecedorId, unidadeId, origemId, colecaoId, cstIcmsId, subCategoriaId,
        nome, status, icms, ipi, pis, cofins, cest, ncm, observacao, kitProduto, comissao, descontoMax, insumo, classeImposto } = produto;

    const [tipoProduto] = await connection.execute('SELECT * FROM tipo_produto WHERE id = ?', [tipoProdutoId]);

    if (tipoProduto.length == 0) {
        return { erro: "Não existe esse tipo Produto" };
    } else {
        const dateUTC = new Date(Date.now()).toUTCString();

        const query = `UPDATE produto SET tipo_produto_id = ?, marca_id = ?, categoria_id = ?, fornecedor_id = ?, unidade_id = ?, origem_id = ?,
        colecao_id = ?, cst_icms_id = ?, sub_categoria_id = ?, nome = ?, status = ?, icms = ?, ipi = ?, pis = ?, cofins = ?, cest = ?, ncm = ?, 
        observacao = ?, kit_produto = ?, comissao = ?, desconto_max = ?, insumo = ?, classe_imposto = ?, updated_at = ?, empresa_id = ?, deleted_at = null WHERE id = ?`;

        const [oldProdutoData] = await connection.execute('SELECT * FROM produto WHERE id = ?', [id]);

        const ncmTratado = ncm && typeof ncm === "string" ? ncm.replace(/\s+/g, '') : null

        const [updatedProduto] = await connection.execute(query,
            [tipoProdutoId, marcaId, categoriaId, fornecedorId, unidadeId, origemId, colecaoId, cstIcmsId, subCategoriaId, nome, status,
                icms, ipi, pis, cofins, cest, ncmTratado, observacao, kitProduto, comissao, descontoMax, insumo, classeImposto, dateUTC, usuarioLogado.empresa_id, id]);

        const logData = {
            nome,
            status,
            icms,
            ipi,
            pis,
            cofins,
            cest,
            ncm,
            observacao,
            kitProduto,
            comissao,
            descontoMax,
            insumo,
            classeImposto,
            updated_at: dateUTC,
            empresa_id: usuarioLogado.empresa_id,
        };

        // Registra log após atualização do produto
        await registrarLog(usuarioLogado.id, 'produto', 'updateProduto', oldProdutoData[0], logData);

        return updatedProduto;

    }
}

const registrarLog = async (userId, table, action, oldData, newData) => {

    await connection.execute(
        'INSERT INTO sistema_logs (usuario_id, tabela, acao, data_hora, dados_antigos, dados_novos) VALUES (?, ?, ?, NOW(), ?, ?)',
        [userId, table, action, JSON.stringify(oldData), JSON.stringify(newData)]
    );

}

module.exports = {
    getAll,
    createProduto,
    deleteProduto,
    updateProduto
};