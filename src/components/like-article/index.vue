<template>
    <van-button
        :icon="isLiked===1 ? 'good-job' : 'good-job-o'"
        :class="{ Liked : isLiked===1 }"
        :loading="loading"
        @click="onLike"
    />
</template>

<script>
import { addLike, deleteLike } from '@/api/user'
export default {
    name: 'LikeArticle',
    components: {},
    model: {
      prop: 'isLiked', // 默认是 value
      event: 'update-is_liked' // 默认是 input
    },
    props: {
        isLiked: {
            type: Number,
            required: true
      },
        articleId: {
            type: [Number, String, Object],
            required: true
        }
    },
    data () {
        return {
            loading:false
        }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {
        async onLike() {
            this.loading = true // 展示按钮的 loading 状态
            try {
                let status= -1
                if (this.isLiked === 1 ) {
                    await deleteLike(this.articleId)
                }else {
                    await addLike(this.articleId)
                    status = 1
                }
                this.$emit('update-is_liked', status)
                this.$toast.success(status===1 ? '喜欢成功':'取消喜欢')
            } catch (err) {
                console.log(err)
                this.$toast('喜欢失败！')
            }
            this.loading = false // 展示按钮的 loading 状态
        }
    }
}
</script>

<style scoped lang="less">
.Liked{ 
    /deep/.van-icon {
        color: #ffa500
    }
}
</style>