// 封装axios
import axios from 'axios'
import JSONBIGINT from 'json-bigint'
import store from '@/store'
import router from 'vue-router'

const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [(data) => {
    try {
      return JSONBIGINT.parse(data)
    } catch (error) {
      return data
    }
  }]
})
// 请求拦截器 追加token到请求头
instance.interceptors.request.use(config => {
  // 拦截成功 获取token
  if (store.state.user.token) {
    //   追加token
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, err => Promise.reject(err))

// 响应拦截器 1.获取有效数据 2.token的延长有效期 TODO
instance.interceptors.response.use(res => {
  // 原始的res是什么格式返回什么格式
  // 剥离无效数据 有效数据 res.data.data
  // 注意： 有时候并不叫data 有些时候没有响应主体
  try {
    return res.data.data
  } catch (error) {
    return res
  }
}, async err => {
  // 1.判断响应体状态
  // 1.1 如果是401 判断是否有token
  // 没有token 跳转到登录页（登录后回跳）
  // 有token，重新刷新token
  // 判断refresh_token是否失效
  // 如果失效，跳转到登录页（登录后回跳）
  // 没有失效，发请求重新获取token，更新 vuex 和 本地token
  // 发送之前失败的请求
  if (err.response && err.response.status === 401) {
    const user = store.state.user
    // 跳转登录的地址 使用router获取当前访问的路由地址（vue组件 this.$route.path)
    const loginConfig = {
      path: '/login',
      query: {
        redirectUrl: router.currentRoute.path
      }
    }
    // 没登录（严谨代码）
    if (!user || !user.token || !user.refresh_token) {
      return router.push(loginConfig)
    }
    try {
      // 发刷新token的请求
      // 注意：不是使用instance，已经有了一些配置，刷新请求不能使用这些配置
      const { data: { data } } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: { Authorization: `Bearer ${user.refresh_token}` } // 合并refresh_token
      })
      // res是响应对象 res.data.data.token 返回的token
      // 更新vuex和本地的token 使用mutations中的方法即可
      store.commit('updateUser', {
        token: data.token,
        refresh_token: user.refresh_token
      })
      // err函数中返回一个promise（axios请求）执行当前promise
      // 继续发送之前失败的请求，instance（{之前失败的请求配置}）
      // 请求失败的请求配置参数 err.config
      return instance(err.config)
    } catch (error) {
      // 刷新token失败
      store.commit('delUser')
      return router.push(loginConfig)
    }
  }
  return Promise.reject(err)
})

// 调用接口(接口地址, 请求方式, 传参)
export default (url, method, data) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
