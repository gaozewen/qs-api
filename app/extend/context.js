const TIMEZONE = Symbol('Context#timezone');

module.exports = {
  get timezone() {
    // this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
    if (!this[TIMEZONE]) {
      // 例如，从 header 中获取，实际情况肯定更复杂
      this[TIMEZONE] = this.get('User-Timezone') || 'Asia/Shanghai';
    }
    return this[TIMEZONE];
  },
};
