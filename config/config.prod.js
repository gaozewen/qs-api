/* eslint valid-jsdoc: "off" */

'use strict';

module.exports = () => {
  const config = (exports = {});

  config.logger = {
    // 关闭所有打印到文件的日志
    level: 'NONE',
  };

  return {
    ...config,
  };
};
