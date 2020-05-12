const Router = require('koa-router')
// 注册的时候看给哪个注册者发了哪个验证码，这种对应关系最好用redis来处理
const Redis = require('koa-redis')
// 让服务器能用我自己的邮箱给注册者发邮件的一个包
const nodeMailer = require('nodemailer')
const User = require('../dbs/models/users')
const Passport = require('./utils/passport')
const Email = require('../dbs/config')
const axios = require('./utils/axios')

let router = new Router({ prefix: '/users' })

let Store = new Redis().client

// 注册接口
router.post('/signup', async (ctx) => {
  const { username, password, email, code } = ctx.request.body;
  // 验证验证码是否正确
  if (code) {
    // 从redis中取出我们发给注册者的验证码和过期时间
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }
  // 验证昵称是否已经被注册
  let user = await User.find({ username })
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }
  // 都没问题了，就正确注册。我们要把用户名和密码写进数据库
  let nuser = await User.create({ username, password, email })
  // 检查有没有成功写库
  if (nuser) {
    // 如果成功了我们就用这个用户名进行登录
    let res = await axios.post('/users/signin', { username, password })
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
    // console.log('ccccc')
  } else {
    // 写库失败
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

// 登录接口。passport的固定用法，详细请看https://blog.csdn.net/qq_39807732/article/details/81771948
router.post('/signin', async (ctx, next) => {
  return Passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        // 做一个登录动作，为用户启动登录会话
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

// 获取验证码的接口
router.post('/verify', async (ctx, next) => {
  let username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    }
    return false
  }
  // transporter是发邮件相关的功能
  let transporter = nodeMailer.createTransport({
    // service: 'qq',
    host: Email.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '高仿美团网注册码',
    html: `您在高仿美团网中注册，您的邀请码是${ko.code}`
  }
  // 进行发送
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    } else {
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }
})

// 退出登录
router.get('/exit', async (ctx, next) => {
  await ctx.logout()//passport提供的，退出会话并清除用户信息
  if (!ctx.isAuthenticated()) {//passport的api，查看登录状态
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

router.get('/getUser', async (ctx) => {
  if (ctx.isAuthenticated()) {
    const { username, email } = ctx.session.passport.user
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

module.exports = router