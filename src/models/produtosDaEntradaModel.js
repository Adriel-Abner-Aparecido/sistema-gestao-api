const connection = require("./connection")

const getById = async (id) => {

    try {
        const query = `SELECT 
            produtos_entrada.id,
            produtos_entrada.entrada_id, 
            produtos_entrada.produto_id,
            produtos_entrada.valor, 
            produtos_entrada.valor_custo, 
            produtos_entrada.markup, 
            produtos_entrada.quantidade, 
            produtos_entrada.valor_total,
            produtos_entrada.variacao_id,
            estoque.id as estoqueId,
            produto.nome,
            produto.ncm,
            variacao_produto.codigo_barras,
            variacao_produto.codigo_produto
        FROM produtos_entrada
        LEFT JOIN produto ON produto.id = produtos_entrada.produto_id
        LEFT JOIN variacao_produto ON variacao_produto.id = produtos_entrada.variacao_id
        LEFT JOIN estoque ON variacao_produto_id = produtos_entrada.variacao_id
        WHERE produtos_entrada.deleted_at IS NULL 
        AND produtos_entrada.entrada_id = ?`;

        const [produto_entrada] = await connection.execute(query, [id]);

        //console.log('Resultado do banco de dados:', produto_entrada); // Adicione este log
        return produto_entrada;

    } catch (error) {
        console.error("Erro na comunicação com o banco de dados", error);
        throw error;
    }

};

const createProdutosEntrada = async (produto, usuario) => {

    console.log(produto)

    const { entradaId, produtoId, valor, valorCusto, markup, quantidade, valorTotal, variacaoId } = produto

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = `
        INSERT INTO 
            produtos_entrada(
                entrada_id, 
                produto_id, 
                valor_custo, 
                valor, 
                markup, 
                quantidade, 
                valor_total, 
                created_at, 
                variacao_id, 
                empresa_id
            ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        entradaId,
        produtoId,
        valorCusto,
        valor,
        markup,
        quantidade,
        valorTotal,
        dateUTC,
        variacaoId,
        usuario.empresa_id
    ]

    try {

        const produtoEntrada = await connection.execute(query, params)

        return produtoEntrada

    } catch (error) {
        throw new Error("Erro ao tentar cadastrar um produto da entrada")
    }

}

module.exports = {
    getById,
    createProdutosEntrada
}