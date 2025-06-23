const jwt = require('jsonwebtoken');

const VerificaToken = (req, res) => {

    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        req.usuario = decode;

        res.status(200).json({ status: "success" })

    } catch (error) {
        return res.status(401).send({ mensagem: 'falha na autenticação' })
    }
}

module.exports = { VerificaToken }