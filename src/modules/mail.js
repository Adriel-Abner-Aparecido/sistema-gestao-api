const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.MAIL_KEY;

const enviarEmail = async (dataEmail) => {
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "Recuperação de senha APPLoja";
  sendSmtpEmail.htmlContent = "<html><body><p>Olá {{params.nome}}</p></br><p>Precisa redefinir sua senha?</p><p>Use seu token secreto!</p></br><p>{{params.token}}</p></br><p>Clique no botão abaixo e digite o token acima.</p><a href='https://app.apploja.com/recuperar?token={{params.token}}'><button>Alterar Senha</button></a></br><p>Se você não esqueceu sua senha, pode ignorar este e-mail.</p></body></html>";
  sendSmtpEmail.sender = { "name": "Ivan do APPLoja", "email": "contato@apploja.com" };
  sendSmtpEmail.to = [{ "email": dataEmail.email, "name": dataEmail.nome }];
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "token": dataEmail.token, "nome": dataEmail.nome };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
  }, function (error) {
    console.error(error);
  });
}

module.exports = {
  enviarEmail
}