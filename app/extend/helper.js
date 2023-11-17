const crypto = require('crypto');

module.exports = {
  // HMAC 加密算法
  hmac: str => {
    const key = 'gzw-qs-api';
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(str);
    return hmac.digest('hex');
  },
  // 不能是箭头函数，否则获取不到 ctx 和 app
  getUserInfoByToken() {
    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
    const token = this.ctx.request.header.token; // 获取header 的token
    // { _id, username, nickname, exp }
    const decode = this.app.jwt.decode(token);
    return decode;
  },
};
