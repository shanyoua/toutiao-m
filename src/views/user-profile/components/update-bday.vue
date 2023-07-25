<template>
    <div class="update-bday">
        <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="$emit('close')"
        @confirm="onConfirm"
        />
    </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
    name: 'UpdateBday',
    components: {},
    props: {
        value:{
            type:String,
            required:true
        }
    },
    data () {
        return {
            minDate: new Date(1970, 0, 1),
            maxDate: new Date(),
            currentDate: new Date(this.value),
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
                const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
                
                await updateUserProfile({
                    birthday: currentDate
                })
                
                // 更新视图，父页面index调用update-profile时用了v-model传入了input事件
                this.$emit('input',currentDate)
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

<style scoped lang="less"></style>