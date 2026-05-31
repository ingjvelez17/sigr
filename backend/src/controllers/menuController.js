const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

// Categorias

async function listCategories(_req, res) {
  try {
    const categories = await Category.findAll();
    return res.status(200).json(categories);
  } catch (err) {
    console.error('[menuController.listCategories]', err.message);
    return res.status(500).json({ error: 'Error al listar categorias' });
  }
}

async function createCategory(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'El nombre es requerido' });

    const category = await Category.create({ name, description });
    return res.status(201).json(category);
  } catch (err) {
    console.error('[menuController.createCategory]', err.message);
    return res.status(500).json({ error: 'Error al crear categoria' });
  }
}

async function updateCategory(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const category = await Category.update(id, req.body);
    if (!category) return res.status(404).json({ error: 'Categoria no encontrada' });
    return res.status(200).json(category);
  } catch (err) {
    console.error('[menuController.updateCategory]', err.message);
    return res.status(500).json({ error: 'Error al actualizar categoria' });
  }
}

async function deleteCategory(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const removed = await Category.remove(id);
    if (!removed) return res.status(404).json({ error: 'Categoria no encontrada' });
    return res.status(200).json({ message: 'Categoria eliminada' });
  } catch (err) {
    console.error('[menuController.deleteCategory]', err.message);
    return res.status(500).json({ error: 'Error al eliminar categoria' });
  }
}

// Platos

async function listMenuItems(req, res) {
  try {
    const { available, categoryId } = req.query;
    const filters = {};
    if (available !== undefined) filters.available = available === 'true';
    if (categoryId) filters.categoryId = parseInt(categoryId, 10);

    const items = await MenuItem.findAll(filters);
    return res.status(200).json(items);
  } catch (err) {
    console.error('[menuController.listMenuItems]', err.message);
    return res.status(500).json({ error: 'Error al listar platos' });
  }
}

async function getMenuItem(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await MenuItem.findById(id);
    if (!item) return res.status(404).json({ error: 'Plato no encontrado' });
    return res.status(200).json(item);
  } catch (err) {
    console.error('[menuController.getMenuItem]', err.message);
    return res.status(500).json({ error: 'Error al obtener plato' });
  }
}

async function createMenuItem(req, res) {
  try {
    const { name, description, price, categoryId, available, imageUrl } = req.body;
    if (!name || price === undefined || !categoryId) {
      return res.status(400).json({ error: 'name, price y categoryId son requeridos' });
    }
    const item = await MenuItem.create({
      name,
      description,
      price: parseFloat(price),
      categoryId: parseInt(categoryId, 10),
      available,
      imageUrl
    });
    return res.status(201).json(item);
  } catch (err) {
    console.error('[menuController.createMenuItem]', err.message);
    return res.status(500).json({ error: err.message || 'Error al crear plato' });
  }
}

async function updateMenuItem(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const item = await MenuItem.update(id, req.body);
    if (!item) return res.status(404).json({ error: 'Plato no encontrado' });
    return res.status(200).json(item);
  } catch (err) {
    console.error('[menuController.updateMenuItem]', err.message);
    return res.status(500).json({ error: 'Error al actualizar plato' });
  }
}

async function deleteMenuItem(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const removed = await MenuItem.remove(id);
    if (!removed) return res.status(404).json({ error: 'Plato no encontrado' });
    return res.status(200).json({ message: 'Plato eliminado' });
  } catch (err) {
    console.error('[menuController.deleteMenuItem]', err.message);
    return res.status(500).json({ error: 'Error al eliminar plato' });
  }
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
