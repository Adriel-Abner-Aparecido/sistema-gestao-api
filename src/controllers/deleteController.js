const connection = require('../models/connection');

// Função para excluir todos os registros onde o `empresa_id` corresponde ao ID da empresa do usuário logado
const deleteAllRecordsByEmpresaId = async (req, res) => {
    const empresaId = req.user.empresa_id;

    try {
        // Iniciar transação
        await connection.beginTransaction();

        // 1. Tabelas de referência indireta
        await connection.execute('DELETE FROM produtos_nfe WHERE nfe_id IN (SELECT id FROM nfe WHERE empresa_id = ?)', [empresaId]);
        await connection.execute('DELETE FROM resposta_nfe WHERE nfe_id IN (SELECT id FROM nfe WHERE empresa_id = ?)', [empresaId]);
        await connection.execute('DELETE FROM cliente_nfe WHERE nfe_id IN (SELECT id FROM nfe WHERE empresa_id = ?)', [empresaId]);
        await connection.execute('DELETE FROM pedido_nfe WHERE nfe_id IN (SELECT id FROM nfe WHERE empresa_id = ?)', [empresaId]);
        await connection.execute('DELETE FROM pagamento_pago WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM pagamento_recebido WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM sistema_logs WHERE usuario_id IN (SELECT id FROM usuario WHERE empresa_id = ?)', [empresaId]);

        // 2. Tabelas intermediárias de relacionamento
        await connection.execute('DELETE FROM produtos_da_venda WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM preco_produto WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM forma_pagamento WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM variacao_produto WHERE empresa_id = ?', [empresaId]);

        // 3. Tabelas que dependem de outras estruturas relacionadas ao `empresa_id`
        await connection.execute('DELETE FROM conta_receber WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM conta_pagar WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM nfe WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM venda WHERE empresa_id = ?', [empresaId]);

        // 4. Tabelas associadas diretamente ao `empresa_id`
        await connection.execute('DELETE FROM cliente WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM fornecedor WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM vendedor WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM categoria WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM categoria_contas WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM cor WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM unidade WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM marca WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM colecao WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM tipo_produto WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM origem WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM formas_pagamento WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM funcionalidades_plano WHERE plano_id IN (SELECT id FROM plano WHERE empresa_id = ?)', [empresaId]);
        await connection.execute('DELETE FROM tamanho WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM transportadora WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM kit WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM estoque WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM produto WHERE empresa_id = ?', [empresaId]);

        // 5. Tabela principal
        await connection.execute('DELETE FROM empresa WHERE id = ?', [empresaId]);

        // Commit transação
        await connection.commit();

        res.status(200).json({ message: 'Registros excluídos com sucesso para a empresa do usuário.' });
    } catch (error) {
        // Rollback em caso de erro
        await connection.rollback();
        console.error('Erro ao excluir registros:', error);
        res.status(500).json({ message: 'Erro ao excluir registros.' });
    }
};

const zerarDadosDaEmpresa = async (req, res) => {

    const empresaId = req.usuario.empresa_id;

    try {

        // 1. Tabelas de referência indireta
        await connection.execute('DELETE FROM resposta_nfe WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM pagamento_pago WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM pagamento_recebido WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM sistema_logs WHERE usuario_id IN (SELECT id FROM usuario WHERE empresa_id = ?)', [empresaId]);
        await connection.execute('DELETE FROM produtos_da_venda WHERE empresa_id = ?', [empresaId])
        await connection.execute('DELETE FROM produtos_entrada WHERE empresa_id = ?', [empresaId]);

        // 2. Tabelas intermediárias de relacionamento
        await connection.execute('DELETE FROM nota_fiscal_entrada WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM estoque WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM preco_produto WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM forma_pagamento WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM variacao_produto WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM nota_fiscal_entrada WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM operacoes_caixa WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM endereco WHERE empresa_id = ?', [empresaId]);

        // 3. Tabelas que dependem de outras estruturas relacionadas ao `empresa_id`
        await connection.execute('DELETE FROM conta_receber WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM conta_pagar WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM venda WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM entradas WHERE empresa_id = ?', [empresaId]);

        // 4. Tabelas associadas diretamente ao `empresa_id`
        await connection.execute('DELETE FROM caixa WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM cliente WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM vendedor WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM categoria_contas WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM cor WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM unidade WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM tipo_produto WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM origem WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM formas_pagamento WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM tamanho WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM transportadora WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM estoque WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM produto WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM colecao WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM marca WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM sub_categoria WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM categoria WHERE empresa_id = ?', [empresaId]);
        await connection.execute('DELETE FROM fornecedor WHERE empresa_id = ?', [empresaId]);

        res.status(200).json({ message: 'Dados da empresa Zerados.' });

    } catch (error) {
        // Rollback em caso de erro
        console.error('Erro ao excluir registros:', error);
        res.status(500).json({ message: 'Erro ao excluir registros.' });
    }
};


module.exports = {
    deleteAllRecordsByEmpresaId,
    zerarDadosDaEmpresa
};
