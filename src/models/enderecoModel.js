const connection = require('./connection');

const getAll = async (usuarioLogado) => {

    const endereco = await connection.execute('SELECT * FROM endereco WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return endereco;

};

const getByCliente = async (usuarioLogado, idCliente) => {

    const endereco = await connection.execute('SELECT * FROM endereco WHERE deleted_at IS NULL AND empresa_id = ? AND cliente_id = ?', [usuarioLogado.empresa_id, idCliente]);

    return endereco;

};

const getByFornecedor = async (usuarioLogado, idFornecedor) => {

    const endereco = await connection.execute('SELECT * FROM endereco WHERE deleted_at IS NULL AND empresa_id = ? AND fornecedor_id = ?', [usuarioLogado.empresa_id, idFornecedor]);

    return endereco;

};

const getByVendedor = async (usuarioLogado, idVendedor) => {

    const endereco = await connection.execute('SELECT * FROM endereco WHERE deleted_at IS NULL AND empresa_id = ? AND vendedor_id = ?', [usuarioLogado.empresa_id, idVendedor])

    return endereco

}

const createEndereco = async (endereco, usuarioLogado) => {

    console.log(endereco)

    const { fornecedorId, clienteId, vendedorId, rua, numero, bairro, cep, cidade, uf, complemento } = endereco;

    if (clienteId != null) {
        const [cliente] = await connection.execute('SELECT * FROM cliente WHERE id = ? AND empresa_id = ?', [clienteId, usuarioLogado.empresa_id]);

        if (cliente.length == 0) {
            return { erro: "Não existe esse Cliente" };
        }
    }

    if (fornecedorId != null) {
        const [fornecedor] = await connection.execute('SELECT * FROM fornecedor WHERE id = ? AND empresa_id = ?', [fornecedorId, usuarioLogado.empresa_id]);

        if (fornecedor.length == 0) {
            return { erro: "Não existe esse fornecedor" };
        }
    }

    if (vendedorId != null) {
        const [fornecedor] = await connection.execute('SELECT * FROM vendedor WHERE id = ? AND empresa_id = ?', [fornecedorId, usuarioLogado.empresa_id]);

        if (fornecedor.length == 0) {
            return { erro: "Não existe esse vendedor" };
        }
    }

    const dateUTC = new Date(Date.now()).toUTCString();

    const query =
        'INSERT INTO endereco(fornecedor_id, cliente_id, vendedor_id, rua, numero, bairro, cep, cidade, uf, created_at, empresa_id, complemento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    try {

        const [createdEndereco] = await connection.execute(query, [fornecedorId, clienteId, vendedorId, rua, numero, bairro, cep, cidade, uf, dateUTC, usuarioLogado.empresa_id, complemento]);

        return { insertId: createdEndereco.insertId };

    } catch (error) {
        throw new Error("Erro ao tentar criar um novo endereço de fornecedor")
    }

}

const deleteEndereco = async (id) => {

    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedEndereco] = await connection.execute('UPDATE endereco SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedEndereco;

}

const updateEndereco = async (id, endereco) => {

    const { clienteId, fornecedorId, vendedorId, rua, numero, bairro, cep, cidade, uf, complemento } = endereco;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'UPDATE endereco SET rua = ?, numero = ?, bairro = ?, cep = ?, cidade = ?, uf = ?, updated_at = ?, complemento = ? WHERE id = ? OR cliente_id = ? OR vendedor_id = ? OR fornecedor_id = ?';

    const params = [
        rua,
        numero,
        bairro,
        cep,
        cidade,
        uf,
        dateUTC,
        complemento,
        id,
        clienteId || null,
        vendedorId || null,
        fornecedorId || null
    ]

    try {

        const [updatedEndereco] = await connection.execute(query, params);

        return updatedEndereco;

    } catch (error) {
        return (error)
    }

}

module.exports = {
    getAll,
    getByCliente,
    getByFornecedor,
    getByVendedor,
    createEndereco,
    deleteEndereco,
    updateEndereco
};