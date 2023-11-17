'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  // 传入加密字符串
  const jwt = middleware.jwt(app.config.jwt.secret);

  // 测试服务器是否存活
  router.get('/', controller.home.index);
  // 用户注册
  router.post('/api/user/register', controller.user.register);
  // 用户登录
  router.post('/api/user/login', controller.user.login);
  // 获取用户信息
  router.get('/api/user/info', jwt, controller.user.getUserInfo);
};
