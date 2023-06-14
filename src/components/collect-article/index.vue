<template>
    <van-button
        :icon="isCollected ? 'star' : 'star-o'"
        :class="{ collected : isCollected }"
        :loading="loading"
        @click="onCollect"
    />
</template>

<script>
import { addcollect, deleteCollect } from '@/api/user'
export default {
    name: 'CollectArticle',
    components: {},
    model: {
      prop: 'isCollected', // 默认是 value
      event: 'update-is_collected' // 默认是 input
    },
    props: {
        isCollected: {
            type: Boolean,
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
        async onCollect() {
            this.loading = true // 展示按钮的 loading 状态
            try {
                if (this.isCollected) {
                    await deleteCollect(this.articleId)
                }else {
                    await addcollect(this.articleId)
                }
                this.$emit('update-is_collected', !this.isCollected)
                this.$toast.success(!this.isCollected ? '收藏成功':'取消收藏')
            } catch (err) {
                console.log(err)
                this.$toast('收藏失败！')
            }
            this.loading = false // 展示按钮的 loading 状态
        }
    }
}
</script>

<style scoped lang="less">
.collected{ 
    /deep/.van-icon {
        color: #ffa500
    }
}
</style>