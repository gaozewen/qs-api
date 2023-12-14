/* eslint valid-jsdoc: "off" */

'use strict';

module.exports = () => {
  const config = (exports = {});

  config.logger = {
    // 不输出任何日志信息
    level: 'silent',
  };

  config.mongoose = {
    client: {
      // docker 容器连接宿主机 localhost
      url: 'mongodb://172.17.0.1/qs-sys',
      options: {},
    },
  };

  return {
    ...config,
  };
};
