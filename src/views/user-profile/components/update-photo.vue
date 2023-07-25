<template>
    <div class="update-photo">
        <img class="img" :src="img" ref="img">
        <div class="toolbar">
            <div class="cancle" @click="$emit('close')">取消</div>
            <div class="confirm" @click="onConfirm">完成</div>
        </div>
    </div>
</template>

<script>
import { updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
    name: 'UpdatePhoto',
    components: {},
    props: {
        img:{
            type:[String,Object],
            required:true
        }
    },
    data () {
        return {
            cropper: null
        }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {
        // 图片剪切，需要操作dom，所以再mounted中操作
        const image = this.$refs.img
        this.cropper = new Cropper(image, {
            viewMode: 1,  // 裁剪框大小限制，0，1，2，3；0可以拖到画幅外
            dragMode: 'move',  // 拖动模式，默认crop，可以自拉不适合手机
            aspectRatio: 1,
            autoCropArea: 1,
            cropBoxMovable: false,
            cropBoxResizable: false,
            background: false,
            movable: true

        })
    },
    methods: {
        // 纯客户端裁切
        onConfirm () {
            this.cropper.getCroppedCanvas().toBlob(blob=>{
                this.updateUserPhoto(blob)
            })
        },
        async updateUserPhoto(blob) {
            this.$toast.loading({
                message:'保存中……',
                forbidClick: true,
                duration: 0 // 持续展示
            })

            try {
                 // 要求的时fordata数据
                const formData = new FormData()
                formData.append('photo', blob)
                const {data} = await updateUserPhoto(formData)
                // 关闭弹出层
                this.$emit('close')
                // 更新视图
                this.$emit('update-photo', data.data.photo)
                this.$toast.success("更新成功")
            } catch (err) {
                this.$toast("更换失败，请重试")

            } 
        }
    }
}
</script>

<style scoped lang="less">
.update-photo{
    background-color: #000;
    height: 100%;
    .toolbar {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        .cancle, .confirm {
            width: 90px;
            height: 90px;
            font-size: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
        }
    }
}
.img {
    display: block;
    max-width: 100%;
}


</style>