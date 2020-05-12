const axios = require('axios')

const instance = axios.create({
  // 基础URL
  baseURL: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
  // 超时
  timeout: 2000,
  headers: {

  }
})

module.exports = instance
