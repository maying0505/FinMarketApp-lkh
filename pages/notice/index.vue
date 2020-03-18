<template>
    <view class="notice">
        <view class="items">
            <text class="timer">05月23日 12:23</text>
            <navigator hover-class="none" url="/pages/notice/detail" class="item type-pic">
                <image src="https://iph.href.lu/750x320" class="pic" :lazy-load="true"></image>
            </navigator>
            <navigator hover-class="none" url="/pages/notice/detail" class="item">
                待收余额法是P2P网贷平台在并购时估值的一种方法。政策环境不确定性、平台业绩变化快、未来盈利难...
            </navigator>
            <navigator hover-class="none" url="/pages/notice/detail" class="item">
                待收余额法是P2P网贷平台在并购时估值的一种方法。政策环境不确定性、平台业绩变化快、未来盈利难...
            </navigator>
            <navigator hover-class="none" url="/pages/notice/detail" class="item">
                待收余额法是P2P网贷平台在并购时估值的一种方法。政策环境不确定性、平台业绩变化快、未来盈利难...
            </navigator>
        </view>
    </view>
</template>
<script>
export default {
    name: 'notice-index',
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
.notice {
    @include flex;
    width: 100%;
    padding: 0 30upx;
    justify-content: flex-start;
    .items {
        @include flex;
        width: 100%;
        border-radius: 10upx;
        overflow: hidden;
        .timer {
            @include flex;
            margin: 30upx 0;
            padding: 12upx 15upx;
            @include font-size(24upx);
            color: #222222;
            font-weight: bold;
            background-color: #EEEEEE;
            border-radius: 10upx;
        }
        .item {
            @include flex;
            width: 100%;
            padding: 32upx 30upx;
            @include font-size(24upx, 40upx);
            color: #666666;
            font-weight: bold;
            background-color: #ffffff;
            border-bottom: 1upx solid #EEEEEE;
            &.type-pic {
                padding: 0;
                .pic {
                    @include inline-block;
                    width: 100%;
                }
            }
        }
    }
}
</style>

