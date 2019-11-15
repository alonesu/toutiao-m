// user 相关的api

// 登录
import request from '@/utils/request'

export const login = (data) => {
  return request('/app/v1_0/authorizations', 'post', data)
}
