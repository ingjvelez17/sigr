const Reservation = require('../models/Reservation');

async function listReservations(req, res) {
  try {
    const { status, date } = req.query;
    const reservations = await Reservation.findAll({ status, date });
    return res.status(200).json(reservations);
  } catch (err) {
    console.error('[reservationController.listReservations]', err.message);
    return res.status(500).json({ error: 'Error al listar reservas' });
  }
}

async function getReservation(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });
    return res.status(200).json(reservation);
  } catch (err) {
    console.error('[reservationController.getReservation]', err.message);
    return res.status(500).json({ error: 'Error al obtener reserva' });
  }
}

async function listMyReservations(req, res) {
  try {
    const reservations = await Reservation.findByCustomer(req.user.id);
    return res.status(200).json(reservations);
  } catch (err) {
    console.error('[reservationController.listMyReservations]', err.message);
    return res.status(500).json({ error: 'Error al listar reservas' });
  }
}

async function createReservation(req, res) {
  try {
    const { reservationDate, reservationTime, tableNumber, partySize, notes } = req.body;
    if (!reservationDate || !reservationTime || !tableNumber || !partySize) {
      return res.status(400).json({
        error: 'reservationDate, reservationTime, tableNumber y partySize son requeridos'
      });
    }

    const reservation = await Reservation.create({
      customerId: req.user.id,
      reservationDate,
      reservationTime,
      tableNumber: parseInt(tableNumber, 10),
      partySize: parseInt(partySize, 10),
      notes
    });
    return res.status(201).json(reservation);
  } catch (err) {
    console.error('[reservationController.createReservation]', err.message);
    return res.status(400).json({ error: err.message || 'Error al crear reserva' });
  }
}

async function updateReservationStatus(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'El estado es requerido' });

    const reservation = await Reservation.updateStatus(id, status);
    if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });
    return res.status(200).json(reservation);
  } catch (err) {
    console.error('[reservationController.updateReservationStatus]', err.message);
    return res.status(400).json({ error: err.message || 'Error al actualizar reserva' });
  }
}

async function deleteReservation(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const removed = await Reservation.remove(id);
    if (!removed) return res.status(404).json({ error: 'Reserva no encontrada' });
    return res.status(200).json({ message: 'Reserva eliminada' });
  } catch (err) {
    console.error('[reservationController.deleteReservation]', err.message);
    return res.status(500).json({ error: 'Error al eliminar reserva' });
  }
}

module.exports = {
  listReservations,
  getReservation,
  listMyReservations,
  createReservation,
  updateReservationStatus,
  deleteReservation
};
