const connection = require('./connection');

const getAll = async () => {

    const empresa = await connection.execute('SELECT * FROM empresa WHERE deleted_at IS NULL');

    return empresa;

};

const getMinhaEmpresa = async (usuarioLogado) => {

    const query = `
        SELECT 
            *,
            (CASE
                WHEN (DATE(NOW()) > (DATE_ADD(contratacao, INTERVAL 383 DAY)))
                THEN 'TRUE'
                ELSE 'FALSE'
            END) AS inativo,
            (CASE
                WHEN DATE(CURDATE()) <= DATE(DATE_ADD(contratacao, INTERVAL 383 DAY))
                THEN DATEDIFF(DATE(DATE_ADD(contratacao, INTERVAL 383 DAY)), CURDATE())
                ELSE 0
            END) AS dias_para_expirar,
            DATE(DATE_ADD(contratacao, INTERVAL 365 DAY)) AS validade_plano
        FROM 
            empresa 
        WHERE 
            deleted_at IS NULL 
        AND
            contratacao IS NOT NULL
        AND
            id = ?
    `;

    const params = [
        usuarioLogado.empresa_id
    ]

    const empresa = await connection.execute(query, params);

    return empresa;

};

const getEmpresaById = async (id) => {

    const [empresa] = await connection.execute('SELECT * FROM empresa WHERE id = ?', [id]);

    return empresa;

};

const createEmpresa = async (empresa) => {

    console.log(empresa)

    const { nome, nomeFantasia, cnpj, telefone, celular, email, cep, rua, numero, bairro, complemento, cidade, uf, emailUser, planoId, consumerKey, consumerSecret, classeImpostoPadrao, logoImage, origem } = empresa;

    const date = new Date(Date.now())
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const dateContratacao = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const [usuarioEmail] = await connection.execute('SELECT * FROM usuario WHERE email = ?', [emailUser]);

    if (usuarioEmail.length != 0) {
        return { message: "Usuário já cadastrado" };
    }

    const query = `
        INSERT INTO 
            empresa(
                nome, 
                nome_fantasia, 
                cnpj, 
                telefone, 
                celular, 
                cep, 
                rua, 
                numero,
                bairro, 
                complemento, 
                cidade, 
                uf, 
                email, 
                plano_id,
                contratacao, 
                webmania_consumer_key, 
                webmania_consumer_secret, 
                classe_imposto_padrao, 
                logo_image, 
                origem, 
                created_at,
                updated_at
            ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now())`;

    const params = [
        nome,
        nomeFantasia ?? null,
        cnpj,
        telefone,
        celular,
        email,
        cep ?? null,
        rua ?? null,
        numero ?? null,
        bairro ?? null,
        complemento ?? null,
        cidade ?? null,
        uf ?? null,
        planoId,
        dateContratacao,
        consumerKey ?? null,
        consumerSecret ?? null,
        classeImpostoPadrao ?? null,
        logoImage ?? null,
        origem ?? null
    ]

    try {
        const [createdEmpresa] = await connection.execute(query, params);
        return { insertId: createdEmpresa.insertId };
    } catch (error) {
        throw new Error(error)
    }

}

const deleteEmpresa = async (id) => {

    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedEmpresa] = await connection.execute('UPDATE empresa SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedEmpresa;

}

const updateEmpresa = async (id, empresa) => {

    console.log(empresa)

    const { nome, nomeFantasia, cnpj, telefone, celular, email, cep, rua, numero, bairro, complemento, cidade, uf, planoId, consumerKey, consumerSecret, classeImpostoPadrao, logoImage } = empresa;

    let query;
    let queryParameters = [];

    if (!logoImage) {
        query = 'UPDATE empresa SET nome = ?, cnpj = ?, telefone = ?, celular = ?, email = ?, plano_id = ?, webmania_consumer_key = ?, webmania_consumer_secret = ?, classe_imposto_padrao = ?, updated_at = now(), nome_fantasia = ?, cep = ?, rua = ?, numero = ?, bairro = ?, complemento = ?, cidade = ?, uf = ? WHERE id = ?';
        queryParameters = [nome, cnpj, telefone, celular, email, planoId, consumerKey, consumerSecret, classeImpostoPadrao, nomeFantasia, cep, rua, numero, bairro, complemento, cidade, uf, id];
    } else {
        query = 'UPDATE empresa SET nome = ?, cnpj = ?, telefone = ?, celular = ?, email = ?, plano_id = ?, webmania_consumer_key = ?, webmania_consumer_secret = ?, classe_imposto_padrao = ?, logo_image = ?, updated_at = now(), nome_fantasia = ?, cep = ?, rua = ?, numero = ?, bairro = ?, complemento = ?, cidade = ?, uf = ? WHERE id = ?';
        queryParameters = [nome, cnpj, telefone, celular, email, planoId, consumerKey, consumerSecret, classeImpostoPadrao, logoImage, nomeFantasia, cep, rua, numero, bairro, complemento, cidade, uf, id];
    }

    const [updatedEmpresa] = await connection.execute(query, queryParameters);

    return updatedEmpresa;

}

const updateEmpresaPlanoId = async (idEmpresa, idPlano) => {

    const query = 'UPDATE empresa SET plano_id = ?, updated_at = now() WHERE id = ?';

    const [updatedRows] = await connection.execute(query, [idPlano, idEmpresa]);

    return updatedRows;

};

module.exports = {
    getAll,
    createEmpresa,
    deleteEmpresa,
    updateEmpresa,
    getMinhaEmpresa,
    updateEmpresaPlanoId,
    getEmpresaById
};