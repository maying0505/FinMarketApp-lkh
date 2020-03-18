<template>
    <view class="opinion">
        <view class="operating">
            <text class="title">内容描述</text>
            <textarea class="write" v-model="opinion" placeholder="告诉我们您遇到的问题，我们会第一时间处理（5-60个字）" maxlength="60" :focus="true" :placeholder-style="'color: #999999;'" />
        </view>
        <button class="base-btn" @click="_send_opinion">提交</button>
        <update></update>
    </view>
</template>
<script>
export default {
    name: 'users-opinion',
    data() {
        return {
            opinion: '',//意见内容
        }
    },
    methods: {
        /**
         * 提交意见
         */
        _send_opinion() {
            // TODO 假的
            const opinionrlen = this.opinion.length;
            if (!this.opinion || opinionrlen < 5 || opinionrlen > 60) {
                uni.showToast({
                    icon: 'none',
                    title: '请正确输入5-60字意见',
                });
                return;
            }
            uni.showLoading({
                title: '正在提交中...',
                mask: true,
            });
            const timer = setTimeout(() => {
                clearTimeout(timer);
                uni.hideLoading();
					
                uni.navigateBack({
                    delta: 1
                });
            }, 1000);
        }
    },
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
.opinion {
    @include flex;
    width: 100%;
    padding: 0 30upx;
    justify-content: flex-start;
    background-color: #ffffff;
    .operating {
        @include flex;
        width: 100%;
        .title {
            @include flex;
            width: 100%;
            padding: 50upx 0 30upx;
            align-items: flex-start;
            @include font-size(30upx);
            color: #222222;
            font-weight: bold;
        }
        .write {
            @include inline-block;
            width: 100%;
            height: 291upx;
            padding: 30upx;
            @include font-size(24upx, 1.5);
            color: #999999;
            font-weight: bold;
            text-align: left;
            background-color: #EEEEEE;
        }
    }
    .base-btn {
        margin: 100upx 0;
    }
}
</style>
