<template>
    <view class="info">
        <view class="info-items">
            <view class="item">
                <text class="txt">头像</text>
                <view class="assistant"><image :src="headImg" class="pic" :lazy-load="true"></image></view>
            </view>
        </view>
        <view class="info-items mt-20">
            <view class="item">
                <text class="txt">昵称</text>
                <view class="assistant">{{nickName || ''}}</view>
            </view>
            <navigator hover-class="none" url="/pages/users/setInfo" class="item">
                <text class="txt">个人资料</text>
                <view class="assistant">查看详情<text class="iconfont icon-fangxiang"></text></view>
            </navigator>
        </view>
        <update></update>
    </view>
</template>
<script>
export default {
    name: 'users-info',
    data() {
        return {
            headImg: '',//头像
            nickName: '',//昵称
        }
    },
    /**
	 * 刷新
	 */
	onPullDownRefresh() {
		this.getData(true);
	},
    methods: {
        /**
		 * 获取数据
		 */
		getData(isDownRefresh) {
			// uni.showLoading({
            //     title: '数据加载中...',
            //     mask: true,
            // });
			this.$http({
				data: {
					module: 'User',
                    action: 'central',
                    isAuth: '1',
				}
			}).then(data => {
				uni.hideLoading();
				if (isDownRefresh) uni.stopPullDownRefresh();
					
				if (data.code === 200) {
					const result = data.result;
                    this.headImg = `${this.$HTTP_CONFIG.BASE_IMG_URL}${result.headImg}`;
                    this.nickName = result.nickName || '';
				}
			}).catch(err => {
				// uni.hideLoading();
				if (isDownRefresh) uni.stopPullDownRefresh();
			});
		}
    },
    // onLoad(params) {
    //     if (this.$isAuth()) {
    //         this.getData();
    //     }
    // },
    onShow() {
        if (this.$isAuth()) {
            this.getData();
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
.info {
    @include flex;
    width: 100%;
    justify-content: flex-start;
    .info-items {
        @include flex;
        width: 100%;
        padding-left: 30upx;
        background-color: #ffffff;
        &.mt-20 {
            margin-top: 20upx;
        }
        .item {
            @include flex(row);
            width: 100%;
            height: 108upx;
            padding-right: 30upx;
            border-bottom: 1upx solid #EEEEEE;
            .txt {
                @include flex;
                flex: 1;
                align-items: flex-start;
                font-family: 'PingFang-SC-Medium';
                @include font-size(30upx);
                color: #222222;
                font-weight: bold;
            }
            .assistant {
                @include flex(row);
                width: auto;
                @include font-size(28upx);
                color: #999999;
                font-weight: bold;
                .pic {
                    @include flex;
                    width: 40upx;
                    height: 40upx;
                    border-radius: 100%;
                }
                .icon-fangxiang {
                    margin-left: 19upx;
                    @include font-size(28upx);
                    color: #999999;
                }
            }
        }
    }
}
</style>

