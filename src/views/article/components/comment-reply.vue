<template>
    <div class="comment-reply">
        <van-nav-bar
        :title="`${comment.reply_count}条回复`"
        >
            <van-icon 
            slot="left" 
            name="cross" 
            @click="$emit('close')"
            />
        </van-nav-bar>

        <!-- 当前评论项 -->
        <div class="scroll-wrap">
            <comment-item :comment="comment" />

            <!-- 评论回复列表 -->
            <van-cell title="全部回复" />
            <comment-list 
            :list="commentList"
            :source="comment.com_id"
            type="c"
            />
        </div>
        
         <!-- 底部区域 -->
         <div class="post-wrap">
            <van-button 
            round 
            size="small" 
            class="pst-btn"
            @click="isPostShow=true"
            >
                写评论
            </van-button>
         </div>

         <!-- 发布评论 -->
         <van-popup v-model="isPostShow" position="bottom">
            <comment-post 
            :target="comment.com_id"
            @post-success="onPostSuccess"
            />
         </van-popup>
    </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
    name: 'CommentReply',
    components: {
        CommentItem,
        CommentList,
        CommentPost
    },
    inject:{
        articleId:{
            type:[Number,String,Object],
            default: null
        }
    },
    props: {
        comment: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            isPostShow:false,
            commentList:[]
        }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {
        onPostSuccess (data) {
            // 更新回复数量
            this.comment.reply_count++
            // 关闭弹层
            this.isPostShow = false
            // 视图展示
            this.commentList.unshift(data.new_obj)
        }
    }
}
</script>

<style scoped lang="less">
.scroll-wrap {
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 88px;
    overflow-y: true;
}
.post-wrap{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-top: 1px solid #d8d8d8;
    .pst-btn {
        width: 60%;
    }
}
</style>