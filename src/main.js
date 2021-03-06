import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 修改rem基准值的js值
import 'amfe-flexible'

// 引入vant
import Vant from 'vant'
import 'vant/lib/index.less'
import '@/styles/index.css'
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
