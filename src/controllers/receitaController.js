const axios = require('axios');

//Exemplo 
//{
//   "abertura": "07/08/2010",
//   "situacao": "BAIXADA",
//   "tipo": "MATRIZ",
//   "nome": "ROBERIO JOSE DOS SANTOS 16952477870",
//   "porte": "MICRO EMPRESA",
//   "natureza_juridica": "213-5 - Empresário (Individual)",
//   "logradouro": "AVENIDA CAPITAO LUIS ANTONIO PIMENTA",
//   "numero": "563",
//   "complemento": "CASA 10",
//   "municipio": "SAO VICENTE",
//   "bairro": "PARQUE BITARU",
//   "uf": "SP",
//   "cep": "11.330-200",
//   "email": "fhermes@vivax.comm.br",
//   "telefone": "(13) 9798-7487",
//   "data_situacao": "17/06/2013",
//   "motivo_situacao": "Extinção Por Encerramento Liquidação Voluntária",
//   "cnpj": "12.345.678/0001-95",
//   "ultima_atualizacao": "2024-10-03T18:50:14.686Z",
//   "status": "OK",
//   "fantasia": "",
//   "efr": "",
//   "situacao_especial": "",
//   "data_situacao_especial": "",
//   "atividade_principal": [
//     {
//       "code": "00.00-0-00",
//       "text": "********"
//     }
//   ],
//   "atividades_secundarias": [
//     {
//       "code": "00.00-0-00",
//       "text": "Não informada"
//     }
//   ],
//   "capital_social": "0.00",
//   "qsa": [],
//   "simples": {
//     "optante": false,
//     "data_opcao": "07/08/2010",
//     "data_exclusao": "17/06/2013",
//     "ultima_atualizacao": "2024-09-14T23:59:59.000Z"
//   },
//   "simei": {
//     "optante": false,
//     "data_opcao": "07/08/2010",
//     "data_exclusao": "17/06/2013",
//     "ultima_atualizacao": "2024-09-14T23:59:59.000Z"
//   },
//   "extra": {

//   },
//   "billing": {
//     "free": true,
//     "database": true
//   }
// }

const getCNPJInfo = async (req, res) => {
  try {
    const { cnpj } = req.params;

    const response = await axios.get(`http://receitaws.com.br/v1/cnpj/${cnpj}`, {
      headers: {
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)',
        'Authorization': `Bearer ${process.env.TOKEN_CONSULTA_CNPJ_RECEITA}`
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Erro ao consultar a API da ReceitaWS:', error.message);
    res.status(500).json({ error: 'Erro ao consultar a API da ReceitaWS' });
  }
};

const getIncricaoEstadual = async (req, res) => {

  const { cnpj } = req.params
  const token = "01CB2EBE-FFA6-4EBE-809A-0081CFB4F6A6"

  const options = {
    method: 'GET',
    url: 'https://www.sintegraws.com.br/api/v1/execute-api.php',
    params: {
      token: token,
      cnpj: cnpj,
      plugin: 'ST'
    }
  }

  try {

    const response = await axios(options)

    const responseSWS = response.data

    console.log(responseSWS)

    if (responseSWS.status === "ERROR") {
      res.status(401).json({ message: `Erro: ${responseSWS.message}` })
    }

    res.status(200).json(responseSWS.data)

  } catch (error) {
    console.error("Erro ao fazer a consulta!", error)
    res.status(400).json({ message: `Erro na consulta ao SintegraAWS: ${error}` })
  }

}

module.exports = {
  getCNPJInfo,
  getIncricaoEstadual
};
