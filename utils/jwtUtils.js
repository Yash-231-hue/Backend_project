const jwt = require('jsonwebtoken');

// Generate JWT token
exports.generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

// Send token response
exports.sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = exports.generateToken(user.id);

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
};

// New function to send token as HttpOnly cookie
exports.sendTokenResponseWithCookie = (user, statusCode, res, message = 'Success') => {
  const token = exports.generateToken(user.id);

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 24) * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    message,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
};
