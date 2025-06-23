const connection = require('./connection');

const getAll = async (usuarioLogado) => {
    const contaPagar = await connection.execute('SELECT * FROM conta_pagar WHERE deleted_at IS NULL AND empresa_id = ?', [usuarioLogado.empresa_id]);
    return contaPagar;
};

const getByFornecedor = async (idFornecedor, usuarioLogado) => {
    const contaPagar = await connection.execute('SELECT * FROM conta_pagar WHERE deleted_at IS NULL AND fornecedor_id = ? AND empresa_id = ?', [idFornecedor, usuarioLogado.empresa_id]);
    return contaPagar;
};

const getByDate = async (startDate, endDate, usuarioLogado) => {
    const query = `
        SELECT * FROM conta_pagar 
        WHERE 
            deleted_at IS NULL 
            AND data_vencimento BETWEEN ? AND ?
            AND empresa_id = ?
        ORDER BY data_vencimento`;

    const [contas] = await connection.execute(query, [startDate, endDate, usuarioLogado.empresa_id]);
    return contas;
};

const getPage = async (usuarioLogado, page, limitItems) => {
    let limit;

    const [linhas] = await connection.execute(`
        SELECT COUNT(*) as total 
        FROM conta_pagar cp
        LEFT JOIN pagamento_pago pp ON cp.id = pp.conta_pagar_id
        LEFT JOIN fornecedor fo ON cp.fornecedor_id = fo.id
        LEFT JOIN formas_pagamento fp ON pp.formas_pagamento_id = fp.id
        WHERE cp.deleted_at IS NULL AND cp.empresa_id = ?`, [usuarioLogado.empresa_id]);
    const total_contas = linhas[0].total;

    page === 1 ? limit = 0 : limit = (page - 1) * limitItems;

    const query = `
        SELECT 
            cp.id as conta_pagar_id,
            cp.data_vencimento,
            cp.tipo,
            cp.categoria_contas_id,
            fo.nome AS fornecedor,
            fo.id AS fornecedor_id,
            cp.valor,
            fp.id AS forma_de_pagamento_id,
            fp.nome AS forma_de_pagamento,
            pp.id as pagamento_pago_id,
            pp.data_pagamento,
            pp.parcelas,
            pp.valor_pago,
            oc.id AS operacao_id,
            cx.id AS caixa_id
        FROM 
            conta_pagar AS cp
        LEFT JOIN 
            pagamento_pago AS pp ON cp.id = pp.conta_pagar_id AND pp.deleted_at IS NULL
        LEFT JOIN 
            fornecedor AS fo ON cp.fornecedor_id = fo.id
        LEFT JOIN 
            formas_pagamento AS fp ON pp.formas_pagamento_id = fp.id
        LEFT JOIN
            operacoes_caixa AS oc ON oc.conta_pagar_id = cp.id AND cp.deleted_at IS NULL
        LEFT JOIN
            caixa AS cx ON oc.caixa_id = cx.id
        WHERE
            cp.deleted_at IS NULL AND cp.empresa_id = ?
        ORDER BY cp.id DESC 
        LIMIT ?, ?`;

    const params = [
        usuarioLogado.empresa_id,
        `${limit}`,
        limitItems
    ]


    const [contas] = await connection.execute(query, params);

    return {
        total_contas,
        contas
    };
};

const createContaPagar = async (contaPagar, usuarioLogado) => {

    console.log("Conta Pagar:", contaPagar)

    const { valor, dataVencimento, fornecedorId, tipo, categoriaConta } = contaPagar;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO conta_pagar(valor, data_vencimento, fornecedor_id, tipo, categoria_contas_id, created_at, empresa_id) VALUES (?, ?, ?, ?, ?, ?, ?)';

    const [createdContaPagar] = await connection.execute(query, [valor, dataVencimento, fornecedorId, tipo, categoriaConta, dateUTC, usuarioLogado.empresa_id]);

    return { insertId: createdContaPagar.insertId };
}

const deleteContaPagar = async (id) => {

    const dateUTC = new Date(Date.now()).toUTCString();

    const [removedContaPagar] = await connection.execute('UPDATE conta_pagar SET deleted_at = ? WHERE id = ?', [dateUTC, id]);

    return removedContaPagar;
}

const updateContaPagar = async (id, contaPagar, usuarioLogado) => {

    console.log("UP Conta Pagar", contaPagar)

    const { valor, dataVencimento, fornecedorId, tipo, categoriaConta } = contaPagar;

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'UPDATE conta_pagar SET valor = ?, data_vencimento = ?, fornecedor_id = ?, tipo = ?, categoria_contas_id = ?, updated_at = ?, empresa_id = ? WHERE id = ?';

    const [updatedContaPagar] = await connection.execute(query, [valor, dataVencimento, fornecedorId, tipo, categoriaConta, dateUTC, usuarioLogado.empresa_id, id]);

    return updatedContaPagar;

}

module.exports = {
    getAll,
    getByFornecedor,
    getPage,
    createContaPagar,
    deleteContaPagar,
    updateContaPagar,
    getByDate
};
