const connection = require('./connection');

const totalEstoque = async (usuario) => {

    const query = `
        SELECT
            COUNT(id) as total_produtos,
            IFNULL(ROUND(SUM(quantidade), 2), 0) as total_estoque,
            IFNULL(SUM(quantidade < quantidade_min OR quantidade <= 0), 0) as estoque_baixo
        FROM
            estoque
        WHERE
            deleted_at IS NULL
        AND
            empresa_id = ?
    `;

    const params = [usuario.empresa_id]

    const estoquecompleto = connection.execute(query, params)

    return estoquecompleto

}

const getAll = async (usuarioLogado) => {
    const estoque = await connection.execute('SELECT * FROM estoque WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return estoque;
};

const getEstoqueCompleto = async (usuarioLogado) => {
    const query = `SELECT 
	                    estoque.id as estoque_id, 
                        estoque.variacao_produto_id, 
                        estoque.validade, 
                        estoque.localizacao, 
                        estoque.quantidade, 
                        estoque.quantidade_min, 
                        estoque.quantidade_max, 
                        estoque.updated_at,
	                    variacao_produto.produto_id, 
                        variacao_produto.cor_id, 
                        variacao_produto.tamanho_id, 
                        variacao_produto.codigo_barras, 
                        variacao_produto.codigo_produto,
	                    preco_produto.id as preco_produto_id, 
                        preco_produto.lista_preco_id, 
                        preco_produto.valor, 
                        preco_produto.markup, 
                        preco_produto.valor_custo,
                        produto.tipo_produto_id, 
                        produto.marca_id, 
                        produto.categoria_id, 
                        produto.fornecedor_id, 
                        produto.unidade_id, 
                        produto.origem_id, 
                        produto.colecao_id, 
                        produto.cst_icms_id,
                        produto.sub_categoria_id, 
                        produto.nome, 
                        produto.id as produto_id, 
                        produto.ncm, 
                        produto.classe_imposto,
                        cor.nome as cor_nome, 
                        tamanho.nome as tamanho_nome, 
                        categoria.nome as categoria_nome
                    FROM estoque
                    LEFT JOIN variacao_produto ON variacao_produto.id = estoque.variacao_produto_id
                    LEFT JOIN preco_produto ON preco_produto.variacao_produto_id = estoque.variacao_produto_id
                    LEFT JOIN produto ON produto.id = variacao_produto.produto_id
                    LEFT JOIN cor ON cor.id = variacao_produto.cor_id
                    LEFT JOIN tamanho ON tamanho.id = variacao_produto.tamanho_id
                    LEFT JOIN categoria ON categoria.id = produto.categoria_id
                    WHERE estoque.deleted_at IS NULL 
                    AND estoque.empresa_id = ?`;

    const estoque = await connection.execute(query, [usuarioLogado.empresa_id]);

    return estoque;
};

const getEstoqueCompletoTopDez = async (usuarioLogado) => {
    const query = `SELECT 
	                    estoque.id as estoque_id, 
                        estoque.variacao_produto_id, 
                        estoque.validade, 
                        estoque.localizacao, 
                        estoque.quantidade, 
                        estoque.quantidade_min, 
                        estoque.quantidade_max, 
                        estoque.updated_at,
	                    variacao_produto.produto_id, 
                        variacao_produto.cor_id, 
                        variacao_produto.tamanho_id, 
                        variacao_produto.codigo_barras, 
                        variacao_produto.codigo_produto,
	                    preco_produto.id as preco_produto_id, 
                        preco_produto.lista_preco_id, 
                        ROUND(preco_produto.valor, 2) AS valor, 
                        preco_produto.markup, 
                        ROUND(preco_produto.valor_custo,2) AS valor_custo,
                        produto.tipo_produto_id, 
                        produto.marca_id, 
                        produto.categoria_id, 
                        produto.fornecedor_id, 
                        produto.unidade_id, 
                        produto.origem_id, 
                        produto.colecao_id, 
                        produto.cst_icms_id,
                        produto.sub_categoria_id, 
                        produto.nome, 
                        produto.id as produto_id, 
                        produto.ncm, 
                        produto.classe_imposto,
                        cor.nome as cor_nome, 
                        tamanho.nome as tamanho_nome, 
                        categoria.nome as categoria_nome
                    FROM estoque
                    LEFT JOIN variacao_produto ON variacao_produto.id = estoque.variacao_produto_id
                    LEFT JOIN preco_produto ON preco_produto.variacao_produto_id = estoque.variacao_produto_id
                    LEFT JOIN produto ON produto.id = variacao_produto.produto_id
                    LEFT JOIN cor ON cor.id = variacao_produto.cor_id
                    LEFT JOIN tamanho ON tamanho.id = variacao_produto.tamanho_id
                    LEFT JOIN categoria ON categoria.id = produto.categoria_id
                    WHERE estoque.deleted_at IS NULL 
                    AND estoque.empresa_id = ?
                    AND produto.tipo_produto_id != 2
                    AND (estoque.quantidade = 0 OR estoque.quantidade < estoque.quantidade_min)
                    LIMIT 0, 10;
                    `;

    const estoque = await connection.execute(query, [usuarioLogado.empresa_id]);

    return estoque;
};

const getEstoqueRelatorio = async (usuarioLogado) => {
    const query = `SELECT 
        produto.nome AS nome_produto,
        marca.nome AS nome_marca,
        categoria.nome AS nome_categoria,
        sub_categoria.nome AS nome_subcategoria,
        cor.nome AS nome_cor,
        tamanho.nome AS nome_tamanho,
        estoque.localizacao AS localizacao,
        estoque.quantidade AS quantidade,
        estoque.quantidade_min AS quantidade_min,
        estoque.quantidade_max AS quantidade_max,
        preco_produto.valor AS valor,
        preco_produto.valor_custo AS valor_custo
    FROM 
        estoque
    LEFT JOIN variacao_produto ON estoque.variacao_produto_id = variacao_produto.id
    LEFT JOIN produto ON variacao_produto.produto_id = produto.id
    LEFT JOIN preco_produto ON variacao_produto.id = preco_produto.variacao_produto_id
    LEFT JOIN marca ON produto.marca_id = marca.id
    LEFT JOIN categoria ON produto.categoria_id = categoria.id
    LEFT JOIN sub_categoria ON produto.sub_categoria_id = sub_categoria.id
    LEFT JOIN cor ON variacao_produto.cor_id = cor.id
    LEFT JOIN tamanho ON variacao_produto.tamanho_id = tamanho.id
    WHERE 
        estoque.deleted_at IS NULL AND 
        estoque.empresa_id = ?;`;

    const estoque = await connection.execute(query, [usuarioLogado.empresa_id]);

    return estoque;
};


const getPage = async (usuarioLogado, page, limitItems, orderby, order) => {

    let limit;

    const validaColuna = [
        "estoque.id",
        "produto.nome",
        "variacao_produto.codigo_produto",
        "variacao_produto.cor_id",
        "variacao_produto.tamanho_id",
        "preco_produto.valor",
        "estoque.quantidade"
    ]

    const validaOrdem = [
        "ASC",
        "DESC"
    ]

    const ordenarPorColune = validaColuna.includes(orderby) ? orderby : "estoque.id";
    const ordem = validaOrdem.includes(order.toUpperCase()) ? order.toUpperCase() : "DESC"

    const queryLinha = `SELECT 
                            *
                        FROM estoque
                        WHERE estoque.deleted_at IS NULL 
                        AND estoque.empresa_id = ?`;

    const [linhas] = await connection.execute(queryLinha, [usuarioLogado.empresa_id]);

    page > 0 ? limit = (page - 1) * limitItems : 0;

    const query = `SELECT 
                            estoque.id as estoque_id, 
                            estoque.variacao_produto_id, 
                            estoque.validade, 
                            estoque.localizacao, 
                            estoque.quantidade, 
                            estoque.quantidade_min, 
                            estoque.quantidade_max, 
                            estoque.updated_at,
                            variacao_produto.produto_id, 
                            variacao_produto.cor_id, 
                            variacao_produto.tamanho_id, 
                            variacao_produto.codigo_barras, 
                            variacao_produto.codigo_produto,
                            preco_produto.id as preco_produto_id, 
                            preco_produto.lista_preco_id, 
                            preco_produto.valor, 
                            preco_produto.markup, 
                            preco_produto.valor_custo,
                            produto.tipo_produto_id, 
                            produto.marca_id, 
                            produto.categoria_id, 
                            produto.fornecedor_id, 
                            produto.unidade_id, 
                            produto.origem_id, 
                            produto.colecao_id, 
                            produto.cst_icms_id,
                            produto.sub_categoria_id, 
                            produto.nome, 
                            produto.id as produto_id, 
                            produto.ncm, 
                            produto.classe_imposto,
                            cor.nome as cor_nome, 
                            tamanho.nome as tamanho_nome, 
                            categoria.nome as categoria_nome, 
                            unidade.sigla as unidade_sigla
                        FROM estoque
                        LEFT JOIN variacao_produto ON variacao_produto.id = estoque.variacao_produto_id
                        LEFT JOIN preco_produto ON preco_produto.variacao_produto_id = estoque.variacao_produto_id
                        LEFT JOIN produto ON produto.id = variacao_produto.produto_id
                        LEFT JOIN cor ON cor.id = variacao_produto.cor_id
                        LEFT JOIN tamanho ON tamanho.id = variacao_produto.tamanho_id
                        LEFT JOIN categoria ON categoria.id = produto.categoria_id
                        LEFT JOIN unidade ON unidade.id = produto.unidade_id
                        WHERE estoque.deleted_at IS NULL
                        AND estoque.empresa_id = ?
                        ORDER BY ${ordenarPorColune} ${ordem}
                        LIMIT ?, ?
                        `;

    const params = [usuarioLogado.empresa_id, `${limit}`, limitItems]

    const [estoque] = await connection.execute(query, params);

    return {
        total_estoque: linhas.length,
        estoque
    };
};

const getEstoqueByNomeCodigoBarras = async (nomeCodigoBarras, usuarioLogado) => {

    const isId = !isNaN(nomeCodigoBarras)

    const query = `SELECT 
                        estoque.id as estoque_id, 
                        estoque.variacao_produto_id, 
                        estoque.validade, 
                        estoque.localizacao, 
                        estoque.quantidade, 
                        estoque.quantidade_min, 
                        estoque.quantidade_max, 
                        estoque.updated_at,
                        variacao_produto.produto_id, 
                        variacao_produto.cor_id, 
                        variacao_produto.tamanho_id, 
                        variacao_produto.codigo_barras, 
                        variacao_produto.codigo_produto,
                        preco_produto.id as preco_produto_id, 
                        preco_produto.lista_preco_id, 
                        ROUND(preco_produto.valor, 2) AS valor, 
                        preco_produto.markup, 
                        ROUND(preco_produto.valor_custo, 2) AS valor_custo,
                        produto.tipo_produto_id, 
                        produto.marca_id, 
                        produto.categoria_id, 
                        produto.fornecedor_id, 
                        produto.unidade_id, 
                        produto.origem_id, 
                        produto.colecao_id, 
                        produto.cst_icms_id,
                        produto.sub_categoria_id, 
                        produto.nome, 
                        produto.id as produto_id, 
                        produto.ncm, 
                        produto.classe_imposto,
                        cor.nome as cor_nome, 
                        tamanho.nome as tamanho_nome, 
                        categoria.nome as categoria_nome, 
                        unidade.sigla as unidade_sigla
                    FROM estoque
                    LEFT JOIN variacao_produto ON variacao_produto.id = estoque.variacao_produto_id
                    LEFT JOIN preco_produto ON preco_produto.variacao_produto_id = estoque.variacao_produto_id
                    LEFT JOIN produto ON produto.id = variacao_produto.produto_id
                    LEFT JOIN cor ON cor.id = variacao_produto.cor_id
                    LEFT JOIN tamanho ON tamanho.id = variacao_produto.tamanho_id
                    LEFT JOIN categoria ON categoria.id = produto.categoria_id
                    LEFT JOIN unidade ON unidade.id = produto.unidade_id
                    WHERE estoque.deleted_at IS NULL 
                    AND estoque.empresa_id = ? 
                    AND (
                        produto.nome LIKE ?
                        OR variacao_produto.codigo_barras LIKE ? 
                        OR variacao_produto.codigo_produto = ? 
                        OR estoque.id = ?
                    )`;

    const params = [
        usuarioLogado.empresa_id,
        `%${nomeCodigoBarras}%`,
        `%${nomeCodigoBarras}%`,
        `${nomeCodigoBarras}`,
        nomeCodigoBarras
    ]

    const estoque = await connection.execute(query, params);

    return estoque;
};

const getEstoqueById = async (idEstoque, usuarioLogado) => {
    const query = `SELECT 
	                    estoque.id as estoque_id, estoque.quantidade, estoque.updated_at, estoque.quantidade_min, estoque.quantidade_max, estoque.validade, estoque.localizacao, 
	                    variacao_produto.id as variacao_produto_id, variacao_produto.cor_id, variacao_produto.tamanho_id, variacao_produto.codigo_barras, 
	                    preco_produto.valor, preco_produto.valor_custo, 
	                    produto.marca_id, produto.nome, produto.id as produto_id, produto.ncm, produto.classe_imposto, produto.unidade_id, unidade.sigla as unidade_sigla, 
                        cor.nome as cor_nome, 
                        tamanho.nome as tamanho_nome 
                    FROM estoque
                    LEFT JOIN variacao_produto ON variacao_produto.id = estoque.variacao_produto_id
                    LEFT JOIN preco_produto ON preco_produto.variacao_produto_id = estoque.variacao_produto_id
                    LEFT JOIN produto ON produto.id = variacao_produto.produto_id
                    LEFT JOIN cor ON cor.id = variacao_produto.cor_id
                    LEFT JOIN tamanho ON tamanho.id = variacao_produto.tamanho_id
                    LEFT JOIN unidade ON unidade.id = produto.unidade_id
                    WHERE estoque.id = ? AND estoque.empresa_id = ?;`;

    const estoque = await connection.execute(query, [idEstoque, usuarioLogado.empresa_id]);

    return estoque;
};

const createEstoque = async (estoque, usuarioLogado) => {
    const { variacaoProdutoId, validade, localizacao, quantidade, quantidadeMin, quantidadeMax } = estoque;

    const [variacaoProduto] = await connection.execute('SELECT * FROM variacao_produto WHERE id = ? AND empresa_id = ?', [variacaoProdutoId, usuarioLogado.empresa_id]);

    if (variacaoProduto.length == 0) {
        return { erro: "Não existe essa variacao produto" };
    } else {
        const dateUTC = new Date(Date.now()).toUTCString();

        const query =
            'INSERT INTO estoque(variacao_produto_id, validade, localizacao, quantidade, quantidade_min, quantidade_max, created_at, empresa_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

        const [createdEstoque] = await connection.execute(query, [variacaoProdutoId, validade, localizacao, quantidade, quantidadeMin, quantidadeMax, dateUTC, usuarioLogado.empresa_id]);

        return { insertId: createdEstoque.insertId };
    }
}

const deleteEstoque = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedEstoque] = await connection.execute('UPDATE estoque SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedEstoque;
}

