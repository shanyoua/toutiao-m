<template>
    <div class="comment-post">
      <!-- trim去除输入的空格 -->
      <van-field
        class="post-field"
        v-model.trim="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入留言"
        show-word-limit
      />
      <van-button
        class="post-btn"
        @click="onPost"
        :disabled="!message.length"
      >发布</van-button>
    </div>
  </template>
  
  <script>
  import { addComment } from '@/api/comment'
  export default {
    name: 'CommentPost',
    components: {},
    inject:['articleId'],
    props: {
        target:{
            type:[Number,String,Object],
            required:true
        }
    },
    data () {
      return {
        message: ''
      }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {
        async onPost () {
            this.$toast.loading({
                message: '发布中……',
                forbidClick: true,
                duration: 0
            })
            try {
                const {data} = await addComment({
                    target:this.target.toString(),  // 评论的目标id，文章或评论回复
                    content: this.message,
                    art_id:this.articleId ? this.articleId.toString() : this.articleId  // 文章id, 回复评论时才需要传入文章id
                })
                this.message=''
                // 父组件去关闭弹出层，发布出消息
                this.$emit('post-success', data.data)
                this.$toast.success('发布成功！')
            } catch (err) {
                console.log(err)
                this.$toast.fail("评论失败，请重试")
            }
        }
    }
  }
  </script>
  
  <style scoped lang="less">
  .comment-post {
    display: flex;
    align-items: center;
    padding: 32px 0 32px 32px;
    .post-field {
      background-color: #f5f7f9;
    }
    .post-btn {
      width: 150px;
      border: none;
      padding: 0;
      color: #6ba3d8;
      &::before {
        display: none;
      }
    }
  }
  </style>
  