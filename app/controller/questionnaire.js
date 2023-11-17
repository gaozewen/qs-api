'use strict';

const { Controller } = require('egg');
const { ERROR_SUCCESS, ERROR_FORM, ERROR_DB, ERROR_PARAMS } = require('../constant/errno');

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

    const { list, total } = await ctx.service.questionnaire.getQuestionnaireList({
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
        total, // 总条数
      },
    };
  }

  // 获取单个问卷信息
  async item() {
    const { ctx } = this;
    const { id } = ctx.params;

    const result = await ctx.service.questionnaire.getQuestionnaireById(id);
    if (!result) {
      ctx.body = {
        errno: ERROR_DB,
        msg: '获取问卷数据失败',
        data: {},
      };
      return;
    }
    ctx.body = {
      errno: ERROR_SUCCESS,
      data: result,
    };
  }

  // 更新问卷
  async patch() {
    const { ctx } = this;
    const { id } = ctx.params;

    const result = await ctx.service.questionnaire.updateQuestionnaireById(id);
    if (!result) {
      ctx.body = {
        errno: ERROR_DB,
        msg: '更新问卷数据失败',
        data: {},
      };
      return;
    }
    ctx.body = {
      errno: ERROR_SUCCESS,
      data: result,
    };
  }

  // 复制问卷
  async duplicate() {
    const { ctx } = this;
    const { id } = ctx.params;

    const result = await ctx.service.questionnaire.duplicateQuestionnaireById(id);
    if (!result) {
      ctx.body = {
        errno: ERROR_DB,
        msg: '更新问卷数据失败',
        data: {},
      };
      return;
    }
    ctx.body = {
      errno: ERROR_SUCCESS,
      data: result,
    };
  }

  // 批量彻底删除问卷
  async delete() {
    const { ctx } = this;
    const { ids } = ctx.request.body;
    if (!ids || ids.length === 0) {
      ctx.body = {
        errno: ERROR_PARAMS,
        msg: 'ids 参数异常',
        data: {},
      };
      return;
    }
    const result = await ctx.service.questionnaire.deleteQuestionnaireByIds(ids);
    if (!result) {
      ctx.body = {
        errno: ERROR_DB,
        msg: '彻底删除问卷失败',
        data: {},
      };
      return;
    }
    ctx.body = {
      errno: ERROR_SUCCESS,
      data: result,
    };
  }
}

module.exports = QuestionnaireController;
