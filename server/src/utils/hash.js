const crypto = require('crypto');

/**
 * Lightweight hash helper to avoid storing plain-text passwords
 * for demo user verification.
 */
function hashPassword(password) {
  if (!password) return '';
  return crypto.createHash('sha256').update(String(password).trim()).digest('hex');
}

module.exports = {
  hashPassword
};
