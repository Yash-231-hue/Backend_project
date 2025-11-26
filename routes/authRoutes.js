const express = require('express');
const router = express.Router();
const { register, login, getMe, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { sanitizeInput, validateAuth, rateLimit } = require('../middleware/sanitize');

// Apply rate limiting to auth routes
router.use(rateLimit(20, 60000)); // 20 requests per minute

router.post('/register', sanitizeInput, validateAuth, register);
router.post('/login', sanitizeInput, validateAuth, login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, sanitizeInput, validateAuth, updatePassword);

module.exports = router;