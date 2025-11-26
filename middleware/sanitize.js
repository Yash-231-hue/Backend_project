const validator = require('validator');

// Sanitize and validate input
exports.sanitizeInput = (req, res, next) => {
  // Sanitize all string inputs
  const sanitizeObject = (obj) => {
    const sanitized = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        // Trim whitespace
        let value = obj[key].trim();
        // Escape HTML entities to prevent XSS
        value = validator.escape(value);
        sanitized[key] = value;
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitized[key] = sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
    return sanitized;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  next();
};

// Validate authentication inputs
exports.validateAuth = (req, res, next) => {
  const { username, email, password } = req.body;

  // Username validation
  if (username) {
    if (!validator.isLength(username, { min: 3, max: 50 })) {
      return res.status(400).json({
        success: false,
        message: 'Username must be between 3 and 50 characters'
      });
    }
    if (!validator.isAlphanumeric(username, 'en-US', { ignore: '_' })) {
      return res.status(400).json({
        success: false,
        message: 'Username can only contain letters, numbers, and underscores'
      });
    }
  }

  // Email validation
  if (email) {
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
  }

  // Password validation
  if (password) {
    if (!validator.isLength(password, { min: 6 })) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
  }

  next();
};

// Validate product inputs
exports.validateProduct = (req, res, next) => {
  const { name, price, stock, category } = req.body;

  if (name) {
    if (!validator.isLength(name, { min: 2, max: 100 })) {
      return res.status(400).json({
        success: false,
        message: 'Product name must be between 2 and 100 characters'
      });
    }
  }

  if (price !== undefined) {
    if (!validator.isFloat(String(price), { min: 0 })) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }
  }

  if (stock !== undefined) {
    if (!validator.isInt(String(stock), { min: 0 })) {
      return res.status(400).json({
        success: false,
        message: 'Stock must be a non-negative integer'
      });
    }
  }

  if (category) {
    if (!validator.isLength(category, { max: 50 })) {
      return res.status(400).json({
        success: false,
        message: 'Category must be less than 50 characters'
      });
    }
  }

  next();
};

// Rate limiting helper
const requestCounts = new Map();

exports.rateLimit = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const requests = requestCounts.get(ip);
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);

    // Cleanup old entries every 5 minutes
    if (Math.random() < 0.01) {
      for (const [key, value] of requestCounts.entries()) {
        const filtered = value.filter(time => now - time < windowMs);
        if (filtered.length === 0) {
          requestCounts.delete(key);
        } else {
          requestCounts.set(key, filtered);
        }
      }
    }

    next();
  };
};