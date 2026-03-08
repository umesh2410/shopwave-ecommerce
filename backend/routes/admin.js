const router = require('express').Router();
const { getDashboard } = require('../controllers/adminController');
const { authenticate, requireManager } = require('../middleware/auth');
router.use(authenticate, requireManager);
router.get('/dashboard', getDashboard);
module.exports = router;
