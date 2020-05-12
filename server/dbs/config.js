module.exports = {
  // 设置mongodb的地址。前面一段是mongodb在电脑上的固定端口，student是我们的数据库名称
  dbs: 'mongodb://127.0.0.1:27017/student',
  // 设置redis的地址。redis要求是这种写法，其实就是127.0.0.1:6379/
  redis: {
    get host() {
      return '127.0.0.1'
    },
    get port() {
      return 6379
    }
  },
  // 设置smtp的地址。本项目使用腾讯提供的smtp服务。就是用我们自己的邮箱，给向在这个项目注册的人发验证码
  smtp: {
    get host() {
      return 'smtp.qq.com'
    },
    get user() {
      return '1970161673@qq.com'
    },
    // 这个是生成的授权码，不能分享给别人。所以这里就乱写了
    get pass() {
      return 'ncezvzzuzxmcecbc'
    },
    // 生成4个随机字符串作为验证码。toString(16)是转换为16进制
    get code() {
      return () => {
        return Math.random().toString(16).slice(2, 6).toUpperCase()
      }
    },
    // 生成验证码的过期时间（当前时间后的 1 min）
    get expire() {
      return () => {
        return new Date().getTime() + 60 * 60 * 1000
      }
    }
  }
}