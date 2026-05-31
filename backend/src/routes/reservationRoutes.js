const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservationController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/', authenticate, authorize('admin', 'mesero'), reservationController.listReservations);
router.get('/me', authenticate, reservationController.listMyReservations);
router.get('/:id', authenticate, reservationController.getReservation);
router.post('/', authenticate, reservationController.createReservation);
router.patch('/:id/status', authenticate, authorize('admin', 'mesero'), reservationController.updateReservationStatus);
router.delete('/:id', authenticate, authorize('admin'), reservationController.deleteReservation);

module.exports = router;
