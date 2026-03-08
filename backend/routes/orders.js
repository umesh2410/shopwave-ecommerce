const router = require('express').Router();
const { createOrder, getOrders, getOrder, updateOrderStatus } = require('../controllers/orderController');
const { authenticate, requireManager } = require('../middleware/auth');
router.use(authenticate);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', requireManager, updateOrderStatus);
module.exports = router;
