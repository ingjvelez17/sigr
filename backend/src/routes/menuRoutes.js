const express = require('express');
const router = express.Router();

const menuController = require('../controllers/menuController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Categorias
router.get('/categories', menuController.listCategories);
router.post('/categories', authenticate, authorize('admin'), menuController.createCategory);
router.put('/categories/:id', authenticate, authorize('admin'), menuController.updateCategory);
router.delete('/categories/:id', authenticate, authorize('admin'), menuController.deleteCategory);

// Platos
router.get('/items', menuController.listMenuItems);
router.get('/items/:id', menuController.getMenuItem);
router.post('/items', authenticate, authorize('admin'), menuController.createMenuItem);
router.put('/items/:id', authenticate, authorize('admin'), menuController.updateMenuItem);
router.delete('/items/:id', authenticate, authorize('admin'), menuController.deleteMenuItem);

module.exports = router;
