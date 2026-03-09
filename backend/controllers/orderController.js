const db = require('../config/db');
const { sendOrderConfirmationEmail } = require('../utils/mailer');

exports.createOrder = async (req, res, next) => {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const { address_id, notes } = req.body;

    // Get cart items
    const cartResult = await client.query(
      `SELECT c.quantity, p.id as product_id, p.price, p.stock, p.name FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1`,
      [req.user.id]
    );
    if (!cartResult.rows.length) return res.status(400).json({ error: 'Cart is empty' });

    // Check stock
    for (const item of cartResult.rows) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Insufficient stock for ${item.name}` });
      }
    }

    const subtotal = cartResult.rows.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 999 ? 0 : 49;
    const total = subtotal + tax + shipping;

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, address_id, total_amount, notes) VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, address_id || null, total, notes || null]
    );
    const order = orderResult.rows[0];

    // Create order items & update stock
    for (const item of cartResult.rows) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, item.price]
      );
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
    }

    // Clear cart
    await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
    await client.query('COMMIT');

    // Send confirmation email mapping user data
    sendOrderConfirmationEmail(req.user.email, order).catch(console.error);

    res.status(201).json(order);
  } catch (err) { await client.query('ROLLBACK'); next(err); }
  finally { client.release(); }
};

exports.getOrders = async (req, res, next) => {
  try {
    const fetchAll = req.user.role === 'admin' && req.query.all === 'true';
    const result = await db.query(
      `SELECT o.*, u.name as user_name, u.email as user_email,
        (SELECT json_agg(json_build_object('id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price, 'name', p.name, 'image', p.image_url))
         FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items
       FROM orders o JOIN users u ON o.user_id = u.id ${fetchAll ? '' : 'WHERE o.user_id = $1'} ORDER BY o.created_at DESC`,
      fetchAll ? [] : [req.user.id]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
};

exports.getOrder = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT o.*, u.name as user_name,
        (SELECT json_agg(json_build_object('id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price, 'name', p.name, 'image', p.image_url))
         FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items
       FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = $1 ${req.user.role !== 'admin' ? 'AND o.user_id = $2' : ''}`,
      req.user.role !== 'admin' ? [req.params.id, req.user.id] : [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { order_status, payment_status } = req.body;
    const result = await db.query(
      `UPDATE orders SET order_status = COALESCE($1, order_status), payment_status = COALESCE($2, payment_status), updated_at = NOW() WHERE id = $3 RETURNING *`,
      [order_status, payment_status, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};
