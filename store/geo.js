export const state = () => ({ position: {} })

export const mutations = {
  setPosition(state, val) {
    state.position = val
  }
}

// Nuxt 建议用这种更新的写法，下面是旧写法

// const mutations = {
//   setPosition(state, val) {
//     state.position = val
//   }
// }

// const actions = {
//   setPosition: ({
//     commit
//   }, position) => {
//     commit('setPosition', position)
//   }
// }

// export default {namespaced: true, state, mutations, actions}

