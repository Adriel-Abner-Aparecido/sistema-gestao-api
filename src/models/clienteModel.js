const connection = require('./connection');

const totalClientes = async (usuario) => {

    const query = `
        SELECT
            COUNT(id) as total_clientes,
            COUNT(
                IF(
                    MONTH(STR_TO_DATE(created_at, '%a, %d %b %Y %H:%i:%s GMT')) = MONTH(CURRENT_DATE())
                    AND YEAR(STR_TO_DATE(created_at, '%a, %d %b %Y %H:%i:%s GMT')) = YEAR(CURRENT_DATE()),
                    1, 
                    NULL
                )
            ) AS novos_clientes
        FROM
            cliente
        WHERE
            deleted_at IS NULL
        AND
            empresa_id = ?
    `;

    const params = [usuario.empresa_id]

    const totalclientes = connection.execute(query, params)

    return totalclientes

}

const getAll = async (usuarioLogado) => {

    const cliente = await connection.execute('SELECT * FROM cliente WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return cliente;
};

const getTopClientes = async (usuarioLogado) => {
    const query = `SELECT 
                        c.nome AS nome,
                        c.id AS id,
                        COUNT(v.id) AS quantidade_de_vendas
                    FROM 
                        cliente c
                    INNER JOIN 
                        venda v ON c.id = v.cliente_id
                    WHERE 
                        c.empresa_id = ?
                    AND
                        v.deleted_at IS NULL
                    AND
                        v.status != "Cancelado"
                    AND
                        v.status != "Aguardando"
                    GROUP BY 
                        c.nome,
                        c.id
                    ORDER BY 
                        quantidade_de_vendas DESC
                    LIMIT 5;`;

    const cliente = await connection.execute(query, [usuarioLogado.empresa_id]);

    return cliente;
};

const getPage = async (usuarioLogado, page, limitItems) => {
    let limit;

    const query = `
        SELECT 
            c.id,
            c.nome,
            c.telefone,
            c.celular,
            c.email,
            c.tipo_pessoa,
            c.cnpj_cpf,
            c.inscricao_estadual,
            c.fantasia,
            c.data_nascimento,
            c.observacao,
            e.id AS endereco_id,
            e.rua,
            e.bairro,
            e.cliente_id,
            e.cep,
            e.cidade,
            e.complemento,
            e.uf, 
            e.numero
        FROM cliente AS c
        LEFT JOIN endereco AS e ON e.cliente_id = c.id 
        WHERE c.deleted_at IS NULL 
        AND c.empresa_id = ? 
        LIMIT ?, ?
    `;

    page > 1 ? limit = (page - 1) * limitItems : limit = 0;

    const params = [
        usuarioLogado.empresa_id,
        `${limit}`,
        limitItems
    ]


    const [linhas] = await connection.execute('SELECT * FROM cliente WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    const [clientes] = await connection.execute(query, params);


    return {
        total_clientes: linhas.length,
        clientes
    };
};

const getById = async (idCliente, usuarioLogado) => {
    const cliente = await connection.execute('SELECT * FROM cliente WHERE deleted_at IS NULL AND id = ? AND empresa_id = ?', [idCliente, usuarioLogado.empresa_id]);

    return cliente;
};

const getByNome = async (nomecpf, usuarioLogado) => {
    const query = `
        SELECT 
            cliente.id,
            cliente.nome,
            cliente.telefone,
            cliente.celular,
            cliente.email,
            cliente.tipo_pessoa,
            cliente.cnpj_cpf,
            cliente.inscricao_estadual,
            cliente.fantasia,
            cliente.observacao,
            cliente.data_nascimento,
            endereco.rua,
            endereco.numero,
            endereco.bairro,
            endereco.cep,
            endereco.cidade,
            endereco.uf,
            endereco.complemento
        FROM cliente
        LEFT JOIN endereco ON cliente_id = cliente.id
        WHERE cliente.deleted_at IS NULL 
        AND (TRIM(cliente.nome) LIKE ? 
        OR cliente.cnpj_cpf LIKE ?
        OR cliente.celular LIKE ?) 
        AND cliente.empresa_id = ?;
    `;

    const params = [
        `%${nomecpf}%`,
        `%${nomecpf}%`,
        `%${nomecpf}%`,
        usuarioLogado.empresa_id
    ];

    const [cliente] = await connection.execute(query, params);

    return cliente;
};

const createCliente = async (cliente, usuarioLogado) => {

    const { nome, telefone, celular, email, tipoPessoa, cnpjCpf, fantasia, observacao, dataNascimento, inscricaoEstadual } = cliente;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO cliente(nome, telefone, celular, email, tipo_pessoa, cnpj_cpf, fantasia, observacao, data_nascimento, created_at, empresa_id, inscricao_estadual) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const [createdCliente] = await connection.execute(query, [nome, telefone, celular, email, tipoPessoa, cnpjCpf, fantasia, observacao, dataNascimento, dateUTC, usuarioLogado.empresa_id, inscricaoEstadual]);

    return { insertId: createdCliente.insertId };
}

const deleteCliente = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedCliente] = await connection.execute('UPDATE cliente SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedCliente;
}

const updateCliente = async (id, cliente, usuarioLogado) => {
    const { nome, telefone, celular, email, tipoPessoa, cnpjCpf, fantasia, observacao, dataNascimento, inscricaoEstadual } = cliente;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query =
        'UPDATE cliente SET nome = ?, telefone = ?, celular = ?, email = ?, tipo_pessoa = ?, cnpj_cpf = ?, inscricao_estadual = ?, fantasia = ?, observacao = ?, data_nascimento = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedCliente] = await connection.execute(query, [nome, telefone, celular, email, tipoPessoa, cnpjCpf, inscricaoEstadual, fantasia, observacao, dataNascimento, dateUTC, usuarioLogado.empresa_id, id]);
    return updatedCliente;
}

module.exports = {
    totalClientes,
    getAll,
    getPage,
    getById,
    getByNome,
    getTopClientes,
    createCliente,
    deleteCliente,
    updateCliente
};