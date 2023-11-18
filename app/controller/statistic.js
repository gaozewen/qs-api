'use strict';

const { Controller } = require('egg');
const {
  ERROR_SUCCESS,
  ERROR_DB,
  ERROR_PARAMS,
  ERROR_DATA,
} = require('../constant/errno');

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

  // 获取单个组件的统计数据汇总(Radio,Checkbox)
  async singleComponentStatistic() {
    const { ctx } = this;
    const { questionnaireId, componentId } = ctx.params;

    if (!questionnaireId || !componentId) {
      ctx.body = {
        errno: ERROR_PARAMS,
        msg: 'URL参数错误',
        data: null,
      };
      return;
    }
    const questionnaire = await ctx.service.questionnaire.getQuestionnaireById(
      questionnaireId
    );
    if (!questionnaire) {
      ctx.body = {
        errno: ERROR_DB,
        msg: '获取问卷信息失败',
        data: null,
      };
      return;
    }
    const { componentList } = questionnaire;
    const componentInfo = componentList.find(c => c.fe_id === componentId);
    if (!componentInfo) {
      ctx.body = {
        errno: ERROR_DATA,
        msg: '获取 componentInfo 失败',
        data: null,
      };
      return;
    }

    const { type, props } = componentInfo;
    if (![ 'radio', 'checkbox' ].includes(type)) {
      ctx.body = {
        errno: ERROR_DATA,
        msg: '该组件无图表统计',
        data: null,
      };
      return;
    }

    const { options = [], list = [] } = props;
    let needCountOpts = [];
    if (type === 'radio') {
      needCountOpts = options;
    }
    if (type === 'checkbox') {
      needCountOpts = list;
    }
    const names = needCountOpts.map(opt => opt.text);
    const { statistic } =
      await ctx.service.statistic.getSingleComponentStatistic({
        questionnaireId,
        componentId,
        names,
      });

    ctx.body = {
      errno: ERROR_SUCCESS,
      data: {
        statistic,
      },
    };
  }
}

module.exports = StatisticController;
