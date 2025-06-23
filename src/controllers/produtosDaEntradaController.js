const produtosDaEntradaModel = require('../models/produtosDaEntradaModel')

const getEntradaById = async (req, res) => {
    try {
        const { id } = req.params;
        //console.log('ID recebido:', id);

        const produtos_entrada = await produtosDaEntradaModel.getById(id);
        //console.log('Resultado da query:', produtos_entrada);

        if (!produtos_entrada || produtos_entrada.length === 0) {
            return res.status(404).json({ message: 'Produtos não encontrados' });
        }

        return res.status(200).json(produtos_entrada);
    } catch (error) {
        console.error('Erro no controlador getEntradaById:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const create = async (req, res) => {

    const createProdutos = produtosDaEntradaModel.createProdutosEntrada(req.body, req.usuario)

    return res.status(200).json(createProdutos)

}

module.exports = {
    getEntradaById,
    create
}