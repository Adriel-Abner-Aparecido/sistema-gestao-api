const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const precoProduto = await connection.execute('SELECT * FROM preco_produto WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return precoProduto;
};

const createPrecoProduto = async (precoProduto, usuarioLogado) => {

    console.log(precoProduto)

    const { variacaoProdutoId, listaPrecoId, valor, markup, valorCusto } = precoProduto;

    const [variacaoProduto] = await connection.execute('SELECT * FROM variacao_produto WHERE id = ? AND empresa_id = ?', [variacaoProdutoId, usuarioLogado.empresa_id]);

    const [listaPreco] = await connection.execute('SELECT * FROM lista_preco WHERE id = ?', [listaPrecoId]);

    if (variacaoProduto.length == 0) {
        return { erro: "Não existe essa variacao produto" };
    }

    if (listaPreco.length == 0) {
        return { erro: "Não existe essa lista de preço" };
    }

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = `
            INSERT INTO 
            preco_produto
                (
                    variacao_produto_id, 
                    lista_preco_id, valor, 
                    valor_custo, 
                    markup, 
                    created_at, 
                    empresa_id
                ) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

    const params = [
        variacaoProdutoId,
        listaPrecoId,
        parseFloat(parseFloat(valor).toFixed(2)),
        parseFloat(parseFloat(valorCusto).toFixed(2)),
        markup,
        dateUTC,
        usuarioLogado.empresa_id
    ]

    const [createdPrecoProduto] = await connection.execute(query, params);

    return { insertId: createdPrecoProduto.insertId };

}

const deletePrecoProduto = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedPrecoProduto] = await connection.execute('UPDATE preco_produto SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedPrecoProduto;
}

const updatePrecoProduto = async (id, precoProduto, usuarioLogado) => {

    console.log(precoProduto)

    const { variacaoProdutoId, listaPrecoId, valor, markup, valorCusto } = precoProduto;

    const [variacaoProduto] = await connection.execute('SELECT * FROM variacao_produto WHERE id = ? AND empresa_id = ?', [variacaoProdutoId, usuarioLogado.empresa_id]);

    const [listaPreco] = await connection.execute('SELECT * FROM lista_preco WHERE id = ?', [listaPrecoId]);

    if (variacaoProduto.length == 0) {
        return { erro: "Não existe essa variacao produto" };
    }

    if (listaPreco.length == 0) {
        return { erro: "Não existe essa lista de preço" };
    }

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = `
            UPDATE 
                preco_produto 
            SET 
                variacao_produto_id = ?, 
                lista_preco_id = ?, 
                valor = ?, 
                markup = ?, 
                updated_at = ?, 
                valor_custo = ?, 
                empresa_id = ?,
                deleted_at = null
                WHERE id = ?
            `;

    const params = [
        variacaoProdutoId,
        listaPrecoId,
        parseFloat(parseFloat(valor).toFixed(2)),
        markup,
        dateUTC,
        parseFloat(parseFloat(valorCusto).toFixed(2)),
        usuarioLogado.empresa_id,
        id
    ]

    try {

        const [updatedPrecoProduto] = await connection.execute(query, params);

        return updatedPrecoProduto;

    } catch (error) {
        throw new Error("Erro ao tentar atualizar um preço de produto")
    }

}

module.exports = {
    getAll,
    createPrecoProduto,
    deletePrecoProduto,
    updatePrecoProduto
};