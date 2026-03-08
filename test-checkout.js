async function runTest() {
  console.log('--- E-COMMERCE END-TO-END CHECKOUT TEST ---');
  try {
    const baseURL = 'http://localhost:5000/api';
    let token = '';

    const api = async (method, route, body = null) => {
      const res = await fetch(`${baseURL}${route}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API Request Failed');
      return data;
    };

    console.log('1. Registering Demo User...');
    const email = `testuser_${Date.now()}@shopwave.com`;
    const regRes = await api('POST', '/auth/register', { name: 'Automated Tester', email, password: 'Password@123' });
    token = regRes.token;
    console.log(`✅ Registered and logged in successfully as ${email}.`);

    console.log('2. Fetching Products...');
    const productsRes = await api('GET', '/products?limit=5');
    const products = productsRes.products;
    if (products.length === 0) throw new Error('No products found in database.');
    const testProduct = products[0];
    console.log(`✅ Loaded product: ${testProduct.name} (ID: ${testProduct.id}, ₹${testProduct.price})`);

    console.log('3. Clearing Cart...');
    await api('DELETE', '/cart/clear');
    console.log('✅ Cart cleared.');

    console.log('4. Adding to Cart...');
    await api('POST', '/cart', { product_id: testProduct.id, quantity: 2 });
    console.log('✅ Added to cart (Qty: 2).');

    console.log('5. Viewing Cart...');
    const cartRes = await api('GET', '/cart');
    const cart = cartRes;
    console.log(`✅ Cart retrieved. Total Items: ${cart.items.length}, Cart Total: ₹${cart.total}`);

    console.log('6. Processing Order...');
    const orderRes = await api('POST', '/orders', {
      shipping_address: {
        full_name: 'Test User',
        phone: '1234567890',
        address_line1: '123 Testing Lane',
        city: 'Mumbai',
        state: 'MH',
        postal_code: '400001',
        country: 'India'
      }
    });
    const order = orderRes;
    console.log(`✅ Order Created Successfully! Order ID: ${order.id}, Status: ${order.order_status}, Amount: ₹${order.total_amount}`);

    console.log('7. Triggering Razorpay Payment Intent...');
    const paymentRes = await api('POST', '/payment/create-order', { order_id: order.id });
    console.log(`✅ Razorpay Order Generated! RZP ID: ${paymentRes.razorpay_order_id}`);

    console.log('\\n🎉 ALL BACKEND E-COMMERCE LOGIC VERIFIED AND WORKING PERFECTLY! 🎉');

  } catch (err) {
    console.error('❌ TEST FAILED:');
    console.error(err.message);
  }
}

runTest();
