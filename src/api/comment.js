import request from '@/utils/request'

export const getComments = params => {
    return request({
        method:'GET',
        url:'/v1_0/comments',
        params
    })
}

// 对评论点赞
export const addCommentLike = target => {
    return request({
        method:'POST',
        url:'/v1_0/comment/likings',
        data: {
            target
        }
    })
}

// 对评论取消点赞
export const deleteCommentLike = target => {
    return request({
        method:'DELETE',
        url:`/v1_0/comment/likings/${target}`
    })
}

// 对文章进行评论
export const addComment = data => {
    return request({
        method:'POST',
        url:'/v1_0/comments',
        data
    })
}