<template>
    <div class="article-list">
        <van-pull-refresh 
        v-model="isLoading" 
        @refresh="onRefresh" 
        :success-text="refreshSuccessText" 
        success-duration="1500">
            <van-list 
            v-model="loading" 
            :finished="finished" 
            finished-text="没有更多了" 
            :error.sync="error" 
            error-text="请求失败，点击重新加载" 
            @load="onLoad"
            >
                <article-item 
                    v-for="(article, index) in list" 
                    :key="index" 
                    :article="article" 
                />
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
    name: 'ArticleList',
    components: {
        ArticleItem
    },
    props: {
        channel: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            list: [], // 存储文档列表数据
            loading: false,
            finished: false,
            timestamp: null,
            error: false, // 控制列表加载失败的提示
            isLoading: false,  // 下拉刷新状态
            refreshSuccessText:'刷新成功' // 下拉刷新成功文本
        }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {
        async onLoad () {
            try {
                const { data } = await getArticles({
                    channel_id: this.channel.id,
                    timestamp: this.timestamp || Date.now(),
                    with_top: 1
                })
                const { results } = data.data
                this.list.push(...results)
                this.loading = false // 本次加载完成
                if (results.length) {
                    this.timestamp = data.data.pre_timestamp
                }else {
                    this.finished = true
                }
            } catch (err) {
                this.err = true
                this.loading = false
            }
        },

        // 下拉刷新触发
        async onRefresh() {
            try {
                const { data } = await getArticles({
                    channel_id: this.channel.id,
                    timestamp: Date.now(),
                    with_top: 1
                })
                const { results } = data.data
                this.list.unshift(...data.data.results)
                this.isLoading = false  // 下拉后会自动为true，刷新完成要手动为false
                // 更新下拉刷新提示文本
                this.refreshSuccessText = `刷新成功,更新了${results.length}条数据`
            } catch(err) {
                this.isLoading = false
                this.refreshSuccessText = '刷新失败'
            }
        },
        onLoad_old() {
    //         console.log('onLoad')
    //         // 异步更新数据
    //         // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //         setTimeout(() => {
    //             for (let i = 0; i < 10; i++) {
    //             this.list.push(this.list.length + 1);
    //             }

    //             // 加载状态结束
    //             this.loading = false;

    //             // 数据全部加载完成
    //             if (this.list.length >= 40) {
    //             this.finished = true;
    //             }
    //   }, 1000)
        }
    }
}
</script>

<style scoped lang="less">
.article-list {
    height: 80vh;
    overflow-y: auto;
}
</style>