const validatePayment = (req, res, next) => {
    const { body } = req;

    if (!body.title) {
        return res.status(400).json({ message: 'O campo "title" é obrigatório' });
    }

    if (body.price === undefined) {
        return res.status(400).json({ message: 'O campo "price" é obrigatório' });
    }

    if (body.quantity === undefined) {
        return res.status(400).json({ message: 'O campo "quantity" é obrigatório' });
    }

    if (body.external_reference === undefined) {
        return res.status(400).json({ message: 'O campo "external_reference" é obrigatório' });
    }

    next();
};

module.exports = {
    validatePayment
};
