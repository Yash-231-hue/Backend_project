const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { sanitizeInput, validateAuth, rateLimit } = require('../middleware/sanitize');

// Apply rate limiting and authorization
router.use(rateLimit(30, 60000)); // 30 requests per minute
router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', sanitizeInput, validateAuth, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
