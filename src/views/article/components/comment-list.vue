<template>
    <div class="comment-list">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :error="error" 
            error-text="加载失败，请重试"
            :immediate-check="false"
            @load="onLoad"
        >
        <comment-item 
        v-for="(item, index) in list" 
        :key="index" 
        :comment="item"
        @reply-click="$emit('reply-click', $event)"
        />
        </van-list>
    </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item.vue'
export default {
    name: 'CommentList',
    components: {
        CommentItem
    },
    props: {
        source: {
            type:[Number, String, Object],
            required: true
        },
        list: {
            type: Array,
            default: () => []
        },
        type: {
            type:String,
            // 自定义Prop数据验证，传入的数据必须是[]号之内的
            validator (value) {
                return ['a','c'].includes(value)
            },
            default:'a'
        }
    },
    data () {
        return {
            // list:[],
            loading:false,
            finished:false,
            offset:null,
            limit:10,
            error:false
        }
    },
    computed: {},
    watch: {},
    created () {
        this.loading = true
        this.onLoad()
    },
    mounted () {},
    methods: {
        async onLoad () {
            this.loading=true
            try {
                // 获取数据
                const { data } = await getComments ({
                    type:this.type,
                    source: this.source.toString(),
                    offset: this.offset,
                    limit: this.limit
                })
                // 数据添加到列表
                console.log(data)
                const { results, total_count:totalCount} = data.data
                this.list.push(...results)

                // 传递文章总数量
                this.$emit('onload-success', data.data)

                // 停止loading
                this.loading=false

                // 判断是否还有数据
                if(results.length){
                    this.offset = data.data.last_id
                } else {
                    // 没有就finished
                    this.finished = true
                }
            } catch (err) {
                this.error = true
                this.loading=false
                console.log(err)

            }
    },
  },
}
</script>

<style scoped lang="less"></style>