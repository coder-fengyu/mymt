//passport是node认证中间件

const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
const UserModel = require('../../dbs/models/users')

// 先了解passport更详细的用法可看passport的文档
passport.use(new LocalStrategy(async function(username,password,done){
  let where = {
    username
  };
  let result = await UserModel.findOne(where)
  if(result!=null){
    if(result.password===password){
      return done(null,result)
    }else{
      return done(null,false,'密码错误')
    }
  }else{
    return done(null,false,'用户不存在')
  }
}))

// 序列化的方法。服务器在每次接收请求的时候，会从session中读取用户对象，序列化是：查到用户在客户端的验证成功之后，
// 会把用户的数据存放到session再放到cookie
passport.serializeUser(function(user,done){
  done(null,user)
})

passport.deserializeUser(function(user,done){
  return done(null,user)
})

module.exports = passport