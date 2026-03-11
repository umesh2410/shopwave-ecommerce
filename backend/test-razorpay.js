require('dotenv').config();
const Razorpay = require('razorpay');

async function testRazorpay() {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    console.log('Testing Razorpay order creation with amount 50000, receipt test_order_123');
    const rzpOrder = await razorpay.orders.create({
      amount: 50000,
      currency: 'INR',
      receipt: 'test_order_123',
    });
    console.log('Success:', rzpOrder.id);
  } catch(err) {
    console.error('FAILED with error:', err);
  }
}

testRazorpay();
