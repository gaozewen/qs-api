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

  async login() {
    // app 为全局属性，相当于所有的插件方法都植入到了 app 对象。
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;

    // 根据用户名，在数据库查找相对应的id操作
    const userInfo = await ctx.service.user.getUserByUsername(username);

    // 没找到说明没有该用户
    if (!userInfo) {
      ctx.body = {
        errno: ERROR_FORM,
        msg: '账号不存在，请先注册',
        data: null,
      };
      return;
    }

    // 找到用户，并且判断输入密码与数据库中用户密码。
    if (ctx.helper.hmac(password) !== userInfo.password) {
      ctx.body = {
        errno: ERROR_FORM,
        msg: '密码错误，请重试',
        data: null,
      };
      return;
    }

    // 生成 token 加盐
    // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容；第二个是加密字符串
    const token = app.jwt.sign(
      {
        _id: userInfo._id,
        username: userInfo.username,
        nickname: userInfo.nickname,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // token 有效期为 24 小时
      },
      app.config.jwt.secret
    );

    ctx.body = {
      errno: ERROR_SUCCESS,
      msg: '登录成功',
      data: {
        token,
      },
    };
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.token; // 获取header 的token
    const decode = app.jwt.verify(token, app.config.jwt.secret);
    const { username, nickname } = decode;
    ctx.body = {
      errno: ERROR_SUCCESS,
      msg: '成功',
      data: {
        username,
        nickname,
      },
    };
  }
}

module.exports = UserController;
