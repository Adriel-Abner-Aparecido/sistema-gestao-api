const connection = require("./connection");

//Tabela geral de fluxo de caixa.

const getAll = async (periodo, page, limitItems, usuarioLogado) => {

    let limit

    try {

        const [totalFluxo] = await connection.execute(`SELECT COUNT(f.id) AS total_entradas
                FROM (
                SELECT
                    pagamento_pago.id
                FROM
                    pagamento_pago
                LEFT JOIN conta_pagar ON pagamento_pago.conta_pagar_id = conta_pagar.id
                WHERE
                    pagamento_pago.deleted_at IS NULL
                    AND pagamento_pago.empresa_id = ?
                    AND YEAR(data_pagamento) = YEAR(?)
                    AND MONTH(data_pagamento) = MONTH(?)
    
                UNION ALL
                
                SELECT
                    pagamento_recebido.id
                FROM
                    pagamento_recebido
                LEFT JOIN conta_receber ON pagamento_recebido.conta_receber_id = conta_receber.id
                WHERE
                    pagamento_recebido.deleted_at IS NULL
                    AND conta_receber.deleted_at IS NULL
                    AND pagamento_recebido.empresa_id = ?
                    AND YEAR(data_pagamento) = YEAR(?)
                    AND MONTH(data_pagamento) = MONTH(?)
            ) AS f;`, [
            usuarioLogado.empresa_id,
            periodo,
            periodo,
            usuarioLogado.empresa_id,
            periodo,
            periodo,
        ])

        // Verifica e valida os parâmetros
        limit = page > 1 ? (page - 1) * limitItems : 0;

        // Query SQL
        const query = `
            SELECT 
                pagamento_pago.id, 
                pagamento_pago.valor_pago,
                pagamento_pago.data_pagamento, 
                'saida' as tipo, 
                categoria_contas.nome AS categoria, 
                conta_pagar.tipo AS descricao, 
                formas_pagamento.nome AS forma_Pagamento, 
                empresa.nome AS empresa
            FROM 
                pagamento_pago
            LEFT JOIN conta_pagar ON pagamento_pago.conta_pagar_id = conta_pagar.id
            LEFT JOIN fornecedor ON conta_pagar.fornecedor_id = fornecedor.id
            LEFT JOIN formas_pagamento ON pagamento_pago.formas_pagamento_id = formas_pagamento.id
            LEFT JOIN categoria_contas ON conta_pagar.categoria_contas_id = categoria_contas.id
            LEFT JOIN empresa ON conta_pagar.empresa_id = empresa.id
            WHERE 
                pagamento_pago.empresa_id = ? 
            AND 
                pagamento_pago.deleted_at IS null
            AND
                YEAR(data_pagamento) = YEAR(?)
            AND
                MONTH(data_pagamento) = MONTH(?)
            UNION
                SELECT
                    pagamento_recebido.id,
                    pagamento_recebido.valor_pago,
                    pagamento_recebido.data_pagamento,
                    'entrada' as tipo, 
                    categoria_contas.nome AS categoria,
                    conta_receber.tipo AS descricao,
                    formas_pagamento.nome AS forma_pagamento,
                    empresa.nome AS Empresa
            FROM
                pagamento_recebido
            LEFT JOIN conta_receber ON pagamento_recebido.conta_receber_id = conta_receber.id
            LEFT JOIN cliente ON conta_receber.cliente_id = cliente.id
            LEFT JOIN formas_pagamento ON pagamento_recebido.formas_pagamento_id = formas_pagamento.id
            LEFT JOIN categoria_contas ON conta_receber.categoria_contas_id = categoria_contas.id
            LEFT JOIN empresa ON conta_receber.empresa_id = empresa.id
            WHERE 
                pagamento_recebido.empresa_id = ? 
            AND 
                pagamento_recebido.deleted_at IS null
            AND 
                conta_receber.deleted_at IS NULL
            AND
                YEAR(data_pagamento) = YEAR(?)
            AND
                MONTH(data_pagamento) = MONTH(?)
            ORDER BY 
                data_pagamento DESC
            LIMIT ?, ?
        `;

        // Parâmetros para a query
        const params = [
            usuarioLogado.empresa_id,
            periodo,
            periodo,
            usuarioLogado.empresa_id,
            periodo,
            periodo,
            `${limit}`,
            limitItems
        ];

        const queryTotalRecebido = `
            SELECT
                COALESCE(SUM(IF(cr.valor <= pr.valor_pago, pr.valor_pago, NULL)), 0) AS total_recebido
            FROM
                conta_receber AS cr
            LEFT JOIN 
                pagamento_recebido AS pr ON cr.id = pr.conta_receber_id
            WHERE
                cr.deleted_at IS NULL
            AND
                pr.deleted_at IS NULL
            AND 
                cr.empresa_id = ?
            AND
                YEAR(pr.data_pagamento) = YEAR(?)
            AND
                MONTH(pr.data_pagamento) = MONTH(?)
        `;

        const queryTotalPago = `
            SELECT
                COALESCE(SUM(pp.valor_pago), 0) AS total_pago
            FROM
                conta_pagar AS cp
            LEFT JOIN
                pagamento_pago AS pp ON cp.id = pp.conta_pagar_id
            WHERE
                cp.deleted_at IS NULL
            AND
                pp.deleted_at IS NULL
            AND 
                cp.empresa_id = ?
            AND
                YEAR(pp.data_pagamento) = YEAR(?)
            AND
                MONTH(pp.data_pagamento) = MONTH(?)
        `

        const paramsCrCp = [
            usuarioLogado.empresa_id,
            periodo,
            periodo
        ]

        // Execute a query
        const [rows] = await connection.execute(query, params);
        const [receber] = await connection.execute(queryTotalRecebido, paramsCrCp)
        const [pago] = await connection.execute(queryTotalPago, paramsCrCp)

        // Retorna os resultados
        return {
            total_fluxo: totalFluxo[0].total_entradas,
            fluxo_caixa: rows,
            total: (receber[0].total_recebido - pago[0].total_pago)
        };
    } catch (error) {
        console.error("Erro ao buscar dados do fluxo de caixa:", error);
        throw error; // Propaga o erro para ser tratado no nível superior
    }
};

module.exports = {
    getAll
}