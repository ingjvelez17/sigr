const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/', authenticate, orderController.listOrders);
router.get('/:id', authenticate, orderController.getOrder);
router.post('/', authenticate, orderController.createOrder);
router.patch('/:id/status', authenticate, authorize('admin', 'mesero'), orderController.updateOrderStatus);
router.delete('/:id', authenticate, authorize('admin'), orderController.deleteOrder);

module.exports = router;
