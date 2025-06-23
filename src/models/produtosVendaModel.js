const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const produtosDaVenda = await connection.execute('SELECT * FROM produtos_da_venda WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return produtosDaVenda;
};

const getByVenda = async (idVenda, usuarioLogado) => {
    const produtosDaVenda = await connection.execute('SELECT * FROM applojaweb.produtos_da_venda where deleted_at IS NULL AND venda_id = ? AND empresa_id = ?', [idVenda, usuarioLogado.empresa_id]);

    return produtosDaVenda;
};

const getTopCincoProdutos = async (usuarioLogado) => {

    const query = `SELECT 
                        produto.nome AS produto, 
                        SUM(produtos_da_venda.quantidade) AS quantidade_vendida
                    FROM 
                        produtos_da_venda 
                        JOIN venda ON produtos_da_venda.venda_id = venda.id
                        JOIN estoque ON produtos_da_venda.estoque_id = estoque.id
                        JOIN variacao_produto ON estoque.variacao_produto_id = variacao_produto.id
                        JOIN produto ON variacao_produto.produto_id = produto.id
                    WHERE 
                        venda.deleted_at IS NULL AND
                        venda.status != "Cancelado" AND
                        venda.status != "Aguardando" AND
                        produtos_da_venda.deleted_at IS NULL AND
                        estoque.deleted_at IS NULL AND
                        variacao_produto.deleted_at IS NULL AND
                        produtos_da_venda.empresa_id = ?
                        GROUP BY 
                        produto.nome
                    ORDER BY 
                        quantidade_vendida DESC
                    LIMIT 5;`;

    const produtosDaVenda = await connection.execute(query, [usuarioLogado.empresa_id]);

    return produtosDaVenda;
};

const createProdutosDaVenda = async (produtosDaVenda, usuarioLogado) => {
    const { vendaId, estoqueId, valor, quantidade } = produtosDaVenda;

    const [venda] = await connection.execute('SELECT * FROM venda WHERE id = ? AND empresa_id = ?', [vendaId, usuarioLogado.empresa_id]);
    const [estoque] = await connection.execute('SELECT * FROM estoque WHERE id = ? AND empresa_id = ?', [estoqueId, usuarioLogado.empresa_id]);

    if (venda.length == 0) {
        return { erro: "Não existe essa venda" };
    } else if (estoque.length == 0) {
        return { erro: "Não existe esse estoque" };
    } else {
        const dateUTC = new Date(Date.now()).toUTCString();

        const query =
            'INSERT INTO produtos_da_venda(venda_id, estoque_id, valor, quantidade, created_at, empresa_id) VALUES (?, ?, ?, ?, ?, ?)';

        const [createdProdutosDaVenda] = await connection.execute(query, [vendaId, estoqueId, valor, quantidade, dateUTC, usuarioLogado.empresa_id]);

        return { insertId: createdProdutosDaVenda.insertId };
    }
}

const deleteProdutosDaVenda = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedProdutosDaVenda] = await connection.execute('UPDATE produtos_da_venda SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedProdutosDaVenda;
}

const updateProdutosDaVenda = async (id, produtosDaVenda, usuarioLogado) => {
    const { vendaId, estoqueId, valor, quantidade } = produtosDaVenda;

    const [venda] = await connection.execute('SELECT * FROM venda WHERE id = ? AND empresa_id = ?', [vendaId, usuarioLogado.empresa_id]);
    const [estoque] = await connection.execute('SELECT * FROM estoque WHERE id = ? AND empresa_id = ?', [estoqueId, usuarioLogado.empresa_id]);

    if (venda.length == 0) {
        return { erro: "Não existe essa venda" };
    } else if (estoque.length == 0) {
        return { erro: "Não existe esse estoque" };
    } else {
        const dateUTC = new Date(Date.now()).toUTCString();

        const query =
            'UPDATE produtos_da_venda SET venda_id = ?, estoque_id = ?, valor = ?, quantidade = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

        const [updatedProdutosDaVenda] = await connection.execute(query, [vendaId, estoqueId, valor, quantidade, dateUTC, usuarioLogado.empresa_id, id]);
        return updatedProdutosDaVenda;
    }
}

module.exports = {
    getAll,
    getByVenda,
    getTopCincoProdutos,
    createProdutosDaVenda,
    deleteProdutosDaVenda,
    updateProdutosDaVenda
};