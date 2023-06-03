<template>
    <div class="my-container">
        <!-- 登陆后 -->
        <div v-if="user" class="header user-info">
            <div class="base-info">
                <div class="left">
                    <van-image
                     class="tx"
                     :src="userInfo.photo"
                     round
                     fit="cover"
                    />
                    <span class="name">{{ userInfo.name}}</span>
                </div>
                <div class="right">
                    <van-button size="mini" round>编辑资料</van-button>
                </div>
            </div>
            <div class="data-stats">
                <div class="data-item">
                    <span class="count">{{ userInfo.art_count}}</span>
                    <span class="text">头条</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.follow_count}}</span>
                    <span class="text">关注</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.fans_count}}</span>
                    <span class="text">粉丝</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.like_count}}</span>
                    <span class="text">获赞</span>
                </div>
            </div>
        </div>

        <!-- 登录前 -->
        <div v-else class="header not-login">
            <div class="login-btn" @click="$router.push('./login')">
                <img class="mobile-img" src="@/assets/mobile.png" alt="">
                <span class="text">登录/注册</span>
            </div>
        </div>

        <!-- 导航 -->
        <div>
            <van-grid class="grid-nav" :column-num="2" clickable>
                <van-grid-item class="grid-item">
                    <i slot="icon" class="toutiao toutiao-shoucang"></i>
                    <span slot="text" class="text">收藏</span>
                </van-grid-item>
                <van-grid-item class="grid-item">
                    <i slot="icon" class="toutiao toutiao-lishi"></i>
                    <span slot="text" class="text">历史</span>
                </van-grid-item>
            </van-grid>
        </div>

        <!-- 消息 -->
        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学" is-link />
        <van-cell v-if="user" title="退出登录" class="lgout-cell" @click="onLogout" clickable />
        
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
    name: 'MyIndex',
    components: {},
    props: {},
    data () {
        return {
            userInfo: {}
        }
    },
    computed: {
        ...mapState(['user'])
    },
    watch: {},
    created () {
        // 如果用户登录了则请求加载用户信息数据
        if (this.user) {
            this.loadUserInfo()
        }
    },
    mounted () {},
    methods: {
        onLogout () {
            // 退出提示
            this.$dialog.confirm({
                title: '确认退出？',
                }).then(() => {
                    // on confirm
                    // 确认退出：清除登录状态（容器中的user + 本地存储中的user）
                    this.$store.commit('setUser', null)
                })
                .catch(() => {
                    // on cancel
                    console.log("取消")
            })

             
        },

        async loadUserInfo () {
            try {
                const { data } = await getUserInfo()
                this.userInfo = data.data
            } catch (err) {
                this.$toast('获取数据失败，请稍后重试！')
            }
        }
    }
}
</script>

<style scoped lang="less">
.my-container {
    .header {
        height: 360px;
        background: url("~@/assets/banner.png");
        background-size: cover;
    }
    .not-login {
        display: flex;
        justify-content: center;
        align-items: center;
        .login-btn {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .mobile-img {
                width: 132px;
                height: 132px;
                margin-bottom: 15px;
            }
            .text {
                font-size: 28px;
                color: #fff;
            }
        }
    }
    .user-info {
        .base-info {
            height: 230px;
            // background-color: pink;
            padding: 76px 32px 23px;
            box-sizing: border-box;   // 盒子的尺寸为height+padding,设置boxsizing让盒子大小为height的大小
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left {
                display: flex;
                align-items: center;
                .tx {
                    width: 130px;
                    height: 130px;
                    border: 3px solid #fff;
                }
                .name {
                    padding-left: 30px;
                    font-size: 30px;
                    color: #fff;
                }
            }
        }
        .data-stats {
            display: flex;
            // background-color: #ccc;
            .data-item {
                flex: 1;
                height: 130px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                color: #fff;
                .count {
                    font-size: 36px;
                }
                .text {
                    font-size: 23px;
                }
            }
        }
    }
    .grid-nav {
        .grid-item {
            height: 140px;
            margin-bottom: 10px;
            i.toutiao {
                font-size: 45px;
            }
            .toutiao-shoucang {
                color: #eb5253
            }
            .toutiao-lishi {
                color: #ff9d1d; 
            }
            span.text {
                font-size: 28px;
            }
        }
    }
    .lgout-cell {
        text-align: center;
        color: #d86262;
        margin-top: 10px;
    }
}
</style>