const { ERROR_JWT_EXPIRED, ERROR_JWT_UNSET } = require('../constant/errno');

module.exports = secret => {
  return async function jwt(ctx, next) {
    const token = ctx.request.header.token; // 若是没有 token，返回的是 null 字符串
    if (token !== 'null' && token) {
      try {
        // 验证token
        // const decode = ctx.app.jwt.verify(token, secret); // 查看登录用户是谁，可以打印到控制台
        ctx.app.jwt.verify(token, secret);
        await next();
      } catch (error) {
        console.error('【Error-JWT】', error);
        ctx.status = 200;
        ctx.body = {
          errno: ERROR_JWT_EXPIRED,
          msg: 'Token 已过期，请重新登录',
        };
        return;
      }
      return;
    }
    // 未设置 token
    ctx.status = 200;
    ctx.body = {
      errno: ERROR_JWT_UNSET,
      msg: 'Token 未设置',
    };
    return;
  };
};
