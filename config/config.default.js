/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1700094986092_1043';

  // add your middleware config here
  config.middleware = [];

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/qs-sys',
      options: {},
    },
  };

  config.security = {
    domainWhiteList: [
      'localhost',
      '.gaozewen.com',
      '.alipay.com',
      'open.weixin.qq.com',
    ],
    // 使用 JWT 避免 CSRF 攻击
    csrf: {
      enable: false,
    },
  };

  config.jwt = {
    secret: 'gzw-qs-api-jwt',
  };

  // 解决跨域问题
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
