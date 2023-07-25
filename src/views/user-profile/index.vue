<template>
    <div class="user-profile">
        <!-- 导航栏 -->
        <van-nav-bar 
        class="page-nav-bar"
        title="个人信息"
        left-arrow
        @click-left="$router.back()"
        />

        <input 
        type="file" 
        hidden 
        ref="file"
        @change="onFileChange"
        >

        <!-- 个人信息 -->
        <van-cell 
        title="头像" 
        is-link
        center
        @click="$refs.file.click()"
        >
            <van-image
            class="avator"
            fit="cover"
            round
            :src="user.photo"
            />
        </van-cell>
        <van-cell 
        title="昵称" 
        :value="user.name" 
        is-link 
        @click="isUpdataNameShow=true"
        />
        <van-cell 
        title="性别" 
        :value=" user.gender===1 ? '女':'男' " 
        is-link 
        @click="isUpdataGenderShow=true"
        />
        <van-cell 
        title="生日" 
        :value="user.birthday" 
        is-link 
        @click="isUpdataBdayShow=true"
        />

        <!-- 编辑昵称 -->
        <van-popup 
        v-model="isUpdataNameShow" 
        style="height:100%"
        position="bottom"
        >
        <update-name 
        v-if="isUpdataNameShow"
        @close="isUpdataNameShow = false" 
        v-model="user.name"
        />
        </van-popup>

        <!-- 编辑性别 -->
        <van-popup 
        v-model="isUpdataGenderShow" 
        position="bottom"
        >
        <update-gender 
        v-if="isUpdataGenderShow"
        @close="isUpdataGenderShow=false"
        v-model="user.gender"
        />
        </van-popup>

         <!-- 编辑生日 -->
         <van-popup 
        v-model="isUpdataBdayShow" 
        position="bottom"
        >
        <update-bday 
        v-if="isUpdataBdayShow"
        @close="isUpdataBdayShow=false"
        v-model="user.birthday"
        />
        </van-popup>

         <!-- 编辑头像 -->
         <van-popup 
        v-model="isUpdataPhotoShow" 
        position="bottom"
        style="height:100%;"
        >
        <update-photo 
        v-if="isUpdataPhotoShow"
        :img="img"
        @close="isUpdataPhotoShow=false"
        @update-photo="user.photo=$event"
        />
        </van-popup>
    </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBday from './components/update-bday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
    name: 'UserProfile',
    components: {
        UpdateName,
        UpdateGender,
        UpdateBday,
        UpdatePhoto
    },
    props: {},
    data () {
        return {
            user:{}, // 个人信息
            isUpdataNameShow:false,
            isUpdataGenderShow:false,
            isUpdataBdayShow:false,
            isUpdataPhotoShow:false,
            img:null  //预览图片
        }
    },
    computed: {},
    watch: {},
    created () {
        this.loadUserProfile()
    },
    mounted () {},
    methods: {
        async loadUserProfile () {
            try {
                const { data } = await getUserProfile()
                this.user = data.data
            } catch (err) {
                this.$toast("获取数据失败！")
                console.log(err)
            }
        },

        onFileChange () {
           // 获取文件对象
           const file = this.$refs.file.files[0]
           // 基于文件对象获取blob数据
           this.img = window.URL.createObjectURL(file)
           this.isUpdataPhotoShow=true
           // file-input 如果选了同一个文件不会触发change事件
           // 解决办法就是每次使用完毕，把它的路径value清空
           this.$refs.file.value = ''
        }
    }
}
</script>

<style scoped lang="less">
.user-profile{
    .avator{
        width: 60px;
        height: 60px;
    }
    /deep/.van-popup {
        background-color: #f5f7f9;
    }
}
</style>