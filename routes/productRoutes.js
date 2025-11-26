const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { sanitizeInput, validateProduct, rateLimit } = require('../middleware/sanitize');

// Apply rate limiting
router.use(rateLimit(50, 60000)); // 50 requests per minute

router.get('/', protect, getProducts);
router.get('/my-products', protect, getMyProducts);
router.get('/:id', protect, getProduct);
router.post('/', protect, sanitizeInput, validateProduct, createProduct);
router.put('/:id', protect, sanitizeInput, validateProduct, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
