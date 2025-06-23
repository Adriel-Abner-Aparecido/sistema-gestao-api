const isValidString = (str) => typeof str === 'string' && str.trim().length > 0;

const isValidInteger = (num) => Number.isInteger(num);

const validateNFEData = (req, res, next) => {
    const {
        operacao,
        natureza_operacao,
        modelo,
        finalidade,
        cliente,
        produtos,
        pedido
    } = req.body;

    if (!isValidInteger(operacao)) {
        return res.status(400).json({ message: 'O campo "operacao" é obrigatório e deve ser um número inteiro.' });
    }

    if (!isValidString(natureza_operacao)) {
        return res.status(400).json({ message: 'O campo "natureza_operacao" é obrigatório e deve ser uma string válida.' });
    }

    if (!isValidString(modelo)) {
        return res.status(400).json({ message: 'O campo "modelo" é obrigatório e deve ser uma string válida.' });
    }

    if (!isValidInteger(finalidade)) {
        return res.status(400).json({ message: 'O campo "finalidade" é obrigatório e deve ser um número inteiro.' });
    }

    if (cliente === undefined || typeof cliente !== 'object') {
        return res.status(400).json({ message: 'O campo "cliente" é obrigatório e deve ser um objeto.' });
    }

    if (!Array.isArray(produtos) || produtos.length === 0) {
        return res.status(400).json({ message: 'O campo "produtos" é obrigatório e deve ser um array com pelo menos um produto.' });
    }

    if (pedido === undefined || typeof pedido !== 'object') {
        return res.status(400).json({ message: 'O campo "pedido" é obrigatório e deve ser um objeto.' });
    }

    next();
};

module.exports = {
    validateNFEData
};
