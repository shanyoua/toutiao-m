<template>
    <div class="login-container">
        <!-- 登录头 -->
        <van-nav-bar class="page-nav-bar" title="登录" />
        <!-- 登录表单 -->
        <van-form @submit="onSubmit" ref="loginForm">
            <van-cell-group inset>
                <van-field
                v-model="user.mobile"
                name="mobile"
                placeholder="请输入手机号13911111111"
                :rules="userFormRules.mobile"
                type="number"
                maxlength="11"
                >
                <template #left-icon><i class="toutiao toutiao-shouji"></i></template>
                </van-field>
                <van-field
                v-model="user.code"
                name="code"
                placeholder="请输入验证码246810"
                :rules="userFormRules.code"
                type="number"
                maxlength="6"
                >
                <template #left-icon><i class="toutiao toutiao-yanzhengma"></i></template>
                <template #button>
                    <van-count-down 
                    v-if="isCountDownShow"
                    :time="5000" 
                    format="ss s" 
                    @finish="isCountDownShow=false"
                    />
                    <van-button 
                    v-else 
                    class="send-sms-btn" 
                    native-type="button" 
                    round size="small" 
                    type="primary" 
                    @click="onSendSms"
                    >发送验证码</van-button>
                </template>
                </van-field>
            </van-cell-group>
                <div class="login-btn-wrap" style="margin: 16px;">
                <van-button class="login-btn" block type="primary" native-type="submit">
                    登录
                </van-button>
                </div>
        </van-form>
    </div>
</template>

<script>
import {login,sendSms} from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
        user: {
            mobile:'',
            code:''
        },
        userFormRules:{
            mobile:[{
                required: true, 
                message: '手机号码不能为空'
            },{
                pattern: /1[3|5|7|8]\d{9}/,
                message:'手机号格式错误'
            }],
            code:[{
                required: true, 
                message: '请填写验证码'
            },{
                pattern: /\d{6}/,
                message:'验证码格式错误'
            }]
        },
        isCountDownShow:false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit (values) {
        // 1、获取表单数据
        const user = this.user
        // 2、表单验证
        this.$toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration:0 // 为0表示持续时间，一直持续，为2000表示持续2秒
        })
        // 给van-field组件配置rules验证规则，通过了自动除非submit事件，失败则不触发
        // 3、提交表单请求
        try {
            const { data } = await login(this.user)
            this.$store.commit('setUser', data.data)
            console.log('登录成功！',data)
            this.$toast.success('登录成功')
        } catch (err) {
            if(err.response.status===404){
                this.$toast.fail('手机号码或验证码错误')
            }
            else{
                this.$toast.fail('登录失败')
            }
        }
        // 4、跳转界面
    },
    async onSendSms(){
        // 1、校验手机号
        try {
            await this.$refs.loginForm.validate('mobile')
        } catch (err) {
            return console.log('验证失败', err)
        }
        // 2、验证通过，显示倒计时
        this.isCountDownShow=true
        // 3、请求发送验证码
        try {
            const res = await sendSms(this.user.mobile)
            console.log('发送成功',res)
        } catch (err) {
            this.isCountDownShow = false
            if (err.response.status===429){
                this.$toast('发送太频繁')
            }else{
                console.log('发送失败', err)
            }
        }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    background-color: #ededed;
    font-size: 22px;
    color: #666;
    border: none;
  }

  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
