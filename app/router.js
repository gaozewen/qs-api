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

  // 新建问卷
  router.post('/api/questionnaire', jwt, controller.questionnaire.create);
  // 获取（查询）问卷列表
  router.get('/api/questionnaire', jwt, controller.questionnaire.list);
  // 获取单个问卷信息 【不需要 JWT，因为在客户端答卷页需要使用】
  router.get('/api/questionnaire/:id', controller.questionnaire.item);
  // 更新问卷
  router.patch('/api/questionnaire/:id', jwt, controller.questionnaire.patch);
  // 复制问卷
  router.post(
    '/api/questionnaire/duplicate/:id',
    jwt,
    controller.questionnaire.duplicate
  );
  // 批量彻底删除问卷
  router.delete('/api/questionnaire', jwt, controller.questionnaire.delete);

  // 新建答卷
  router.post('/api/answer', controller.answer.create);

  // 答卷统计列表
  router.get('/api/statistic/:questionnaireId', jwt, controller.statistic.list);
};
