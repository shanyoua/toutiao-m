<template>
    <div class="channel-edit">
        <van-cell :border="false">
            <div slot="title" class="title-text">我的频道</div>
            <van-button 
            class="edit-btn "
            type="danger"
            plain
            round
            size="mini"
            @click="isEdit = !isEdit"
            >
            {{ isEdit? '完成':'编辑'}}
            </van-button>
        </van-cell>
        <van-grid class="my-grid" :gutter="10">
            <van-grid-item 
            class="grid-item" 
            v-for="(channel,index) in myChannels" 
            :key="index" 
            @click="onMyChannelClick(channel,index)"
            >
                <van-icon 
                v-show="isEdit && !fiexdChannels.includes(channel.id)"
                slot="icon" 
                name="clear"
                >
                </van-icon>
                <span 
                class="text"
                :class="{ active: index===active }" 
                slot="text"
                >
                {{ channel.name }}
            </span>
            </van-grid-item>
        </van-grid>

        <!-- 频道推荐 -->
        <van-cell :border="false">
            <div slot="title" class="title-text">频道推荐</div>
        </van-cell>
        <van-grid class="recommend-grid" :gutter="10">
            <van-grid-item 
            class="grid-item" 
            v-for="(channel,index) in recommendChannels" 
            :key="index" 
            icon="plus" 
            :text="channel.name" 
            @click="onAddChannel(channel)"
            />
        </van-grid>
    </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
    name: 'ChannelEdit',
    components: {},
    props: {
        myChannels: {
            type:Array,
            required: true
        },
        active: {
            type:Number,
            required: true
        }
    },
    data () {
        return {
            allChannels: [], // 所有频道
            isEdit: false,
            fiexdChannels: [0] // 固定频道
        }
    },
    computed: {
        ...mapState(['user']),
        // 如果依赖的数据发生变化，则计算属性会重新执行
        recommendChannels () {
        // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
            return this.allChannels.filter(channel => {
                // const channels = []

                // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
                return !this.myChannels.find(myChannel => {
                    return myChannel.id === channel.id
                })
            })
        }
        // recommendChannels () {
        //     const channels = []
        //     this.allChannels.forEach(channel => {
        //         // find 遍历数组，找到满足条件的元素项
        //         const ret = this.myChannels.find(myChannel => {
        //         return myChannel.id === channel.id
        //         })

        //         // 如果我的频道中不包括该频道项，则收集到推荐频道中
        //         if (!ret) {
        //             channels.push(channel)
        //         }
        //     })

        //     // 把计算结果返回
        //     return channels
        //     }
    },
    watch: {},
    created () {
        this.loadAllChannels()
    },
    mounted () {},
    methods: {
        async loadAllChannels() {
            try {
                const {data} = await getAllChannels()
                this.allChannels = data.data.channels
            } catch (err) {
                this.$toast('获取推荐失败')
            }
        },

        async onAddChannel (channel) {
            this.myChannels.push(channel)
            // 数据持久化
            // 登录，把数据请求接口放到线上
            if (this.user) {
                try {
                    await addUserChannel({
                        id: channel.id, // 频道id
                        seq: this.myChannels.length // 序号，长度
                    })
                } catch (err) {
                    this.$toast('添加失败，请重试')
                }
            }
            // 未登录，存储到本地
            else {
                setItem('TOUTIAO_CHANNELS', this.myChannels)
            }
            
        },

        onMyChannelClick(channel,index){
            if (this.isEdit) {
                // 1. 如果是固定频道，则不删除
                if (this.fiexdChannels.includes(channel.id)) {
                    return
                }
                // 参数1：要删除的元素的开始索引（包括）
                // 参数2：删除的个数，如果不指定，则从参数1开始一直删除到最后
                this.myChannels.splice(index, 1)
                 // 删除频道在激活频道之前，则更新激活频道，使激活频道不变
                if(index <= this.active) {
                    this.$emit('update-active', this.active-1, true)
                }
                // 4、处理持久化
                this.deleteChannel(channel)
            }
            else {
                // 非编辑状态，执行切换频道
                this.$emit('update-active', index, false)
            }
        },

        async deleteChannel(channel){
            if (this.user) {
                // 数据请求更新
                try {
                    await deleteUserChannel (channel.id)
                } catch(err) {
                    this.$toast('删除失败，请重试')
                }
            }
            else {
                // 数据本地更新
                setItem('TOUTIAO_CHANNELS', this.myChannels)
            }
        }
    }
} 
</script>

<style scoped lang="less">
.channel-edit {
    padding: 85px 0;
    .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;  // 不折行
      background-color: #f4f5f6;
      .van-grid-item__text, .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/.recommend-grid {
    .grid-item {
        .van-grid-item__content {
            flex-direction: row;
            .van-icon-plus {
                font-size: 28px;
                margin-right: 6px;
            }
        }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
}
</style>