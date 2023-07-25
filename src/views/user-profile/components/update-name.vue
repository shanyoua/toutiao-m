<template>
    <div class="update-name">
        <!-- 导航栏 -->
        <van-nav-bar 
            title="设置昵称"
            left-text="取消"
            right-text="完成"
            @click-left="$emit('close')"
            @click-right="onConfirm"
        />

        <!-- 输入框 -->
        <div class="field-wrap">
            <van-field
            v-model.trim="localName"
            rows="2"
            autosize
            type="textarea"
            maxlength="7"
            placeholder="请输入昵称"
            show-word-limit
            />
        </div>
    </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
    name: 'UpdateName',
    components: {},
    props: {
        value:{
            type:String,
            required:true
        }
    },
    data () {
        return {
            localName: this.value
        }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {
        async onConfirm () {
            this.$toast.loading({
                message:'保存中……',
                forbidClick: true,
                duration: 0 // 持续展示
            })
            try {
                const localName = this.localName
                if( !localName.length ) {
                    this.$toast("昵称不能为空")
                    return
                }
                else{
                    const { data } = await updateUserProfile({
                        name: localName
                    })
                    console.log(data)
                }
                // 更新视图，父页面index调用update-profile时用了v-model传入了input事件
                this.$emit('input',localName)
                // 关闭弹层
                this.$emit('close')
                // 提示成功
                this.$toast.success("修改成功")
            } catch (err) {
                this.$toast.fail("修改出错，请重试")
            }
        }
    }
}
</script>

<style scoped lang="less">
.field-wrap {
    padding: 20px;
}
</style>