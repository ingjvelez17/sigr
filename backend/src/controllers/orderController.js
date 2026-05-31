const Order = require('../models/Order');

async function listOrders(req, res) {
  try {
    const { status } = req.query;
    const orders = await Order.findAll({ status });
    return res.status(200).json(orders);
  } catch (err) {
    console.error('[orderController.listOrders]', err.message);
    return res.status(500).json({ error: 'Error al listar pedidos' });
  }
}

async function getOrder(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
    return res.status(200).json(order);
  } catch (err) {
    console.error('[orderController.getOrder]', err.message);
    return res.status(500).json({ error: 'Error al obtener pedido' });
  }
}

async function createOrder(req, res) {
  try {
    const { tableNumber, notes, items, customerId } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un item' });
    }

    const order = await Order.create({
      customerId: customerId || (req.user && req.user.role === 'cliente' ? req.user.id : null),
      waiterId: req.user && req.user.role === 'mesero' ? req.user.id : null,
      tableNumber,
      notes,
      items
    });

    if (req.io) {
      req.io.to('kitchen').emit('order:new', order);
      req.io.to('waiter').emit('order:new', order);
    }

    return res.status(201).json(order);
  } catch (err) {
    console.error('[orderController.createOrder]', err.message);
    return res.status(400).json({ error: err.message || 'Error al crear pedido' });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'El estado es requerido' });

    const order = await Order.updateStatus(id, status);
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });

    if (req.io) {
      req.io.emit('order:updated', { id: order.id, status: order.status });
    }

    return res.status(200).json(order);
  } catch (err) {
    console.error('[orderController.updateOrderStatus]', err.message);
    return res.status(400).json({ error: err.message || 'Error al actualizar pedido' });
  }
}

async function deleteOrder(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const removed = await Order.remove(id);
    if (!removed) return res.status(404).json({ error: 'Pedido no encontrado' });
    return res.status(200).json({ message: 'Pedido eliminado' });
  } catch (err) {
    console.error('[orderController.deleteOrder]', err.message);
    return res.status(500).json({ error: 'Error al eliminar pedido' });
  }
}

module.exports = {
  listOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder
};
