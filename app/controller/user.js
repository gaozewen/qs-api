'use strict';

const { Controller } = require('egg');
const { ERROR_FORM, ERROR_SUCCESS, ERROR_DB } = require('../constant/errno');

class UserController extends Controller {
  async register() {
    const { ctx } = this;
    const { username, password, nickname } = ctx.request.body; // 获取注册需要的参数

    if (!username || !password) {
      ctx.body = {
        errno: ERROR_FORM,
        msg: '账号密码不能为空',
        data: null,
      };
      return;
    }

    let userInfo;
    userInfo = await ctx.service.user.getUserByUsername(username);
    if (userInfo) {
      ctx.body = {
        errno: ERROR_FORM,
        msg: '用户名重复，请重新输入',
        data: userInfo,
      };
      return;
    }

    userInfo = await ctx.service.user.getUserByNickname(nickname);
    if (userInfo) {
      ctx.body = {
        errno: ERROR_FORM,
        msg: '昵称重复，请重新输入',
        data: null,
      };
      return;
    }

    // 调用 service 方法，将数据存入数据库。
    const result = await ctx.service.user.register(ctx.request.body);

    if (!result) {
      ctx.body = {
        errno: ERROR_DB,
        msg: '注册失败',
        data: null,
      };
      return;
    }

    ctx.body = {
      errno: ERROR_SUCCESS,
      msg: '注册成功',
      data: null,
    };
  }
}

module.exports = UserController;
