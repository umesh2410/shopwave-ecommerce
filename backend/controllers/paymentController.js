const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../config/db');

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
  try {
    const { order_id } = req.body;
    const orderResult = await db.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [order_id, req.user.id]);
    if (!orderResult.rows[0]) return res.status(404).json({ error: 'Order not found' });
    const order = orderResult.rows[0];

    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_xxxxxxxxxxxx') {
      const mockId = 'order_mock_' + Date.now();
      await db.query('UPDATE orders SET razorpay_order_id = $1 WHERE id = $2', [mockId, order.id]);
      return res.json({ razorpay_order_id: mockId, amount: Math.round(order.total_amount * 100), currency: 'INR', key: 'rzp_test_mock' });
    }

    const razorpay = getRazorpay();
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(order.total_amount * 100), // paise
      currency: 'INR',
      receipt: order.id,
    });

    await db.query('UPDATE orders SET razorpay_order_id = $1 WHERE id = $2', [rzpOrder.id, order.id]);
    res.json({ razorpay_order_id: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) { next(err); }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    await db.query(
      `UPDATE orders SET payment_status = 'paid', order_status = 'processing', razorpay_payment_id = $1, updated_at = NOW() WHERE razorpay_order_id = $2`,
      [razorpay_payment_id, razorpay_order_id]
    );
    res.json({ message: 'Payment verified successfully' });
  } catch (err) { next(err); }
};
