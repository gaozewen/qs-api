const crypto = require('crypto');

module.exports = {
  // HMAC 加密算法
  hmac: str => {
    const key = 'gzw-qs-api';
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(str);
    return hmac.digest('hex');
  },
};
