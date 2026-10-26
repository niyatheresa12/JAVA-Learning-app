const jwt = require('jsonwebtoken');
const sqlDb = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'javapuff_super_cute_secret_key_2026';

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Koffi requires you to log in!'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = sqlDb.get(
      'SELECT id, username, email, avatar, marks, xp, streak, last_active_date, hearts, threat_level, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists in Koffi\'s records.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed. Please log in again.'
    });
  }
};

module.exports = {
  protect,
  JWT_SECRET
};
