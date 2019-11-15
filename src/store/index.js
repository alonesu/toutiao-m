import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser()
  },
  mutations: {
    // 更新token
    updateUser (state, user) {
      // 更新state状态
      state.user = user
      // 更新本地存储
      auth.setUser(user)
    },
    // 删除token
    delUser (state) {
      state.user = {}
      auth.delUser()
    }
  },
  actions: {
  }
})
