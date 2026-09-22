const db = require('../db');

/**
 * Middleware to extract the demo user ID from custom headers or query params
 * without complex JWT/session overhead.
 */
async function userContext(req, res, next) {
  try {
    const userIdHeader = req.headers['x-user-id'] || req.query.user_id;

    if (!userIdHeader) {
      return res.status(401).json({
        success: false,
        message: 'No demo user identity provided. Please enter PayTodo first.'
      });
    }

    const userId = parseInt(userIdHeader, 10);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid demo user ID.'
      });
    }

    const result = await db.query('SELECT id, name, created_at FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found in system.'
      });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = userContext;
