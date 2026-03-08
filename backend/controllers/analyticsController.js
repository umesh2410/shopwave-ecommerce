const { query } = require('../config/database');

// GET /api/admin/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const [
      ordersResult,
      revenueResult,
      topProductsResult,
      recentOrdersResult,
      ordersByStatusResult,
      monthlySalesResult,
    ] = await Promise.all([
      query("SELECT COUNT(*) as total FROM orders WHERE payment_status = 'paid'"),
      query("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid'"),
      query(`
        SELECT p.name, p.image_url, SUM(oi.quantity) as units_sold, 
               SUM(oi.quantity * oi.price) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.payment_status = 'paid'
        GROUP BY p.id, p.name, p.image_url
        ORDER BY units_sold DESC LIMIT 5
      `),
      query(`
        SELECT o.id, o.total_amount, o.order_status, o.created_at,
               u.name as customer_name, u.email as customer_email
        FROM orders o JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC LIMIT 10
      `),
      query(`
        SELECT order_status, COUNT(*) as count
        FROM orders GROUP BY order_status
      `),
      query(`
        SELECT DATE_TRUNC('month', created_at) as month,
               COUNT(*) as orders,
               COALESCE(SUM(total_amount), 0) as revenue
        FROM orders WHERE payment_status = 'paid'
        AND created_at >= NOW() - INTERVAL '6 months'
        GROUP BY month ORDER BY month ASC
      `),
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalOrders: parseInt(ordersResult.rows[0].total),
          totalRevenue: parseFloat(revenueResult.rows[0].total),
        },
        topProducts: topProductsResult.rows,
        recentOrders: recentOrdersResult.rows,
        ordersByStatus: ordersByStatusResult.rows,
        monthlySales: monthlySalesResult.rows,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics };
