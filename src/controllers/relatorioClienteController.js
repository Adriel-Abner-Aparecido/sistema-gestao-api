// controllers/relatorioClienteController.js
const connection = require('../models/connection');

const getRelatorioClientes = async (req, res) => {
  try {
    const [clientes] = await connection.execute(`
        SELECT 
          cliente.id AS id,
          cliente.nome AS cliente,
          cliente.celular,
          MAX(venda.data) AS ultimaCompra,
          DATEDIFF(NOW(), MAX(venda.data)) AS diasDesdeUltimaCompra,
          COUNT(venda.id) AS quantidadeCompras,
          AVG(venda.valor) AS valorMedioPedido,
          SUM(produtos_venda.valor * produtos_venda.quantidade) AS ltv,
          AVG(produtos_venda.valor) AS valorMedioProduto,
          GROUP_CONCAT(produto.nome ORDER BY venda.data DESC SEPARATOR ', ') AS ultimosProdutosComprados
        FROM cliente
        LEFT JOIN venda ON cliente.id = venda.cliente_id
        LEFT JOIN produtos_da_venda AS produtos_venda ON venda.id = produtos_venda.venda_id
        LEFT JOIN estoque ON produtos_venda.estoque_id = estoque.id
        LEFT JOIN variacao_produto ON estoque.variacao_produto_id = variacao_produto.id
        LEFT JOIN produto ON variacao_produto.produto_id = produto.id
        WHERE cliente.empresa_id = ?
        GROUP BY cliente.id
        ORDER BY ltv DESC;
      `, [req.usuario.empresa_id]);

    const relatorio = clientes.map(cliente => {
      const intervaloEntreCompras = cliente.quantidadeCompras > 1 ? Math.round(cliente.diasDesdeUltimaCompra / (cliente.quantidadeCompras - 1)) : 0;
      const acaoSugerida = cliente.diasDesdeUltimaCompra === null ? 'Manter contato' : cliente.diasDesdeUltimaCompra >= 60 ? "Manter contato" : cliente.diasDesdeUltimaCompra <= 30 ? 'Agradecimento' : 'Reengajar';

      return {
        id: cliente.id,
        cliente: cliente.cliente,
        contato: cliente.contato || 'Não informado',
        celular: cliente.celular || 'Não informado',
        ultimaCompra: cliente.ultimaCompra,
        diasDesdeUltimaCompra: cliente.diasDesdeUltimaCompra,
        intervaloEntreCompras,
        quantidadeCompras: cliente.quantidadeCompras,
        valorMedioPedido: cliente.valorMedioPedido != null ? parseFloat(cliente.valorMedioPedido.toFixed(2)) : 0,
        valorMedioProduto: cliente.valorMedioProduto != null ? parseFloat(cliente.valorMedioProduto.toFixed(2)) : 0,
        ltv: cliente.ltv != null ? parseFloat(cliente.ltv.toFixed(2)) : 0,
        ultimosProdutosComprados: cliente.ultimosProdutosComprados ? cliente.ultimosProdutosComprados.split(', ') : [],
        acaoSugerida
      };
    });

    return res.status(200).json(relatorio);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao gerar relatório de clientes" });
  }
};

module.exports = {
  getRelatorioClientes
};
