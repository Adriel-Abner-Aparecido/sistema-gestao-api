const { verificaChave } = require("../models/downloadModel")

const downloadDesktop = async (req, res) => {

    const { Chave } = req.body

    const [consulta] = await verificaChave(Chave)

    const LinkArquivo = "https://apploja.com/pro/setup"

    if (consulta) {
        console.log(consulta)
        return res.status(200).json({ code: 200, status: 'success', data: LinkArquivo })
    }

    res.status(404).json({ code: 404, status: 'error', data: "Chave não existe. Informe uma chave válida" })

}

module.exports = {
    downloadDesktop
}