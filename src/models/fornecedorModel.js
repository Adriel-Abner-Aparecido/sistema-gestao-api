const connection = require('./connection');

const getAll = async (usuarioLogado) => {

    const fornecedor = await connection.execute('SELECT * FROM fornecedor WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return fornecedor;

};

const getPerPage = async (usuarioLogado, page, limitItems) => {

    let fornecedores
    let limit

    const [lines] = await connection.execute(`
        SELECT *
        FROM fornecedor
        WHERE deleted_at IS NULL
        AND empresa_id = ?
    `, [usuarioLogado.empresa_id])

    const query = `
        SELECT 
            f.id,
            f.nome,
            f.telefone,
            f.celular,
            f.email,
            f.tipo_pessoa,
            f.cnpj_cpf,
            f.fantasia,
            f.observacao,
            f.inscricao_estadual,
            e.id as endereco_id,
            e.rua,
            e.fornecedor_id,
            e.numero,
            e.bairro,
            e.cidade,
            e.cep,
            e.complemento,
            e.uf
        FROM fornecedor AS f
        LEFT JOIN endereco AS e ON e.fornecedor_id = f.id
        WHERE f.deleted_at IS NULL
        AND f.empresa_id = ?
        LIMIT ?, ?
    `

    limit = (page > 1) ? (page - 1) * limitItems : 0;

    [fornecedores] = await connection.execute(query, [usuarioLogado.empresa_id, `${limit}`, limitItems])

    return {
        total_fornecedores: lines.length,
        fornecedores
    }

}

const getByNome = async (nomecnpj, usuarioLogado) => {

    const query = `
    SELECT * 
    FROM fornecedor 
    WHERE deleted_at IS NULL 
    AND (nome LIKE ? OR cnpj_cpf LIKE ?) 
    AND empresa_id = ?`

    const params = [`%${nomecnpj}%`, `%${nomecnpj}%`, usuarioLogado.empresa_id]

    const fornecedor = await connection.execute(query, params);

    return fornecedor;

};

const getFornecedor = async (idFornecedor, usuarioLogado) => {

    const fornecedor = await connection.execute(`SELECT * FROM fornecedor WHERE deleted_at IS NULL AND id = ? AND empresa_id = ?`, [idFornecedor, usuarioLogado.empresa_id]);

    return fornecedor;

};

const createFornecedor = async (fornecedor, usuarioLogado) => {

    const { nome, telefone, celular, email, tipoPessoa, cnpjCpf, inscricaoEstadual, fantasia, observacao } = fornecedor;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO fornecedor(nome, telefone, celular, email, tipo_pessoa, cnpj_cpf, inscricao_estadual, fantasia, observacao, created_at, empresa_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const params = [
        nome,
        telefone,
        celular,
        email,
        tipoPessoa,
        cnpjCpf,
        inscricaoEstadual || null,
        fantasia,
        observacao,
        dateUTC,
        usuarioLogado.empresa_id
    ]

    try {

        const [createdFornecedor] = await connection.execute(query, params);

        return { insertId: createdFornecedor.insertId };

    } catch (error) {
        throw new Error("Erro ao tentar criar um novo fornecedor")
    }

}

const deleteFornecedor = async (id) => {

    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedFornecedor] = await connection.execute('UPDATE fornecedor SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedFornecedor;

}

const updateFornecedor = async (id, fornecedor, usuarioLogado) => {

    const { nome, telefone, celular, email, tipoPessoa, cnpjCpf, inscricaoEstadual, fantasia, observacao } = fornecedor;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'UPDATE fornecedor SET nome = ?, telefone = ?, celular = ?, email = ?, tipo_pessoa = ?, cnpj_cpf = ?, inscricao_estadual = ?, fantasia = ?, observacao = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const params = [
        nome,
        telefone,
        celular,
        email,
        tipoPessoa,
        cnpjCpf,
        inscricaoEstadual,
        fantasia,
        observacao,
        dateUTC,
        usuarioLogado.empresa_id,
        id
    ]

    try {

        const [updatedFornecedor] = await connection.execute(query, params);

        return updatedFornecedor;

    } catch (error) {
        throw new Error(error)
    }

}

module.exports = {
    getAll,
    getPerPage,
    getByNome,
    getFornecedor,
    createFornecedor,
    deleteFornecedor,
    updateFornecedor
};