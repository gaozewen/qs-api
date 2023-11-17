const { Service } = require('egg');

class QuestionnaireService extends Service {
  // 新建问卷
  async createQuestionnaire() {
    const { ctx } = this;
    const userInfo = ctx.helper.getUserInfoByToken();

    try {
      const result = await ctx.model.Questionnaire.create({
        userId: userInfo._id,
        answerCount: 0,
        title: '问卷标题',
        desc: '',
        js: '',
        css: '',
        isPublished: false,
        isStar: false,
        isDeleted: false,
        componentList: [
          {
            fe_id: 'c1',
            type: 'info',
            title: '问卷信息',
            props: {
              title: '问卷标题',
              desc: '问卷描述...',
            },
            isHidden: false,
            isLocked: false,
          },
        ],
      });

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  // 获取问卷列表
  async getQuestionnaireList({ page, pageSize, keyword, isStar, isDeleted }) {
    const { ctx } = this;
    const { timezone } = ctx;
    const $and = [
      { title: { $regex: keyword || '' } },
      // 回收站列表 isDeleted ? true : false
      { isDeleted: { $eq: !!isDeleted } },
    ];

    // 星标问卷列表
    if (isStar) $and.push({ isStar: { $eq: Boolean(isStar) } });

    const $match = { $and };

    try {
      const result = await ctx.model.Questionnaire.aggregate([
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
              {
                $project: {
                  _id: { $toString: '$_id' },
                  userId: 1,
                  answerCount: 1,
                  title: 1,
                  desc: 1,
                  js: 1,
                  css: 1,
                  isPublished: 1,
                  isStar: 1,
                  isDeleted: 1,
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

      return {
        list: result[0].list,
        total: (result[0].total[0] || {}).total || 0,
      };
    } catch (error) {
      console.error(error);
      return { list: [], total: 0 };
    }
  }

  // 获取单个问卷信息
  async getQuestionnaireById(id) {
    const { ctx } = this;
    try {
      const result = await ctx.model.Questionnaire.findById(id);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 更新问卷
  async updateQuestionnaireById(id) {
    const { ctx } = this;
    try {
      const result = await ctx.model.Questionnaire.updateOne(
        { _id: id },
        ctx.request.body
      );
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
module.exports = QuestionnaireService;
