<template>
    <view class="users">
        <!--  #ifdef APP-PLUS -->
        <view class="bar"></view>
        <!--  #endif -->
        <view class="infos">
            <navigator hover-class="none" url="/pages/users/info" class="info">
                <image :src="headImg" class="logo" :lazy-load="true"></image>
                <text class="txt">{{nickName || '--'}}</text>
            </navigator>
            <!-- <navigator url="/pages/notice/index" class="notice">
				<image src="../../static/notice.png" class="logo" :lazy-load="true"></image>
			</navigator> -->
        </view>
        <view class="nav-items">
            <navigator  hover-class="none" url="/pages/users/history?types=history" class="item">
                <image src="../../static/users-0.png" class="logo" :lazy-load="true"></image>
                <text class="txt">访问记录</text>
            </navigator>
            <navigator  hover-class="none" url="/pages/users/history?types=collection" class="item">
                <image src="../../static/users-1.png" class="logo" :lazy-load="true"></image>
                <text class="txt">我的收藏</text>
            </navigator>
            <!-- <navigator url="" class="item">
                <image src="../../static/users-2.png" class="logo" :lazy-load="true"></image>
                <text class="txt">关注公众号</text>
            </navigator> -->
            <navigator hover-class="none" url="/pages/users/help" class="item">
                <image src="../../static/users-3.png" class="logo" :lazy-load="true"></image>
                <text class="txt">反馈与帮助</text>
            </navigator>
            <navigator hover-class="none" url="/pages/users/set" class="item">
                <image src="../../static/users-4.png" class="logo" :lazy-load="true"></image>
                <text class="txt">设置</text>
            </navigator>
        </view>
        <update></update>
    </view>
</template>
<script>
export default {
    name: 'users-index',
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
				// uni.hideLoading();
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
.users {
    @include flex;
    width: 100%;
    justify-content: flex-start;
    .bar {
        @include flex;
        width: 100%;
        height: var(--status-bar-height);
        background: linear-gradient(90deg, #F67B03, #F41C11);
    }
    .infos {
        position: relative;
        @include flex;
        width: 100%;
        // height: var(--status-bar-height);
        padding: 59upx 30upx 39upx;
        background: linear-gradient(90deg, #F67B03, #F41C11);
        .info {
            @include flex;
            width: auto;
            .logo {
                @include flex;
                width: 100upx;
                height: 100upx;
                border-radius: 100%;
            }
            .txt {
                @include flex;
                margin-top: 18upx;
                font-family: 'PingFang-SC-Medium';
                @include font-size(30upx);
                color: #ffffff;
                font-weight: bold;
            }
        }
        .notice {
            position: absolute;
			top: 34upx;
			right: 30upx;
			z-index: 999;
			@include flex;
			.logo {
				@include flex;
				width: 36upx;
				height: 36upx;
			}
        }
    }
    .nav-items {
        @include inline-block;
        width: 100%;
        margin-top: 20upx;
        padding-bottom: 50upx;
        background-color: #ffffff;
        .item {
            @include inline-block;
            width: calc(100% / 3);
            margin-top: 50upx;
            text-align: center;
            .logo {
                @include inline-block;
                width: 50upx;
                height: 50upx;
            }
            .txt {
                @include flex;
                margin-top: 20upx;
                @include font-size(24upx);
                color: #666666;
                font-weight: bold;
            }
        }
    }
}
</style>

