const router = require('express').Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const {
  getAllProducts,
  getProduct,
  getFarmerProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.get('/farmer/me', auth, authorize('farmer'), getFarmerProducts);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', auth, authorize('farmer'), createProduct);
router.put('/:id', auth, authorize('farmer'), updateProduct);
router.delete('/:id', auth, authorize('farmer'), deleteProduct);

module.exports = router;
