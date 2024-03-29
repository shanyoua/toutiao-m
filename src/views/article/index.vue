<template>
    <div class="article-container">
      <!-- 导航栏 -->
      <van-nav-bar
        class="page-nav-bar"
        title="黑马头条"
      >
            <van-icon slot="left" name="cross" @click="$router.back()" />
      </van-nav-bar>
      <!-- /导航栏 -->
  
      <div class="main-wrap">
        <!-- 加载中 -->
        <div v-if="loading" class="loading-wrap">
          <van-loading
            color="#3296fa"
            vertical
          >加载中</van-loading>
        </div>
        <!-- /加载中 -->
  
        <!-- 加载完成-文章详情 -->
        <div v-else-if="article.title" class="article-detail">
          <!-- 文章标题 -->
          <h1 class="article-title">{{ article.title }}</h1>
          <!-- /文章标题 -->
  
          <!-- 用户信息 -->
          <van-cell class="user-info" center :border="false">
            <van-image
              class="avatar"
              slot="icon"
              round
              fit="cover"
              :src="article.aut_photo"
            />
            <div slot="title" class="user-name">{{ article.aut_name}}</div>
            <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
             <!--
            模板中的 $event 是事件参数
            当我们传递给子组件的数据既要使用还要修改。
              传递：props
                :is-followed="article.is_followed"
              修改：自定义事件
                @update-is_followed="article.is_followed = $event"
            简写方式：在组件上使用 v-model
              value="article.is_followed"
              @input="article.is_followed = $event"

            如果需要修改 v-model 的规则名称，可以通过子组件的 model 属性来配置修改

            一个组件上只能使用一次 v-model，
            如果有多个数据需要实现类似于 v-model 的效果，咋办？
            可以使用属性的 .sync 修饰符。
           -->
            <follow-user 
            class="follow-btn"
            :user-id="article.aut_id"
            v-model="article.is_followed"
            >
            </follow-user>
            <!-- <van-button
              class="follow-btn"
              v-if="article.is_followed"
              round
              size="small"
              @click="onFollow"
              :loading="followLoading"
            >已关注</van-button>
            <van-button 
              class="follow-btn"
              v-else
              type="info"
              color="#3296fa"
              round
              size="small"
              icon="plus"
              @click="onFollow"
              :loading="followLoading"
            >关注</van-button> -->
            
          </van-cell>
          <!-- /用户信息 -->
  
          <!-- 文章内容 -->
          <div 
            class="article-content markdown-body" 
            v-html="article.content"
            ref="article-content"
            ></div>
            <van-divider>正文结束</van-divider>

            <!-- 文章评论列表 -->
            <comment-list 
            :source="article.art_id"
            :list="commentList"
            @onload-success="totalCommentCount = $event.total_count"
            @reply-click="onReplyClick"
            />
            <!-- 文章评论列表 -->

            <!-- 底部区域 -->
            <div class="article-bottom">
              <van-button
                class="comment-btn"
                type="default"
                round
                size="small"
                @click="isPostShow=true"
              >写评论</van-button>
              <van-icon
                name="comment-o"
                :info="totalCommentCount"
                color="#777"
              />
              <collect-article 
              class="btn-item"
              :article-id="article.art_id"
              v-model="article.is_collected"
              />
              <like-article 
              class="btn-item"
              :article-id="article.art_id"
              v-model="article.attitude"
              />
              <!-- <van-icon
                color="#777"
                name="star-o"
              /> -->
              <!-- <van-icon
                color="#777"
                name="good-job-o"
              /> -->
              <van-icon name="share" color="#777777"></van-icon>
            </div>
            <!-- /底部区域 -->

            <!-- 弹出层 -->
            <van-popup 
            v-model="isPostShow" 
            position="bottom" 
            >
            <comment-post 
            :target="article.art_id"
            @post-success="onPostSuccess"
            />
            </van-popup>

          </div>
        <!-- /加载完成-文章详情 -->
  
        <!-- 加载失败：404 -->
        <div v-else-if="errStatus===404" class="error-wrap">
          <van-icon name="failure" />
          <p class="text">该资源不存在或已删除！</p>
        </div>
        <!-- /加载失败：404 -->
  
        <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
        <div v-else class="error-wrap">
          <van-icon name="failure" />
          <p class="text">内容加载失败！</p>
          <van-button 
          class="retry-btn"
          @click="loadArticle"
          >点击重试</van-button>
        </div>
        <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
      </div>

      <!-- 评论回复 -->
      <!-- 弹出层默认懒加载，导致每次开打的不同评论的回复一样 -->
      <!-- v-if="isPostShow" 解决懒加载问题，每次关闭销毁组件 -->
      <van-popup 
        v-model="isReplyShow" 
        position="bottom" 
        style="height:100%"
        >
        <comment-reply 
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
        />
      </van-popup>

    </div>
  </template>
  
  <script>
