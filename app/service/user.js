const { Service } = require('egg');
const crypto = require('crypto');

class UserService extends Service {
  // 通过 username 获取用户信息
  async getUserByUsername(username) {
    const { ctx } = this;
    const { timezone } = ctx;

    try {
      const result = await ctx.model.User.aggregate([
        { $match: { username: { $eq: username } } },
        {
          $project: {
            _id: { $toString: '$_id' },
            username: 1,
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

    // HMAC 加密算法
    const hmac = (key, str) => {
      const hmac = crypto.createHmac('sha256', key);
      hmac.update(str);
      return hmac.digest('hex');
    };

    try {
      const result = await ctx.model.User.create({
        username,
        // 给密码加密
        password: hmac('gzw-qs-api', password),
        nickname,
      });

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
module.exports = UserService;
