<template>
    <div class="search-suggestion">
        <van-cell 
            v-for="(text,index) in suggestions"
            :key="index" 
            icon="search"
            @click="$emit('search', text)"
        >
        <div slot="title" v-html="highlight(text)"></div>
        </van-cell>
    </div>
</template>

<script>
import { getSearchSuggestions } from  '@/api/search'
import { debounce } from 'lodash'
export default {
    name:'SearchSuggestion',
    computed:{},
    props:{
        searchText: {
            type: String,
            required: true
        }
    },
    components:{},
    data () {
        return {
            suggestions:[],
        }
    },
    watch:{
        searchText: {
            // 监听输入框变化,每次变化都调用load方法发送数据请求
            // handler (value) {  
            //     this.loadSearchSuggestions(value)
            // },
            // immediate:true

            // debounce防抖函数，返回值，防抖之后的函数
            handler: debounce(function (value) {
                this.loadSearchSuggestions(value)
            }, 200),
            immediate: true // 该回调将会在侦听开始之后被立即调用
            }
        },
    created () {},
    mounted () {},
    methods:{
        // 将获取的数据存储到suggestions中
        async loadSearchSuggestions (q) {
            try {
                const { data } = await getSearchSuggestions(q)
                if (data.data.options.length===1 || 0){
                    this.suggestions = [q]
                    // console.log(this.suggestions)
                    // console.log(data.data.options)
                }
                else {
                    this.suggestions = data.data.options
                    // console.log(q)
                    // console.log(data.data.options)
                }
                
            } catch (err) {
                this.$toast('数据获取失败，请稍后重试')
            }
        },
        // 替换文本
        highlight(text) {
            const highlightStr = `<span class="active">${this.searchText}</span>`
            // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
            // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
            // RegExp 正则表达式构造函数
            //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
            //    参数2：匹配模式，要写到字符串中
            const reg = new RegExp(this.searchText, 'gi')
            return text.replace(reg, highlightStr)
        }
    }
}
</script>
<style scoped lang="less">
.search-suggestion {
    /deep/span.active {
        color: #3296fa;
    }
}
</style>