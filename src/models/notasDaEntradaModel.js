const connection = require("./connection");

const createNotaEntrada = async (dados, usuario) => {

    const { valorNf, entradaId, numeroNf, dataEmissao, tipoPag, cnpjTransp, nomeTransp, valorFrete } = dados

    const date = new Date().toUTCString()

    const query = `
        INSERT INTO 
            nota_fiscal_entrada(
                valor_nf, 
                entrada_id, 
                numero_nf, 
                data_emissao, 
                tipo_pag, 
                cnpj_transp, 
                nome_transp, 
                valor_frete, 
                empresa_id, 
                created_at
            )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        valorNf,
        entradaId,
        numeroNf,
        dataEmissao,
        tipoPag,
        cnpjTransp,
        nomeTransp,
        valorFrete,
        usuario.empresa_id,
        date
    ];

    try {

        const [inserir] = await connection.execute(query, params)

        return { insertId: inserir.insertId }

    } catch (error) {
        console.error('Erro ao cadastrar nota de entrada', error)
        throw new Error('Erro cadastrar nota fiscal de entrada')
    }

}

const getById = async (id, usuario) => {

    const query = `
        SELECT * FROM nota_fiscal_entrada
        WHERE deleted_at IS NULL
        AND empresa_id = ?
        AND entrada_id = ?
    `;
    const params = [
        usuario.empresa_id,
        id
    ];

    try {
        const [notadaentrada] = await connection.execute(query, params)
        return notadaentrada
    } catch (error) {
        console.error("Erro ao buscar dados", error)
        throw new Error('Erro ao buscar dados')
    }
}

module.exports = {
    createNotaEntrada,
    getById
}