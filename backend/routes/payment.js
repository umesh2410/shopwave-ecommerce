const router = require('express').Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
router.use(authenticate);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
module.exports = router;
