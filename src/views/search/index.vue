<template>
    <div class="search-container">
         <!-- 顶部搜索栏 -->
         <!-- van-search外面增加form是为了输入的时候键盘上有search按钮 -->
         <form action="/">
            <van-search
                class="search-from"
                v-model="searchText"
                show-action 
                placeholder="请输入搜索关键词"
                background="#3296fa"
                @search="onSearch"
                @cancel="onCancel"
                @focus="isResultShow=false" 
            />

            <!-- 搜索结果 -->
            <search-result 
            v-if="isResultShow"
            :search-text="searchText"
            >
            </search-result>

            <!-- 联想建议 -->
            <search-suggestion 
            v-else-if="searchText" 
            :search-text="searchText"
            @search="onSearch"
            >
            </search-suggestion>

            <!-- 搜索历史记录 -->
            <search-history 
            v-else 
            :search-histories="searchHistories"
            @clear-search-histories="searchHistories = []"
            @search="onSearch"
            >
            </search-history>


        </form>
    </div>
</template>

<script>
import SearchHistory from './compnents/search-history.vue'
import SearchSuggestion from './compnents/search-suggestion.vue'
import SearchResult from './compnents/search-result.vue'
import { setItem, getItem} from '@/utils/storage'

export default {
    name:'SearchIndex',
    components:{
        SearchHistory,
        SearchResult,
        SearchSuggestion
    },
    props:{},
    data(){
        return {
            searchText:'',
            value: '',
            isResultShow: false , //结果默认不展示，点击搜索再展示
            // 开始没有历史为[]， 有历史就从本地存储展示出来
            searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [], // 搜索历史记录数据
        }
    },
    computed:{},
    watch:{
        // 简写
        searchHistories(value){
            setItem('TOUTIAO_SEARCH_HISTORIES', value)
        }
        // 完整写法,支持更多自定义
        // handler (){}
    },
    created(){},
    mounted(){},
    methods:{
        onSearch(val) {
            // 更新文本框内容
            this.searchText = val
            // 存储搜索历史记录
            const index = this.searchHistories.indexOf(val)
            if(index !== -1) {
                this.searchHistories.splice(index, 1)
            }
            this.searchHistories.unshift(val)
            // 渲染搜索结果
            this.isResultShow = true
            },
        onCancel() {
            this.$router.back()
        },
    }
}
</script>

<style scoped lang="less">
.search-container {
    padding-top: 108px;
    /deep/.van-search__action {
        color: #fff;
    }
    .search-from {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }
}
</style>