const updateEstoque = async (id, estoque, usuarioLogado) => {

    console.log(estoque)

    const { variacaoProdutoId, validade, localizacao, quantidade, quantidadeMin, quantidadeMax } = estoque;

    const [oldData] = await connection.execute('SELECT * FROM estoque WHERE id = ? AND empresa_id = ?', [id, usuarioLogado.empresa_id])

    const [variacaoProduto] = await connection.execute('SELECT * FROM variacao_produto WHERE id = ? AND empresa_id = ?', [variacaoProdutoId, usuarioLogado.empresa_id]);

    if (variacaoProduto.length == 0) {

        return { erro: "Não existe essa variacao produto" };

    } else {

        const dateUTC = new Date(Date.now()).toUTCString();

        const query =
            'UPDATE estoque SET variacao_produto_id = ?, validade = ?, localizacao = ?, quantidade = ?, quantidade_min = ?, quantidade_max = ?, updated_at = ?, empresa_id = ?, deleted_at = null WHERE id = ?';

        try {

            const [updatedEstoque] = await connection.execute(query, [variacaoProdutoId, validade, localizacao, quantidade, quantidadeMin, quantidadeMax, dateUTC, usuarioLogado.empresa_id, id]);

            await registrarLog(usuarioLogado.id, "estoque", "updateEstoque", oldData[0], estoque)

            return updatedEstoque;

        } catch (error) {
            throw new Error("Erro ao tentar atualizar o estoque de um produto")
        }

    }

}

const registrarLog = async (userId, table, action, oldData, newData) => {
    await connection.execute(
        'INSERT INTO sistema_logs (usuario_id, tabela, acao, data_hora, dados_antigos, dados_novos) VALUES (?, ?, ?, NOW(), ?, ?)',
        [userId, table, action, JSON.stringify(oldData), JSON.stringify(newData)]
    );
}

module.exports = {
    totalEstoque,
    getAll,
    getPage,
    getEstoqueCompleto,
    getEstoqueCompletoTopDez,
    getEstoqueByNomeCodigoBarras,
    getEstoqueById,
    getEstoqueRelatorio,
    createEstoque,
    deleteEstoque,
    updateEstoque
};