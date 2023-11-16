const { Service } = require('egg');

class UserService extends Service {
  // 通过 username 获取用户信息
  async getUserByUsername(username) {
    const { ctx } = this;
    const { timezone } = ctx;
    console.log('gzw===>timezone', timezone);
    try {
      const result = await ctx.model.User.aggregate([
        { $match: { username: { $eq: username } } },
        {
          $project: {
            _id: { $toString: '$_id' },
            username: 1,
            password: 1,
            nickname: 1,
            createdAt: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: '$createdAt',
                timezone,
              },
            },
            updatedAt: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: '$updatedAt',
                timezone,
              },
            },
          },
        },
      ]);
      console.log('gzw===>result1', result);
      return result[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 通过 nickname 获取用户信息
  async getUserByNickname(nickname) {
    const { ctx } = this;
    try {
      const result = await ctx.model.User.findOne({ nickname });
      console.log('gzw===>result2', result);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 通过 nickname 获取用户信息
  async register(body) {
    const { ctx } = this;
    const { username, password, nickname } = body;
    console.log('gzw===>body', body);
    try {
      const result = await ctx.model.User.create({
        username,
        password,
        nickname,
      });
      console.log('gzw===>result', result);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
module.exports = UserService;
