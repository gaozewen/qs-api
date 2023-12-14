/* eslint valid-jsdoc: "off" */

'use strict';

module.exports = () => {
  const config = (exports = {});

  config.logger = {
    // 关闭所有打印到文件的日志
    level: 'NONE',
  };

  config.mongoose = {
    client: {
      // docker 容器连接宿主机 localhost
      // url: 'mongodb://172.17.0.1:27017/qs-sys',
      url: 'mongodb://host.docker.internal:27017/qs-sys',
      options: {},
    },
  };

  return {
    ...config,
  };
};
