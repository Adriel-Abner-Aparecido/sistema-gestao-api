const subcategoriaModel = require('../models/subcategoriaModel');

const getAll = async (req, res) => {

    const [subcategoria] = await subcategoriaModel.getAll(req.usuario);

    return res.status(200).json(subcategoria);
};

const getByCategoria = async (req, res) => {
    const { categoriaid } = req.params;

    const [subcategoria] = await subcategoriaModel.getByCategoria(categoriaid, req.usuario);

    return res.status(200).json(subcategoria);
};

const createSubcategoria = async (req, res) => {
    const createdSubcategoria = await subcategoriaModel.createSubcategoria(req.body, req.usuario);

    if (createdSubcategoria.erro !== undefined) {
        return res.status(400).json({ erro: createdSubcategoria.erro })
    } else {
        return res.status(201).json(createdSubcategoria);
    }

}

const deleteSubcategoria = async (req, res) => {
    const { id } = req.params;

    const deletedSubcategoria = await subcategoriaModel.deleteSubcategoria(id);
    return res.status(204).json(deletedSubcategoria);
}

const updateSubcategoria = async (req, res) => {
    const { id } = req.params;

    const updatedSubcategoria = await subcategoriaModel.updateSubcategoria(id, req.body, req.usuario)

    if (updatedSubcategoria.erro !== undefined) {
        return res.status(400).json({ erro: updatedSubcategoria.erro })
    } else {
        return res.status(201).json(updatedSubcategoria);
    }
}

module.exports = {
    getAll,
    getByCategoria,
    createSubcategoria,
    deleteSubcategoria,
    updateSubcategoria
};