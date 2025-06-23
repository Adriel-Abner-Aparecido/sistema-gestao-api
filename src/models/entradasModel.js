const connection = require('./connection');

const createEntrada = async (req, usuario) => {

    const { fornecedorId, motivo, numeroNota, valorNota, observacao } = req
    const dateUTC = new Date(Date.now()).toUTCString();

    const query = `
        INSERT INTO 
            entradas(
                fornecedor_id, 
                motivo, 
                numero_nota_fiscal, 
                valor_nota, 
                observacao, 
                empresa_id, 
                created_at
            ) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        fornecedorId,
        motivo ?? "Sem motivo",
        numeroNota,
        valorNota ?? 0,
        observacao,
        usuario.empresa_id,
        dateUTC
    ]

    try {

        const [create] = await connection.execute(query, params)

        return { insertId: create.insertId }

    } catch (error) {
        throw new Error("Erro ao tentar cadastrar entrada")
    }

}

const getEntradaPage = async (usuario, page, limitItems) => {
    let entradas
    let limit

    const [linhas] = await connection.execute('SELECT * FROM entradas WHERE deleted_at IS NULL AND empresa_id = ?', [usuario.empresa_id])


    limit = (page > 1) ? (page - 1) * limitItems : 0;

    const query = `
    SELECT 
        entradas.id, 
        entradas.fornecedor_id, 
        fornecedor.nome, 
        entradas.motivo, 
        entradas.numero_nota_fiscal, 
        IFNULL(ROUND(entradas.valor_nota, 2), 0) AS valor_nota, 
        entradas.observacao, 
        entradas.created_at, 
        entradas.updated_at, 
        entradas.deleted_at 
        FROM entradas 
        LEFT JOIN fornecedor ON entradas.fornecedor_id = fornecedor.id 
        WHERE entradas.deleted_at IS NULL 
        AND entradas.empresa_id = ? 
        ORDER BY entradas.id DESC LIMIT ?, ?`;


    [entradas] = await connection.execute(query, [usuario.empresa_id, `${limit}`, limitItems])


    return {
        total_entradas: linhas.length,
        entradas
    }

}

const deleteEntrada = async (id) => {

    if (!id) {
        throw new Error('O ID é obrigatório para deletar a entrada.');
    }

    const date = new Date().toISOString();

    const queryEntrada = `
        UPDATE entradas 
        SET deleted_at = ?
        WHERE id = ?
    `;
    const paramsEntrada = [date, id];

    try {
        const [deletaentrada] = await connection.execute(queryEntrada, paramsEntrada);

        if (deletaentrada.affectedRows === 1) {
            // Atualiza nota fiscal associada
            const queryNotaEntrada = `
                UPDATE nota_fiscal_entrada
                SET deleted_at = ?
                WHERE entrada_id = ?
            `;
            const paramsNotaEntrada = [date, id];
            await connection.execute(queryNotaEntrada, paramsNotaEntrada);

            // Busca produtos associados à entrada
            const selectQueryProdutosEntrada = `
                SELECT id
                FROM produtos_entrada
                WHERE entrada_id = ?
            `;
            const selectParamsProdutosEntrada = [id];
            const [produtosEntrada] = await connection.execute(
                selectQueryProdutosEntrada,
                selectParamsProdutosEntrada
            );

            // Atualiza cada produto associado
            for (const produto of produtosEntrada) {
                const queryProdutosEntrada = `
                    UPDATE produtos_entrada 
                    SET deleted_at = ?
                    WHERE id = ?
                `;
                const paramsProdutosEntrada = [date, produto.id];
                await connection.execute(queryProdutosEntrada, paramsProdutosEntrada);
            }
        }
    } catch (error) {
        console.error('Erro ao deletar entrada:', error.message);
        throw new Error('Erro ao deletar entrada.');
    }

};


module.exports = {
    createEntrada,
    getEntradaPage,
    deleteEntrada
}