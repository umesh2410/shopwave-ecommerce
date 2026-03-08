const db = require('../config/db');

exports.getDashboard = async (req, res, next) => {
  try {
    const [ordersRes, revenueRes, usersRes, productsRes, recentOrdersRes, topProductsRes] = await Promise.all([
      db.query("SELECT COUNT(*) FROM orders"),
      db.query("SELECT COALESCE(SUM(total_amount), 0) as revenue FROM orders WHERE payment_status = 'paid'"),
      db.query("SELECT COUNT(*) FROM users WHERE role = 'customer'"),
      db.query("SELECT COUNT(*) FROM products WHERE is_active = true"),
      db.query(`SELECT o.id, o.total_amount, o.order_status, o.created_at, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 5`),
      db.query(`SELECT p.name, p.image_url, SUM(oi.quantity) as total_sold, SUM(oi.price * oi.quantity) as revenue FROM order_items oi JOIN products p ON oi.product_id = p.id GROUP BY p.id, p.name, p.image_url ORDER BY total_sold DESC LIMIT 5`),
    ]);

    res.json({
      stats: {
        total_orders: parseInt(ordersRes.rows[0].count),
        total_revenue: parseFloat(revenueRes.rows[0].revenue),
        total_customers: parseInt(usersRes.rows[0].count),
        total_products: parseInt(productsRes.rows[0].count),
      },
      recent_orders: recentOrdersRes.rows,
      top_products: topProductsRes.rows,
    });
  } catch (err) { next(err); }
};
