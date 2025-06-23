const webmaniaModel = require('../models/webmaniaModel');
const empresaModel = require('../models/empresaModel');
const axios = require('axios');
const { query } = require('../models/connection');

const WEBMANIA_URL = "https://webmaniabr.com/api/1/nfe/emissao/";
const WEBMANIA_URL_ATUALIZAR_EMPRESA = "https://webmaniabr.com/api/1/nfe/empresa/";

const getAllNFE = async (req, res) => {
    try {
        const nfeList = await webmaniaModel.getAllNFE(req.usuario);
        return res.status(200).json(nfeList);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar as NFes', error });
    }
};

const getNFE = async (req, res) => {
    const { id } = req.params;

    try {
        const nfeData = await webmaniaModel.getNFE(id, req.usuario);

        if (nfeData.length === 0) {
            return res.status(404).json({ message: 'NFE não encontrada.' });
        }

        return res.status(200).json(nfeData[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar a NFE', error });
    }
};

const getPageNFE = async (req, res) => {
    const { page, limit } = req.params;

    const notaFiscal = await webmaniaModel.getPageNFE(req.usuario, page, limit);

    return res.status(200).json(notaFiscal);
};

const createNFE = async (req, res) => {

    console.log(req.body);

    const nfeData = req.body;
    const usuarioLogado = req.usuario;

    try {
        // Busca a empresa associada ao usuário
        const empresa = await empresaModel.getMinhaEmpresa(usuarioLogado);

        if (!empresa || empresa[0][0].plano_id != 4) {
            return res.status(400).json({
                message: 'Erro ao emitir nota fiscal',
                details: 'Apenas o plano ouro pode emitir nota fiscal'
            });
        }

        const mockedNfeData = {
            ...nfeData,
            url_notificacao: "https://apploja-web-backend.vercel.app/updatestatusnfe"
        };

        // Chama a API da Webmania
        const response = await axios.post(WEBMANIA_URL, mockedNfeData, {
            headers: {
                'X-Consumer-Key': empresa[0][0].webmania_consumer_key,
                'X-Consumer-Secret': empresa[0][0].webmania_consumer_secret,
                'X-Access-Token': process.env.WEBMANIA_ACCESS_TOKEN,
                'X-Access-Token-Secret': process.env.WEBMANIA_ACCESS_TOKEN_SECRET,
                'Content-Type': 'application/json'
            }
        });

        const responseData = response.data;

        console.log(responseData)

        if (responseData.error) {
            return res.status(200).json({ message: `Erro: ${responseData.error}` })
        }

        if (response.status === 200) {
            // Se a NFE for aprovada, salva no banco de dados
            const newNFE = await webmaniaModel.createNFE({ ...mockedNfeData, ...responseData }, req.usuario);
            if (responseData.status === 'aprovado') {
                return res.status(201).json({ idNfe: newNFE.insertId, responseApi: responseData });
            } else if (responseData.status === 'reprovado') {
                return res.status(201).json({
                    message: `Nota Fiscal Reprovada. Motivo: ${responseData.motivo}`,
                });
            } else if (responseData.status === "contingencia") {
                return res.status(200).json({
                    message: "Nota fiscal emitida em contingencia, atualize o status na tela de Nota Fiscal."
                })
            } else {
                return res.status(200).json({
                    message: `Erro na emissão da Nota Fiscal. Motivo: ${responseData.error}`,
                });
            }
        } else {
            // Resposta com status inesperado
            return res.status(400).json({
                message: `Erro inesperado na comunicação com a Webmania. Detalhes: ${responseData.error}`,
            });
        }
    } catch (error) {
        // Tratamento de erro aprimorado
        let errorMessage = 'Erro ao criar a NFE';
        let errorDetails = 'Erro desconhecido';

        if (error.response && error.response.data) {
            // Extrai informações de erro do axios
            errorMessage = error.response.data.message || errorMessage;
            errorDetails = error.response.data.details || JSON.stringify(error.response.data);
        } else if (error.message) {
            // Usar a mensagem de erro genérica
            errorMessage = error.message;
        }

        console.error("Erro ao criar a NFE:", error);

        return res.status(500).json({ message: errorMessage });
    }
};

const updateStatus = async (req, res) => {

    console.log(req.body);


    try {
        await webmaniaModel.updateNfe(req.body)
    } catch (error) {
        console.error(error)
        return res.status(400)
    }

    return res.status(200).json({ message: "Nota atualizada" })
}

const cancelarNotaFiscal = async (req, res) => {
    const { chave } = req.body;
    const usuarioLogado = req.usuario;

    try {
        // Obtém os dados da empresa
        const empresa = await empresaModel.getMinhaEmpresa(usuarioLogado);

        // Faz a requisição PUT
        const response = await axios.put(
            'https://webmaniabr.com/api/1/nfe/cancelar/',
            {
                chave: chave,
                motivo: 'Cancelamento por motivos administrativos.',
            },
            {
                headers: {
                    'x-access-token-secret': process.env.WEBMANIA_ACCESS_TOKEN_SECRET,
                    'x-access-token': process.env.WEBMANIA_ACCESS_TOKEN,
                    'x-consumer-secret': empresa[0][0].webmania_consumer_secret,
                    'x-consumer-key': empresa[0][0].webmania_consumer_key,
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            }
        );

        const responseData = response.data;

        console.log(responseData)

        // Verifica o status da resposta
        if (responseData.status === 'cancelado') {
            await webmaniaModel.atualizaNotaCancelada(chave, responseData);
            return res.status(200).json({ message: 'Nota fiscal cancelada.' });
        } else {
            return res.status(400).json({
                message: 'Não foi possível cancelar a nota fiscal.',
                detalhes: responseData,
            });
        }
    } catch (error) {
        // Loga o erro completo para depuração
        console.error('Erro ao cancelar a nota fiscal:', error);

        // Retorna uma mensagem amigável ao cliente
        return res.status(500).json({
            message: 'Erro interno ao tentar cancelar a nota fiscal.',
            detalhes: error?.response?.data || error.message,
        });
    }
};

const notaDeDevolucaoDeMercadoria = async (req, res) => {

    const { chave, natureza_operacao, codigo_cfop, produtos, ambiente } = req.body
    const usuarioLogado = req.usuario

    try {

        const empresa = await empresaModel.getMinhaEmpresa(usuarioLogado)

        if (!empresa || empresa[0][0].plano_id != 4) {
            return res.status(400).json({
                message: 'Erro ao emitir nota fiscal',
                details: 'Apenas o plano ouro pode emitir nota fiscal'
            });
        }

        const body = {
            chave: chave,
            natureza_operacao: 'Devolução de venda de produção do estabelecimento',
            codigo_cfop: codigo_cfop,
            produtos: produtos,
            ambiente: ambiente
        }

        const criaNotaDeDevoluacao = await axios.post(`https://webmaniabr.com/api/1/nfe/devolucao/`, body, {
            headers:
            {
                'x-access-token-secret': process.env.WEBMANIA_ACCESS_TOKEN_SECRET,
                'x-access-token': process.env.WEBMANIA_ACCESS_TOKEN,
                'x-consumer-secret': empresa[0][0].webmania_consumer_secret,
                'x-consumer-key': empresa[0][0].webmania_consumer_key,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            },
            json: true
        })

    } catch (error) {
        console.error("Erro ao tentar criar a nota.")
    }

}

const consultaNfe = async (req, res) => {

    const { uuid } = req.params;
    const usuarioLogado = req.usuario;

    try {
        const empresa = await empresaModel.getMinhaEmpresa(usuarioLogado);

        // Executa a requisição usando axios.get com URL e objeto de opções
        const response = await axios.get('https://webmaniabr.com/api/1/nfe/consulta/', {
            headers: {
                'x-access-token-secret': process.env.WEBMANIA_ACCESS_TOKEN_SECRET,
                'x-access-token': process.env.WEBMANIA_ACCESS_TOKEN,
                'x-consumer-secret': empresa[0][0].webmania_consumer_secret,
                'x-consumer-key': empresa[0][0].webmania_consumer_key,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            params: {
                uuid: uuid
            }
        }
        );
        const dadosnota = response.data;

        console.log(dadosnota);

        // Atualiza a nota fiscal no banco de dados
        await webmaniaModel.updateNfe(dadosnota);


        return res.status(200).json({ message: 'Nota fiscal atualizada com sucesso' });


    } catch (error) {
        console.error('Erro ao consultar NFe:', error);
        return res.status(400).json({
            message: 'Erro ao consultar NFe',
            details: error.response?.data || error.message
        });
    }
};

const relatorioNotasPorPeriodo = async (req, res) => {

    const { dataInicio, dataFinal, modelo, status } = req.params

    const relatorio = await webmaniaModel.relatorioNotasPorPeriodo(dataInicio, dataFinal, modelo, status, req.usuario)

    res.status(200).json(relatorio)

}

const updateEmpresa = async (req, res) => {
    const usuarioLogado = req.usuario; // Usuário logado
    const empresaData = req.body; // Dados enviados no body da requisição

    try {
        // Busca a empresa associada ao usuário logado
        const empresa = await empresaModel.getMinhaEmpresa(usuarioLogado);

        if (!empresa || !empresa[0]) {
            return res.status(400).json({
                message: 'Erro ao atualizar empresa',
                details: 'Empresa não encontrada para o usuário logado'
            });
        }

        // Configurando os dados para a requisição à API da Webmania
        const requestData = {
            tipo_tributacao: empresaData.tipo_tributacao || empresa[0].tipo_tributacao,
            cnpj: empresaData.cnpj || empresa[0].cnpj,
            razao_social: empresaData.razao_social || empresa[0].razao_social,
            nome_fantasia: empresaData.nome_fantasia || empresa[0].nome_fantasia,
            ie: empresaData.ie || empresa[0].ie,
            unidade_empresa: empresaData.unidade_empresa || empresa[0].unidade_empresa,
            email: empresaData.email || empresa[0].email,
            telefone: empresaData.telefone || empresa[0].telefone,
            contabilidade: empresaData.contabilidade || empresa[0].contabilidade,
            subdominio: empresaData.subdominio || empresa[0].subdominio,
            url_notificacao: empresaData.url_notificacao || empresa[0].url_notificacao,
            logomarca: empresaData.logomarca || empresa[0].logomarca,
            regime_tributario: empresaData.regime_tributario || empresa[0].regime_tributario,
            cpf: empresaData.cpf || empresa[0].cpf, // Caso seja pessoa física
            nome_completo: empresaData.nome_completo || empresa[0].nome_completo, // Caso seja pessoa física
            im: empresaData.im || empresa[0].im // Inscrição Municipal
        };

        // Filtra para remover campos undefined
        Object.keys(requestData).forEach(key => {
            if (requestData[key] === undefined) {
                delete requestData[key];
            }
        });

        // Chamada para a API da Webmania para atualizar os dados da empresa
        const response = await axios.post(WEBMANIA_URL, requestData, {
            headers: {
                'X-Consumer-Key': empresa[0][0].webmania_consumer_key,
                'X-Consumer-Secret': empresa[0][0].webmania_consumer_secret,
                'X-Access-Token': process.env.WEBMANIA_ACCESS_TOKEN,
                'X-Access-Token': process.env.WEBMANIA_ACCESS_TOKEN,
                'X-Access-Token-Secret': process.env.WEBMANIA_ACCESS_TOKEN_SECRET,
                'Content-Type': 'application/json'
            }
        });

        // Tratamento da resposta
        if (response.data.success) {
            return res.status(200).json({ message: 'Empresa atualizada com sucesso', data: response.data });
        } else {
            return res.status(400).json({ message: 'Erro ao atualizar empresa', details: response.data });
        }

    } catch (error) {
        console.error("Erro ao atualizar empresa:", error);

        // Tratamento de erro aprimorado
        let errorMessage = 'Erro ao atualizar empresa';
        let errorDetails = 'Erro desconhecido';

        if (error.response && error.response.data) {
            // Extrai informações de erro do axios
            errorMessage = error.response.data.message || errorMessage;
            errorDetails = error.response.data.details || JSON.stringify(error.response.data);
        } else if (error.message) {
            // Usar a mensagem de erro genérica
            errorMessage = error.message;
        }

        return res.status(500).json({ message: errorMessage, details: errorDetails });
    }
};

const updateEnderecoFiscal = async (req, res) => {
    const usuarioLogado = req.usuario; // Usuário logado
    const enderecoData = req.body; // Dados de endereço enviados no body da requisição

    try {
        // Busca a empresa associada ao usuário logado
        const empresa = await empresaModel.getMinhaEmpresa(usuarioLogado);

        if (!empresa || !empresa[0]) {
            return res.status(400).json({
                message: 'Erro ao atualizar endereço',
                details: 'Empresa não encontrada para o usuário logado'
            });
        }

        // Configurando os dados de endereço para a requisição à API da Webmania
        const enderecoRequestData = {
            cep: enderecoData.cep || empresa[0].cep,
            endereco: enderecoData.endereco || empresa[0].rua,
            numero: enderecoData.numero || empresa[0].numero || 'S/N', // Caso o número não seja fornecido
            complemento: enderecoData.complemento || empresa[0].complemento || '', // Opcional
            bairro: enderecoData.bairro || empresa[0].bairro,
            cidade: enderecoData.cidade || empresa[0].cidade,
            uf: enderecoData.uf || empresa[0].uf
        };

        // Filtra para remover campos undefined
        Object.keys(enderecoRequestData).forEach(key => {
            if (enderecoRequestData[key] === undefined) {
                delete enderecoRequestData[key];
            }
        });

        // Chamada para a API da Webmania para atualizar os dados de endereço da empresa
        const response = await axios.post(WEBMANIA_URL_ATUALIZAR_EMPRESA, enderecoRequestData, {
            headers: {
                'X-Consumer-Key': empresa[0][0].webmania_consumer_key,
                'X-Consumer-Secret': empresa[0][0].webmania_consumer_secret,
                'X-Access-Token': process.env.WEBMANIA_ACCESS_TOKEN,
                'X-Access-Token-Secret': process.env.WEBMANIA_ACCESS_TOKEN_SECRET,
                'Content-Type': 'application/json'
            }
        });

        // Tratamento da resposta
        if (response.data.success) {
            return res.status(200).json({ message: 'Endereço atualizado com sucesso', data: response.data });
        } else {
            return res.status(400).json({ message: 'Erro ao atualizar endereço', details: response.data });
        }

    } catch (error) {
        console.error("Erro ao atualizar endereço:", error);

        // Tratamento de erro aprimorado
        let errorMessage = 'Erro ao atualizar endereço';
        let errorDetails = 'Erro desconhecido';

        if (error.response && error.response.data) {
            // Extrai informações de erro do axios
            errorMessage = error.response.data.message || errorMessage;
            errorDetails = error.response.data.details || JSON.stringify(error.response.data);
        } else if (error.message) {
            // Usar a mensagem de erro genérica
            errorMessage = error.message;
        }

        return res.status(500).json({ message: errorMessage, details: errorDetails });
    }
};

const updateConfigNFe = async (req, res) => {
    const usuarioLogado = req.usuario; // Usuário logado
    const nfeData = req.body; // Dados enviados no body da requisição

    try {
        // Busca a empresa associada ao usuário logado
        const empresa = await empresaModel.getMinhaEmpresa(usuarioLogado);

        if (!empresa || !empresa[0]) {
            return res.status(400).json({
                message: 'Erro ao atualizar configurações da NF-e',
                details: 'Empresa não encontrada para o usuário logado'
            });
        }

        // Configurando os dados de configuração da NF-e para a requisição à API da Webmania
        const nfeRequestData = {
            nfe_serie: nfeData.nfe_serie,
            nfe_numero: nfeData.nfe_numero,
            nfe_numero_dev: nfeData.nfe_numero_dev,
            informacoes_fisco: nfeData.informacoes_fisco,
            cnae_issqn: nfeData.cnae_issqn,
        };

        // Filtra para remover campos undefined
        Object.keys(nfeRequestData).forEach(key => {
            if (nfeRequestData[key] === undefined) {
                delete nfeRequestData[key];
            }
        });

        // Chamada para a API da Webmania para atualizar as configurações da NF-e
        const response = await axios.post(WEBMANIA_URL_ATUALIZAR_EMPRESA, nfeRequestData, {
            headers: {
                'X-Consumer-Key': empresa[0][0].webmania_consumer_key,
                'X-Consumer-Secret': empresa[0][0].webmania_consumer_secret,
                'X-Access-Token': process.env.WEBMANIA_ACCESS_TOKEN,
                'X-Access-Token-Secret': process.env.WEBMANIA_ACCESS_TOKEN_SECRET,
                'Content-Type': 'application/json'
            }
        });

        // Tratamento da resposta
        if (response.data.success) {
            return res.status(200).json({ message: 'Configurações da NF-e atualizadas com sucesso', data: response.data });
        } else {
            return res.status(400).json({ message: 'Erro ao atualizar configurações da NF-e', details: response.data });
        }

    } catch (error) {
        console.error("Erro ao atualizar configurações da NF-e:", error);

        // Tratamento de erro aprimorado
        let errorMessage = 'Erro ao atualizar configurações da NF-e';
        let errorDetails = 'Erro desconhecido';

        if (error.response && error.response.data) {
            // Extrai informações de erro do axios
            errorMessage = error.response.data.message || errorMessage;
            errorDetails = error.response.data.details || JSON.stringify(error.response.data);
        } else if (error.message) {
            // Usar a mensagem de erro genérica
            errorMessage = error.message;
        }

        return res.status(500).json({ message: errorMessage, details: errorDetails });
    }
};

const updateConfigNFCe = async (req, res) => {
    const usuarioLogado = req.usuario; // Usuário logado
    const nfceData = req.body; // Dados enviados no body da requisição

    try {
        // Busca a empresa associada ao usuário logado
        const empresa = await empresaModel.getMinhaEmpresa(usuarioLogado);

        if (!empresa || !empresa[0]) {
            return res.status(400).json({
                message: 'Erro ao atualizar configurações da NFC-e',
                details: 'Empresa não encontrada para o usuário logado'
            });
        }

        // Configurando os dados de configuração da NFC-e para a requisição à API da Webmania
        const nfceRequestData = {
            nfce_serie: nfceData.nfce_serie,
            nfce_numero: nfceData.nfce_numero,
            nfce_numero_dev: nfceData.nfce_numero_dev,
            nfce_id_csc: nfceData.nfce_id_csc,
            nfce_codigo_csc: nfceData.nfce_codigo_csc,
            informacoes_fisco: nfceData.informacoes_fisco,
            cnae_issqn: nfceData.cnae_issqn
        };

        // Filtra para remover campos undefined
        Object.keys(nfceRequestData).forEach(key => {
            if (nfceRequestData[key] === undefined) {
                delete nfceRequestData[key];
            }
        });

        // Chamada para a API da Webmania para atualizar as configurações da NFC-e
        const response = await axios.post(WEBMANIA_URL_ATUALIZAR_EMPRESA, nfceRequestData, {
            headers: {
                'X-Consumer-Key': empresa[0][0].webmania_consumer_key,
                'X-Consumer-Secret': empresa[0][0].webmania_consumer_secret,
                'X-Access-Token': process.env.WEBMANIA_ACCESS_TOKEN,
                'X-Access-Token-Secret': process.env.WEBMANIA_ACCESS_TOKEN_SECRET,
                'Content-Type': 'application/json'
            }
        });

        // Tratamento da resposta
        if (response.data.success) {
            return res.status(200).json({ message: 'Configurações da NFC-e atualizadas com sucesso', data: response.data });
        } else {
            return res.status(400).json({ message: 'Erro ao atualizar configurações da NFC-e', details: response.data });
        }

    } catch (error) {
        console.error("Erro ao atualizar configurações da NFC-e:", error);

        // Tratamento de erro aprimorado
        let errorMessage = 'Erro ao atualizar configurações da NFC-e';
        let errorDetails = 'Erro desconhecido';

        if (error.response && error.response.data) {
            // Extrai informações de erro do axios
            errorMessage = error.response.data.message || errorMessage;
            errorDetails = error.response.data.details || JSON.stringify(error.response.data);
        } else if (error.message) {
            // Usar a mensagem de erro genérica
            errorMessage = error.message;
        }

        return res.status(500).json({ message: errorMessage, details: errorDetails });
    }
};

const updateCertificado = async (req, res) => {
    const usuarioLogado = req.usuario; // Usuário logado
    const { certificado, certificado_senha } = req.body; // Dados enviados no body da requisição

    try {
        // Busca a empresa associada ao usuário logado
        const empresa = await empresaModel.getMinhaEmpresa(usuarioLogado);

        if (!empresa || !empresa[0]) {
            return res.status(400).json({
                message: 'Erro ao atualizar certificado',
                details: 'Empresa não encontrada para o usuário logado'
            });
        }

        // Verifica se o certificado e a senha foram fornecidos
        if (!certificado || !certificado_senha) {
            return res.status(400).json({
                message: 'Erro ao atualizar certificado',
                details: 'Certificado e senha são obrigatórios'
            });
        }

        // Configurando os dados para a requisição à API da Webmania
        const certificadoRequestData = {
            certificado: certificado, // Certificado codificado em Base64
            certificado_senha: certificado_senha // Senha do certificado
        };

        // Chamada para a API da Webmania para atualizar o certificado digital A1
        const response = await axios.post(WEBMANIA_URL_ATUALIZAR_EMPRESA, certificadoRequestData, {
            headers: {
                'X-Consumer-Key': empresa[0][0].webmania_consumer_key,
                'X-Consumer-Secret': empresa[0][0].webmania_consumer_secret,
                'X-Access-Token': process.env.WEBMANIA_ACCESS_TOKEN,
                'X-Access-Token-Secret': process.env.WEBMANIA_ACCESS_TOKEN_SECRET,
                'Content-Type': 'application/json'
            }
        });

        // Tratamento da resposta
        if (response.data.success) {
            return res.status(200).json({ message: 'Certificado atualizado com sucesso', data: response.data });
        } else {
            return res.status(400).json({ message: 'Erro ao atualizar certificado', details: response.data });
        }

    } catch (error) {
        console.error("Erro ao atualizar certificado:", error);

        // Tratamento de erro aprimorado
        let errorMessage = 'Erro ao atualizar certificado';
        let errorDetails = 'Erro desconhecido';

        if (error.response && error.response.data) {
            // Extrai informações de erro do axios
            errorMessage = error.response.data.message || errorMessage;
            errorDetails = error.response.data.details || JSON.stringify(error.response.data);
        } else if (error.message) {
            // Usar a mensagem de erro genérica
            errorMessage = error.message;
        }

        return res.status(500).json({ message: errorMessage, details: errorDetails });
    }
};

module.exports = {
    getAllNFE,
    getNFE,
    getPageNFE,
    createNFE,
    cancelarNotaFiscal,
    updateStatus,
    consultaNfe,
    relatorioNotasPorPeriodo,
    updateEmpresa,
    updateEnderecoFiscal,
    updateConfigNFe,
    updateConfigNFCe,
    updateCertificado,
};
