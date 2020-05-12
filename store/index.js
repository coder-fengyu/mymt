// import Vue from 'vue'
// import Vuex from 'vuex'
// import geo from './geo'
// import home from './home'

// export const actions = {
//   async nuxtServerInit({
//     commit
//   }, { req, app }) {
//     // 获取接口数据
//     const {
//       status,
//       data: {
//         province,
//         city
//       }
//     } = await app.$axios.get('/geo/getPosition')
//     // 把数据提交到Vuex中，setPosition是定义在geo.js模块中的actions
//     commit('geo/setPosition', status === 200 ? { city, province } : { city: '', province: '' })
//     const { status: status2, data: { menu } } = await app.$axios.get('geo/menu')
//     commit('home/setMenu', status2 === 200 ? menu : [])
//     const { status: status3, data: { result } } = await app.$axios.get('/search/hotPlace', {
//       params: {
//         city: app.store.state.geo.position.city.replace('市', '')
//       }
//     })
//     commit('home/setHotPlace', status3 === 200 ? result : [])
//   }
// }

// Nuxt 建议用这种更新的写法，上面是旧写法

export const actions = {
  async nuxtServerInit({  commit }, { req, app }) {
    // 获取接口数据
    const {  status, data: { province, city  }} = await app.$axios.get('/geo/getPosition')
    // 把数据提交到Vuex中，setPosition是定义在geo.js模块中的
    commit('geo/setPosition', status === 200 ? { city:'北京市', province } : { city: '', province: '' })
    const { status: status2, data: { menu } } = await app.$axios.get('geo/menu')
    commit('home/setMenu', status2 === 200 ? menu : [])
    
    const { status: status3, data: { result } } = await app.$axios.get('/search/hotPlace', {
      params: {
        city: app.store.state.geo.position.city.replace('市', '')
      }
    })
    console.log(app.store.state.geo.position.city.replace('市', ''), 88888)
    commit('home/setHotPlace', status3 === 200 ? result : [])
  }
}

