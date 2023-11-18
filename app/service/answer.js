const { Service } = require('egg');

class AnswerService extends Service {
  // 新建答卷
  async createAnswer(requestBody) {
    const { ctx } = this;
    try {
      const result = await ctx.model.Answer.create(requestBody);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
module.exports = AnswerService;
