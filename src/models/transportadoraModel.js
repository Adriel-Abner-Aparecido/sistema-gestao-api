const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const transportadora = await connection.execute('SELECT * FROM transportadora WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);

    return transportadora;
};

const createTransportadora = async (transportadora, usuarioLogado) => {
    const { nome, telefone, celular, email, tipoPessoa, cnpjCpf, fantasia, observacao } = transportadora;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query =
        'INSERT INTO transportadora(nome, telefone, celular, email, tipo_pessoa, cnpj_cpf, fantasia, observacao, created_at, empresa_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const [createdTransportadora] = await connection.execute(query, [nome, telefone, celular, email, tipoPessoa, cnpjCpf, fantasia, observacao, dateUTC, usuarioLogado.empresa_id]);

    return { insertId: createdTransportadora.insertId };
}

const deleteTransportadora = async (id) => {
    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedTransportadora] = await connection.execute('UPDATE transportadora SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedTransportadora;
}

const updateTransportadora = async (id, transportadora, usuarioLogado) => {
    const { nome, telefone, celular, email, tipoPessoa, cnpjCpf, fantasia, observacao } = transportadora;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query =
        'UPDATE transportadora SET nome = ?, telefone = ?, celular = ?, email = ?, tipo_pessoa = ?, cnpj_cpf = ?, fantasia = ?, observacao = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedTransportadora] = await connection.execute(query, [nome, telefone, celular, email, tipoPessoa, cnpjCpf, fantasia, observacao, dateUTC, usuarioLogado.empresa_id, id]);
    return updatedTransportadora;
}

module.exports = {
    getAll,
    createTransportadora,
    deleteTransportadora,
    updateTransportadora
};