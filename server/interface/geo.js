const Router = require('koa-router')
const axios = require('./utils/axios')
const Province = require('../dbs/models/province')

let router = new Router({ prefix: '/geo' })


// 由ip地址（根据查库）找出是当前城市、省份的名称
router.get('/getPosition', async (ctx) => {
  let {
    status,
    data: {
      province,
      city
    }
  } = await axios.get(`http://cp-tools.cn/geo/getPosition`)
  if (status === 200) {
    ctx.body = {
      province,
      city
    }
  } else {
    ctx.body = {
      province: '',
      city: ''
    }
  }
})

// 获取中国所有省份
router.get('/province', async (ctx) => {
  let { status, data: {
    province
  } } = await axios.get(`http://cp-tools.cn/geo/province`)
  ctx.body = {
    province: status === 200
      ? province
      : []
  }
})

// 由省份的id找到省份详细信息
router.get('/province/:id', async (ctx) => {
  let { status, data: {
    city
  } } = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}`)
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

// 获取中国所有城市
router.get('/city', async (ctx) => {
  let { status, data: {
    city
  } } = await axios.get(`http://cp-tools.cn/geo/city`);
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

// 获取热门城市
router.get('/hotCity', async (ctx) => {
  let { status, data: {
    hots
  } } = await axios.get(`http://cp-tools.cn/geo/hotCity`);
  if (status === 200) {
    ctx.body = {
      hots
    }
  } else {
    ctx.body = {
      hots: []
    }
  }
})

// 获取首页menu.vue组件的数据
router.get('/menu', async (ctx) => {
  let { status, data: {
    menu
  } } = await axios.get(`http://cp-tools.cn/geo/menu`);
  if (status === 200) {
    ctx.body = {
      menu
    }
  } else {
    ctx.body = {
      menu: []
    }
  }
})

module.exports = router;