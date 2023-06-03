<template>
    <div class="layout-container">
        <!-- 子路由出口 -->
        <router-view />
        <!-- 标签导航栏 -->
        <!-- route开启路由模式 -->
        <van-tabbar class="layout-tabbar" route>
            <van-tabbar-item to="/home">
                <i slot="icon" class="toutiao toutiao-shouye"></i>
                首页
            </van-tabbar-item>
            <van-tabbar-item to="/qa">
                <i slot="icon" class="toutiao toutiao-wenda"></i>
                问答
            </van-tabbar-item>
            <van-tabbar-item to="/video">
                <i slot="icon" class="toutiao toutiao-shipin"></i>
                视频
            </van-tabbar-item>
            <van-tabbar-item to="/my">
                <i slot="icon" class="toutiao toutiao-wode"></i>
                {{ $store.state.user ? '我的' : '未登录' }}
            </van-tabbar-item>
        </van-tabbar>

    </div>
</template>

<script>
export default {
name: 'LayoutIndex',
components: {},
props: {},
data () {
    return {
    }
},
computed: {},
watch: {},
created () {},
mounted () {},
methods: {}
}
</script>

<style scoped lang="less">
.layout-container {
    .layout-tabbar {
        i.toutiao {
            font-size: 40px
        }
    }
}
</style>