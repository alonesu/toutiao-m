<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登录"></van-nav-bar>
    <van-cell-group>
      <van-field @blur="checkMobile" v-model="loginForm.mobile" label="手机号" placeholder="请输入手机号" :error-message="errMsg.mobile" />
      <van-field @blur="checkCode" v-model="loginForm.code" label="验证码" placeholder="请输入验证码" :error-message="errMsg.code">
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
      <div class="btn_box">
        <van-button type="info" @click="login" block round>登录</van-button>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'user-login',
  data () {
    return {
      loginForm: {
        mobile: '',
        code: ''
      },
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    checkMobile () {
      // 非空
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '请输入手机号'
        return false
      }
      // 格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = '手机号格式不正确，请重新输入'
        return false
      }
      // 成功
      this.errMsg.mobile = ''
    },
    checkCode () {
      // 非空
      if (!this.loginForm.code) {
        this.errMsg.code = '请输入验证码'
        return false
      }
      // 格式
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '验证码不正确，请重新输入'
        return false
      }
      // 成功
      this.errMsg.code = ''
    },
    async login () {
      // 对整体表单进行校验
      this.checkMobile()
      this.checkCode()
      // 判断errMsg对象中是否有错误信息 校验失败
      if (!this.loginForm.mobile || !this.loginForm.code) {
        return false
      }
      // 如果成功 进行登录
      try {
        const data = await login(this.loginForm)
        // 更新vuex 和 本地用户信息
        this.updateUser(data)
        // 跳转（如果地址栏有回跳地址就回跳，如果没有就返回个人中心）
        const { redirectUrl } = this.$route.query
        this.$router.push(redirectUrl || '/user')
      } catch (error) {
        this.$toast.fail('手机号或验证码错误')
      }
    },
    ...mapMutations(['updateUser'])
  }
}
</script>

<style scoped lang="less">
</style>
