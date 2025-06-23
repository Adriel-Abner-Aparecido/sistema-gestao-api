const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const variacaoProduto = await connection.execute('SELECT * FROM variacao_produto WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return variacaoProduto;
};

const generateUniqueProductCode = async (usuario) => {

    let newCode;
    let exists;

    const query = `
        SELECT
            id
        FROM
            variacao_produto
        WHERE
            codigo_produto = ?
        AND
            empresa_id = ?
        AND
            deleted_at IS NULL
        LIMIT 1
    `

    do {
        newCode = Math.floor(Math.random() * 90000000) + 10000000;
        const [rows] = await connection.execute(query, [newCode, usuario.empresa_id])
        exists = rows.length > 0
    } while (exists);

    return newCode.toString()

}

const createVariacaoProduto = async (variacaoProduto, usuarioLogado) => {

    const { produtoId, corId, tamanhoId, codigoBarras, codigoProduto, descricao } = variacaoProduto;

    const [produto] = await connection.execute('SELECT * FROM produto WHERE id = ? AND empresa_id = ?', [produtoId, usuarioLogado.empresa_id]);

    // const [variacao] = codigoBarras !== "" ? await connection.execute('SELECT * FROM variacao_produto WHERE codigo_barras = ? AND empresa_id = ?', [codigoBarras, usuarioLogado.empresa_id]) : []

    // if (variacao.length > 0) {
    //     return { erro: "Código de barras ja cadastrado em outra variação." }
    // }

    if (produto.length == 0) {
        return { erro: "Não existe esse Produto" };
    } else {
        const dateUTC = new Date(Date.now()).toUTCString();

        const query =
            'INSERT INTO variacao_produto(produto_id, cor_id, tamanho_id, codigo_barras, codigo_produto, descricao, created_at, empresa_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

        const [createdVariacaoProduto] = await connection.execute(query, [produtoId, corId, tamanhoId, codigoBarras, codigoProduto, descricao, dateUTC, usuarioLogado.empresa_id]);

        return { insertId: createdVariacaoProduto.insertId };
    }
}

const deleteVariacaoProduto = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedVariacaoProduto] = await connection.execute('UPDATE variacao_produto SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedVariacaoProduto;
}

const updateVariacaoProduto = async (id, variacaoProduto, usuarioLogado) => {

    console.log(variacaoProduto)

    const { produtoId, corId, tamanhoId, codigoBarras, codigoProduto, descricao } = variacaoProduto;

    const [produto] = await connection.execute('SELECT * FROM produto WHERE id = ? AND empresa_id = ?', [produtoId, usuarioLogado.empresa_id]);

    if (produto.length == 0) {
        return { erro: "Não existe esse Produto" };
    } else {
        const dateUTC = new Date(Date.now()).toUTCString();

        const query =
            'UPDATE variacao_produto SET produto_id = ?, cor_id = ?, tamanho_id = ?, codigo_barras = ?, codigo_produto = ?, descricao = ?, updated_at = ?, empresa_id = ?, deleted_at = null WHERE id = ?';

        try {

            const [updatedVariacaoProduto] = await connection.execute(query, [produtoId, corId, tamanhoId, codigoBarras, codigoProduto, descricao, dateUTC, usuarioLogado.empresa_id, id]);

            return updatedVariacaoProduto;

        } catch (error) {
            throw new Error("Erro ao tentar atualizar um produto")
        }

    }
}

module.exports = {
    generateUniqueProductCode,
    getAll,
    createVariacaoProduto,
    deleteVariacaoProduto,
    updateVariacaoProduto
};