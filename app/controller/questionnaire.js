'use strict';

const { Controller } = require('egg');
const { ERROR_SUCCESS, ERROR_FORM } = require('../constant/errno');

class QuestionnaireController extends Controller {
  // 新建问卷
  async create() {
    const { ctx } = this;
    const result = await ctx.service.questionnaire.createQuestionnaire();
    if (!result) {
      ctx.body = {
        errno: ERROR_FORM,
        msg: '新建问卷失败',
        data: null,
      };
      return;
    }

    ctx.body = {
      errno: ERROR_SUCCESS,
      msg: '新建问卷成功',
      data: {
        id: result._id,
      },
    };
  }

  // 获取（查询）问卷列表
  async list() {
    const { ctx } = this;
    const { page, pageSize, keyword, isStar, isDeleted } = ctx.request.query;

    const list = await ctx.service.questionnaire.getQuestionnaireList({
      page,
      pageSize,
      keyword,
      isStar,
      isDeleted,
    });
    ctx.body = {
      errno: ERROR_SUCCESS,
      data: {
        list,
        total: 0, // 总条数
      },
    };
  }
}

module.exports = QuestionnaireController;
