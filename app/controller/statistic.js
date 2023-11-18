'use strict';

const { Controller } = require('egg');
const { ERROR_SUCCESS } = require('../constant/errno');

class StatisticController extends Controller {
  // 统计列表
  async list() {
    const { ctx } = this;
    const { questionnaireId } = ctx.params;
    const { page, pageSize } = ctx.request.query;
    const { list, total } = await ctx.service.statistic.getAnswerStatisticList({
      questionnaireId,
      page,
      pageSize,
    });

    ctx.body = {
      errno: ERROR_SUCCESS,
      data: {
        list,
        total, // 总条数
      },
    };
  }
}

module.exports = StatisticController;
