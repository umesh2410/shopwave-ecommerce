const db = require('../config/db');

exports.getCart = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1`,
      [req.user.id]
    );
    const total = result.rows.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ items: result.rows, total });
  } catch (err) { next(err); }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const product = await db.query('SELECT id, stock FROM products WHERE id = $1 AND is_active = true', [product_id]);
    if (!product.rows[0]) return res.status(404).json({ error: 'Product not found' });
    if (product.rows[0].stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });
    const result = await db.query(
      `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + $3, updated_at = NOW() RETURNING *`,
      [req.user.id, product_id, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      await db.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
      return res.json({ message: 'Item removed' });
    }
    const result = await db.query(
      'UPDATE cart SET quantity = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
      [quantity, req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Cart item not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    await db.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Item removed from cart' });
  } catch (err) { next(err); }
};

exports.clearCart = async (req, res, next) => {
  try {
    await db.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'Cart cleared' });
  } catch (err) { next(err); }
};
