const { updateEmpresaPlanoId } = require("../models/empresaModel")
const { numeroIndicacoes } = require("../models/indicacaoModel")
const { buscaPlano } = require("../models/planosModal")

const ativarPlanoPorIndicacao = async (req, res) => {

    const { id } = req.body
    const { usuario } = req

    if (!id || typeof id === "string") {
        return res.status(404).json({ message: "Informe um id valido" })
    }

    const verificaPlano = await buscaPlano(id)

    if (!verificaPlano) {
        return res.status(404).json({ message: "Este plano não existe!" })
    }

    const indicacoesValidas = await numeroIndicacoes(usuario.empresa_id)

    if (id === 1) {
        return res.status(200).json({ message: "Voce esta no plano Gratuito" })
    }

    if (id === 2 && indicacoesValidas < 5) {
        return res.status(400).json({ message: "Quantidade de indicações insulficientes para ativar o plano Bronze" })
    }

    if (id === 3 && indicacoesValidas < 15) {
        return res.status(400).json({ message: "Quantidade de indicações insulficientes para ativar o plano Prata" })
    }

    if (id === 4 && indicacoesValidas < 25) {
        return res.status(400).json({ message: "Quantidade de indicações insulficientes para ativar o plano Ouro" })
    }

    const atualizaPlano = await updateEmpresaPlanoId(usuario.empresa_id, id)

    if (atualizaPlano.affectedRows === 1) {
        return res.status(201).json({ message: "Parabens! Plano atualizado com sucesso." })
    }

}

module.exports = {
    ativarPlanoPorIndicacao
}