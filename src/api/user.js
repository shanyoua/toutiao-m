import request from "@/utils/request"
// import store from "@/store"

export const login = data => {
    return request({
        method:'POST',
        url:'/v1_0/authorizations',
        data:data
    })
}

export const sendSms = mobile => {
    return request({
        method:'GET',
        url:`/v1_0/sms/codes/${mobile}`
    })
}

export const getUserInfo = () => {
    return request({
        method:'GET',
        url:'/v1_0/user'
        // headers: {
        //     // 该接口需要授权才能访问
        //     // token数据格式：Bearer token数据， 注意Bearer后面有一个空格
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}
/**
 * 获取用户自己的信息
 */
 export const getUserChannels = () => {
    return request({
      method: 'GET',
      url: 'v1_0/user/channels'
    })
  }