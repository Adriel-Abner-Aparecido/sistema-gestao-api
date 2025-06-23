const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.TOKEN_MERCADO_PAGO
});

const createPayment = async (payment) => {
    try {
        let preference = {
            items: [
                {
                    title: payment.title,
                    unit_price: payment.price,
                    quantity: payment.quantity,
                }
            ],
            external_reference: payment.external_reference,
            back_urls: {
                success: 'https://app.apploja.com/pagamento-aprovado',
                failure: 'https://app.apploja.com/pagamento-reprovado',
                pending: 'https://app.apploja.com/pagamento-pendente'
            },
            auto_return: 'all'
        };

        let response = await mercadopago.preferences.create(preference);
        return response.body.init_point;
    } catch (error) {
        console.log('Error creating payment:', error);
        throw error;
    }
};

const getPaymentById = async (paymentId) => {
    try {
        const response = await mercadopago.payment.get(paymentId);
        return response.body;
    } catch (error) {
        console.log('Error getting payment:', error);
        throw error;
    }
};

module.exports = {
    createPayment,
    getPaymentById
};