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


  /**
 * 关注用户
 */
 export const addFollow = target => {
    return request({
      method: 'POST',
      url: '/v1_0/user/followings',
      data: {
        target
      }
    })
  }


    /**
 * 取消关注用户
 */
 export const deleteFollow= target => {
    return request({
      method: 'DELETE',
      url: `/v1_0/user/followings/${target}`
    })
  }


    /**
 * 收藏文章
 */
 export const addcollect = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: {
      target
    }
  })
}


  /**
* 取消收藏文章
*/
export const deleteCollect= target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}

/**
 * 点赞
 */
 export const addLike = target => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: {
      target
    }
  })
}

/**
 * 取消点赞
 */
export const deleteLike = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${target}`
  })
}

/**
 * 获取当前用户登录资料
 */
 export const getUserProfile = target => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}

/**
 * 更新当前用户登录资料
 */
 export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}

/**
 * 更新当前用户头像
 */
 export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}