/* eslint valid-jsdoc: "off" */

'use strict';

const { config } = require('dotenv');
const { IS_DEV } = require('../app/constant');

config({ path: IS_DEV ? '.env' : '/etc/qs-api/.env' });
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
      url: process.env.MONGO_URI,
      options: {
        dbName: process.env.DB_NAME,
      },
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
    myAppName: 'qs-api',
  };

  return {
    ...config,
    ...userConfig,
  };
};
