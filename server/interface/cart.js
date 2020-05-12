const Router = require('koa-router')
const axios = require('./utils/axios')
const Cart = require('../dbs/models/cart')
const md5 = require('crypto-js/md5')

let router = new Router({prefix: '/cart'})

// 新建购物车
router.post('/create', async ctx => {
  // 验证是否有登录
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      msg: 'please login'
    }
  } else {
    let time = Date()
    // 定义订单id
    let cartNo = md5(Math.random() * 1000 + time).toString()
    let {
      params: {
        id,
        detail
      }
    } = ctx.request.body
    let cart = new Cart({id, cartNo, time, user: ctx.session.passport.user, detail})
    let result = await cart.save()
    if (result) {
      ctx.body = {
        code: 0,
        msg: '',
        id: cartNo
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'fail'
      }
    }
  }
})

// 获取购物车信息
router.post('/getCart', async ctx => {
  let {id} = ctx.request.body
  console.log(id);
  try {
    let result = await Cart.findOne({cartNo: id})
    ctx.body = {
      code: 0,
      data: result
        ? result.detail[0]
        : {}
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      data: {}
    }
  }
})

module.exports = router