import { getArticleById } from '@/api/article'
import FollowUser from '@/components/follow-user'
import { ImagePreview } from 'vant'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment-post.vue'
import CommentReply from './components/comment-reply.vue'

  export default {
    name: 'ArticleIndex',
    components: {
      FollowUser ,
      CollectArticle,
      LikeArticle,
      CommentList, 
      CommentPost,
      CommentReply
    },
    provide: function () {
      return {
        articleId: this.articleId
      }
    },
    props: {
      articleId: {
        type: [Number, String, Object],
        required: true
      }
    },
    data () {
      return {
        article: {}, // 文章详情
        loading: true, // 加载中的loading
        errStatus:0,   // 控制失败状态码
        followLoading:false,
        totalCommentCount:0,
        isPostShow:false, //发布评论状态
        commentList:[],
        isReplyShow: false,
        currentComment:{}
      }
    },
    computed: {},
    watch: {},
    created () {
        this.loadArticle() 
    },
    mounted () {},
    methods: {
        async loadArticle (){
            this.loading = true
            try {
                const { data } = await getArticleById(this.articleId)
                this.article = data.data

                // 初始化图谱点击预览
                setTimeout(() => {
                  this.previewImage()
                  // console.log(this.$refs['article-content'])
                }, 0)

                console.log(data)
                this.loading=false
            } catch (err) {
                if(err.response && err.response.status === 404){
                    this.errStatus = 404
                }
                this.loading=false
                console.log(err)
            }
        },

        // 得到所有image节点
        previewImage () {
          const articleContent = this.$refs['article-content']
          const imgs = articleContent.querySelectorAll('img')
          const images = []
          imgs.forEach( (img, index) => {
            images.push(img.src)
            img.onclick = () => {
              ImagePreview ({
                images,
                startPosition: index,
              })
            }
          })
        },

        onPostSuccess (data) {
          // 关闭弹层
          this.isPostShow = false
          // 将发布内容显示到列表顶部
          this.commentList.unshift(data.new_obj)
          this.commentList.total_count++
        },

        onReplyClick (comment) {
          this.currentComment = comment
          this.isReplyShow = true
        }
    }
  }
  </script>
  
  <style scoped lang="less">
  @import './github-markdown.css';
  .article-container {
    .main-wrap {
      position: fixed;
      left: 0;
      right: 0;
      top: 92px;
      bottom: 88px;
      overflow-y: scroll;
      background-color: #fff;
    }
    .article-detail {
      .article-title {
        font-size: 40px;
        padding: 50px 32px;
        margin: 0;
        color: #3a3a3a;
      }
  
      .user-info {
        padding: 0 32px;
        .avatar {
          width: 70px;
          height: 70px;
          margin-right: 17px;
        }
        .van-cell__label {
          margin-top: 0;
        }
        .user-name {
          font-size: 24px;
          color: #3a3a3a;
        }
        .publish-date {
          font-size: 23px;
          color: #b7b7b7;
        }
        .follow-btn {
          width: 170px;
          height: 58px;
        }
      }
  
      .article-content {
        padding: 55px 32px;
        /deep/ p {
          text-align: justify;
        }
      }
    }
  
    .loading-wrap {
      padding: 200px 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
    }
  
    .error-wrap {
      padding: 200px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      .van-icon {
        font-size: 122px;
        color: #b4b4b4;
      }
      .text {
        font-size: 30px;
        color: #666666;
        margin: 33px 0 46px;
      }
      .retry-btn {
        width: 280px;
        height: 70px;
        line-height: 70px;
        border: 1px solid #c3c3c3;
        font-size: 30px;
        color: #666666;
      }
    }
  
    .article-bottom {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;
      height: 88px;
      border-top: 1px solid #d8d8d8;
      background-color: #fff;
      .comment-btn {
        width: 282px;
        height: 46px;
        border: 2px solid #eeeeee;
        font-size: 30px;
        line-height: 46px;
        color: #a7a7a7;
      }
      /deep/ .van-icon {
        font-size: 40px;
        .van-info {
          font-size: 16px;
          background-color: #e22829;
        }
      }
    }
  }
  </style>
  