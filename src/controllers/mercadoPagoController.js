const mercadopagoModel = require('../models/mercadoPagoModel');
const pagamentoModel = require('../models/pagamentoModel');
const empresaModel = require('../models/empresaModel');
const userModel = require('../models/usuarioModel');

const createPayment = async (req, res) => {
    const paymentURL = await mercadopagoModel.createPayment(req.body);

    return res.status(201).json({ url: paymentURL });
}

const processPayment = async (status, paymentInfo, req) => {
    const parts = paymentInfo.external_reference.match(/^(\d+) ([\w\s]+) (\d+\.?\d*) (.+)$/);
    if (parts) {
        const plano_id = parts[1];
        const plano_nome = parts[2];
        const plano_valor = parts[3];
        const emailUser = parts[4];
        console.log("ID plano: ", plano_id);
        console.log("Nome plano: ", plano_nome);
        console.log("Valor plano: ", plano_valor);
        console.log("Email cliente: ", emailUser);

        const user = await userModel.getUsuarioByEmail(emailUser);
        if (user) {
            console.log('Usuário encontrado:', user.username);

            // Cria um novo pagamento para o usuário encontrado
            const newPagamento = {
                valor: plano_valor,
                status: status,
                tipo: plano_nome,
                externalReference: paymentInfo.external_reference,
                data: new Date(),
                idPagamentoMercadoPago: req.body.data.id,
                idPlanoComprado: plano_id,
            };

            const pagamento = await pagamentoModel.createPagamento(newPagamento, user);
            console.log('Pagamento criado com o id', pagamento.insertId);

            // Se o pagamento for aprovado, atualize o plano da empresa do usuário
            if (status === 'Aprovado') {
                await empresaModel.updateEmpresaPlanoId(user.empresa_id, plano_id);
            }
        }
    } else {
        console.log("Formato de external_reference inválido");
    }
};

const handleNotification = async (req, res) => {
    try {
        const paymentInfo = await mercadopagoModel.getPaymentById(req.body.data.id);

        if (req.body.action == "payment.created") {
            if (paymentInfo.status == "pending") {
                await processPayment('Pendente', paymentInfo, req);
            } else if (paymentInfo.status == "approved") {
                await processPayment('Aprovado', paymentInfo, req);
            } else {
                await processPayment('Reprovado', paymentInfo, req);
            }
        } else if (req.body.action == "payment.updated") {
            let status;
            if (paymentInfo.status == "approved") {
                status = "Aprovado";
            } else if (paymentInfo.status == "rejected") {
                status = "Reprovado";
            } else {
                status = "Pendente";
            }
            await pagamentoModel.updatePagamentoStatus(req.body.data.id, status);
            console.log(`Pagamento com ID ${req.body.data.id} foi atualizado para ${status}`);

            // Se o pagamento foi aprovado, atualize o plano da empresa.
            if (status === "Aprovado") {
                const parts = paymentInfo.external_reference.match(/^(\d+) ([\w\s]+) (\d+\.?\d*) (.+)$/);
                if (parts) {
                    const plano_id = parts[1];
                    const emailUser = parts[4];
                    console.log("ID plano: ", plano_id);
                    console.log("Email cliente: ", emailUser);

                    const user = await userModel.getUsuarioByEmail(emailUser);
                    if (user) {
                        console.log('Usuário encontrado:', user.username);
                        await empresaModel.updateEmpresaPlanoId(user.empresa_id, plano_id);
                    }
                } else {
                    console.log("Formato de external_reference inválido");
                }
            }
        }
    } catch (error) {
        console.error('Erro ao tratar notificação do Mercado Pago', error);
    }
    res.status(200).end(); // Responda com status 200 para que o Mercado Pago entenda que a notificação foi recebida corretamente
};


module.exports = {
    createPayment,
    handleNotification
};
