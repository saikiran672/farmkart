const router = require('express').Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const {
  placeOrder,
  getOrders,
  getOrder,
  updateOrderStatus
} = require('../controllers/orderController');

router.post('/', auth, placeOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrder);
router.put('/:id/status', auth, authorize('farmer'), updateOrderStatus);

module.exports = router;
