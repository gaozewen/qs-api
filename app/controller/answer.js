'use strict';

const { Controller } = require('egg');
const { ERROR_SUCCESS, ERROR_FORM } = require('../constant/errno');

class AnswerController extends Controller {
  // 新建答卷
  async create() {
    const { ctx } = this;

    const result = await ctx.service.answer.createAnswer(ctx.request.body);
    if (!result) {
      ctx.body = {
        errno: ERROR_FORM,
        msg: '新建答卷失败',
        data: null,
      };
      return;
    }

    ctx.body = {
      errno: ERROR_SUCCESS,
      msg: '新建答卷成功',
      data: {
        id: result._id,
      },
    };
  }
}

module.exports = AnswerController;
