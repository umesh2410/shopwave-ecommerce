const express = require('express');
const { body, param } = require('express-validator');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Controllers
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories } = require('../controllers/productController');
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { createOrder, getOrders, getOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const { getAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

// ============================================================
// AUTH ROUTES
// ============================================================
router.post('/auth/register', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
], register);

router.post('/auth/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], login);

router.get('/auth/profile', authenticate, getProfile);
router.put('/auth/profile', authenticate, updateProfile);

// ============================================================
// PRODUCT ROUTES
// ============================================================
router.get('/products/categories', getCategories);
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.post('/products', authenticate, authorizeAdmin, createProduct);
router.put('/products/:id', authenticate, authorizeAdmin, updateProduct);
router.delete('/products/:id', authenticate, authorizeAdmin, deleteProduct);

// ============================================================
// CART ROUTES
// ============================================================
router.get('/cart', authenticate, getCart);
router.post('/cart', authenticate, addToCart);
router.put('/cart/:id', authenticate, updateCartItem);
router.delete('/cart/:id', authenticate, removeFromCart);
router.delete('/cart', authenticate, clearCart);

// ============================================================
// ORDER ROUTES
// ============================================================
router.post('/orders', authenticate, createOrder);
router.get('/orders', authenticate, getOrders);
router.get('/orders/:id', authenticate, getOrder);

// ============================================================
// PAYMENT ROUTES
// ============================================================
router.post('/payment/create-order', authenticate, createPaymentOrder);
router.post('/payment/verify', authenticate, verifyPayment);

// ============================================================
// ADMIN ROUTES
// ============================================================
router.get('/admin/orders', authenticate, authorizeAdmin, getAllOrders);
router.put('/admin/orders/:id/status', authenticate, authorizeAdmin, updateOrderStatus);
router.get('/admin/analytics', authenticate, authorizeAdmin, getAnalytics);

module.exports = router;
