const { Service } = require('egg');

class StatisticService extends Service {
  // 获取答卷统计列表
  async getAnswerStatisticList({ questionnaireId, page, pageSize }) {
    const { ctx } = this;
    const { timezone } = ctx;
    const $and = [{ questionnaireId: { $eq: questionnaireId } }];

    const $match = { $and };

    try {
      const result = await ctx.model.Answer.aggregate([
        {
          $facet: {
            total: [
              {
                $match,
              },
              { $count: 'total' },
            ],
            list: [
              {
                $match,
              },
              // 按创建时间倒序
              { $sort: { createdAt: -1 } },
              {
                $project: {
                  _id: { $toString: '$_id' },
                  answerList: 1,
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
              {
                $skip: (Number(page) - 1) * Number(pageSize),
              },
              {
                $limit: Number(pageSize),
              },
            ],
          },
        },
      ]);

      const viewList = result[0].list.map(i => ({
        _id: i._id,
        ...i.answerList.reduce(
          (total, cur) => ({
            ...total,
            [cur.componentId]: cur.value,
          }),
          {}
        ),
        createdAt: i.createdAt,
      }));

      return {
        list: viewList,
        total: (result[0].total[0] || {}).total || 0,
      };
    } catch (error) {
      console.error(error);
      return { list: [], total: 0 };
    }
  }

  // 获取单个组件的统计数据汇总(Radio,Checkbox)
  async getSingleComponentStatistic({
    questionnaireId,
    componentId,
    names = [],
  }) {
    const { ctx } = this;
    const $facet = {};
    names.forEach(name => {
      $facet[name] = [
        {
          $match: {
            $and: [
              { questionnaireId: { $eq: questionnaireId } },
              {
                answerList: {
                  $elemMatch: {
                    componentId: { $eq: componentId },
                    value: { $regex: name },
                  },
                },
              },
            ],
          },
        },
        { $count: 'count' },
      ];
    });

    try {
      // result [{"程序猿":[{"count":6}],"程序媛":[{"count":5}]}]
      const result = await ctx.model.Answer.aggregate([
        {
          $facet,
        },
      ]);

      // statistic [ { name: '程序猿', count: 6 }, { name: '程序媛', count: 5 } ]
      const statistic = names.map(name => ({
        name,
        count: (result[0][name][0] || {}).count || 0,
      }));

      return {
        statistic,
      };
    } catch (error) {
      console.error(error);
      return { statistic: [] };
    }
  }
}
module.exports = StatisticService;
