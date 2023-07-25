<template>
    <div class="update-gender">
        <van-picker
        title="性别"
        show-toolbar
        :columns="columns"
        :default-index="value"
        @cancel="$emit('close')"
        @confirm="onConfirm"
        @change="onPickerChange"
        />
    </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
    name: 'UpdateGender',
    components: {},
    props: {
        value:{
            type:Number,
            required:true
        }
    },
    data () {
        return {
            columns: ['男', '女'],
            localGender:0
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
                const localGender = this.localGender
                
                await updateUserProfile({
                    gender: localGender
                })
                
                // 更新视图，父页面index调用update-profile时用了v-model传入了input事件
                this.$emit('input',localGender)
                // 关闭弹层
                this.$emit('close')
                // 提示成功
                this.$toast.success("修改成功")
            } catch (err) {
                this.$toast.fail("修改出错，请重试")
            }
        },

        onPickerChange (picker, value, index) {
            this.localGender=index
        }
    }
}
</script>

<style scoped lang="less"></style>