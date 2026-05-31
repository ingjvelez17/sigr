const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Caja
router.get('/cash/current', authenticate, authorize('admin', 'mesero'), reportController.currentCashRegister);
router.get('/cash', authenticate, authorize('admin'), reportController.listCashRegisters);
router.post('/cash/open', authenticate, authorize('admin', 'mesero'), reportController.openCashRegister);
router.post('/cash/:id/close', authenticate, authorize('admin', 'mesero'), reportController.closeCashRegister);

// Reportes
router.get('/daily', authenticate, authorize('admin'), reportController.dailySalesReport);
router.get('/history', authenticate, authorize('admin'), reportController.listDailyReports);

module.exports = router;
