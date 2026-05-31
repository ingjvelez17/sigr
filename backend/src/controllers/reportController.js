const CashRegister = require('../models/CashRegister');
const OrderItem = require('../models/OrderItem');
const { query } = require('../config/database');

// Caja

async function openCashRegister(req, res) {
  try {
    const { openingAmount, notes } = req.body;
    if (openingAmount === undefined) {
      return res.status(400).json({ error: 'openingAmount es requerido' });
    }
    const reg = await CashRegister.open({
      userId: req.user.id,
      openingAmount: parseFloat(openingAmount),
      notes
    });
    return res.status(201).json(reg);
  } catch (err) {
    console.error('[reportController.openCashRegister]', err.message);
    return res.status(400).json({ error: err.message });
  }
}

async function closeCashRegister(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { closingAmount, notes } = req.body;
    if (closingAmount === undefined) {
      return res.status(400).json({ error: 'closingAmount es requerido' });
    }
    const reg = await CashRegister.close({
      id,
      userId: req.user.id,
      closingAmount: parseFloat(closingAmount),
      notes
    });
    return res.status(200).json(reg);
  } catch (err) {
    console.error('[reportController.closeCashRegister]', err.message);
    return res.status(400).json({ error: err.message });
  }
}

async function currentCashRegister(_req, res) {
  try {
    const reg = await CashRegister.findCurrent();
    return res.status(200).json(reg || { status: 'cerrada' });
  } catch (err) {
    console.error('[reportController.currentCashRegister]', err.message);
    return res.status(500).json({ error: 'Error al obtener caja actual' });
  }
}

async function listCashRegisters(_req, res) {
  try {
    const list = await CashRegister.findAll();
    return res.status(200).json(list);
  } catch (err) {
    console.error('[reportController.listCashRegisters]', err.message);
    return res.status(500).json({ error: 'Error al listar cajas' });
  }
}

// Reportes

async function dailySalesReport(req, res) {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const from = `${date} 00:00:00`;
    const to = `${date} 23:59:59`;

    const summary = await query(
      `SELECT
         COUNT(*)::int AS total_orders,
         COALESCE(SUM(total), 0)::numeric AS total_sales,
         COALESCE(AVG(total), 0)::numeric AS average_order
       FROM orders
       WHERE status = 'entregado'
         AND created_at BETWEEN $1 AND $2`,
      [from, to]
    );

    const topItems = await OrderItem.findTopSelling(5, from, to);

    const byCategory = await query(
      `SELECT c.name AS category,
              COUNT(oi.id)::int AS items_sold,
              COALESCE(SUM(oi.subtotal), 0)::numeric AS revenue
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       JOIN menu_items m ON m.id = oi.menu_item_id
       JOIN categories c ON c.id = m.category_id
       WHERE o.status = 'entregado'
         AND o.created_at BETWEEN $1 AND $2
       GROUP BY c.name
       ORDER BY revenue DESC`,
      [from, to]
    );

    const report = {
      date,
      summary: summary.rows[0],
      topItems,
      byCategory: byCategory.rows
    };

    await query(
      `INSERT INTO daily_reports (report_date, total_orders, total_sales, average_order, data)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (report_date) DO UPDATE
         SET total_orders = EXCLUDED.total_orders,
             total_sales = EXCLUDED.total_sales,
             average_order = EXCLUDED.average_order,
             data = EXCLUDED.data,
             generated_at = NOW()`,
      [
        date,
        report.summary.total_orders,
        report.summary.total_sales,
        report.summary.average_order,
        JSON.stringify(report)
      ]
    );

    return res.status(200).json(report);
  } catch (err) {
    console.error('[reportController.dailySalesReport]', err.message);
    return res.status(500).json({ error: 'Error al generar reporte diario' });
  }
}

async function listDailyReports(_req, res) {
  try {
    const result = await query(
      'SELECT * FROM daily_reports ORDER BY report_date DESC LIMIT 30'
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('[reportController.listDailyReports]', err.message);
    return res.status(500).json({ error: 'Error al listar reportes' });
  }
}

module.exports = {
  openCashRegister,
  closeCashRegister,
  currentCashRegister,
  listCashRegisters,
  dailySalesReport,
  listDailyReports
};
