<template>
    <view class="set">
        <view class="items">
            <navigator hover-class="none" :url="'/pages/forget/index?mobile=' + mobile" class="item">
                <text class="iconfont icon-xiugaimima"></text>
                <text class="title">修改密码</text>
                <view class="assistant">
                    <text class="iconfont icon-fangxiang"></text>
                </view>
            </navigator>
            <!-- <view class="item">
                <text class="iconfont icon-message_icon"></text>
                <text class="title">消息推送</text>
                <view class="assistant">
                    <switch type="switch" />
                </view>
            </view> -->
            <view class="item" @click="cacheBox(true)">
                <text class="iconfont icon-qinglihuancun"></text>
                <text class="title">清理缓存</text>
                <view class="assistant">
                    <text class="txt">{{currentSize}}M</text>
                    <text class="iconfont icon-fangxiang"></text>
                </view>
            </view>
            <view class="item" @click="update">
                <text class="iconfont icon-gengxin"></text>
                <text class="title">版本更新</text>
                <view class="assistant">
                    <text class="txt">版本V{{version}}</text>
                    <text class="iconfont icon-fangxiang"></text>
                </view>
            </view>
            <!-- <navigator url="" class="item">
                <text class="iconfont icon-pingjia"></text>
                <text class="title">前往评价</text>
                <view class="assistant">
                    <text class="iconfont icon-fangxiang"></text>
                </view>
            </navigator> -->
            <navigator hover-class="none" url="/pages/agreement/register" class="item">
                <text class="iconfont icon-guanyu"></text>
                <text class="title">用户协议</text>
                <view class="assistant">
                    <text class="iconfont icon-fangxiang"></text>
                </view>
            </navigator>
        </view>
        <view class="btn-box">
            <button class="base-btn" @click="loginOut">退出登录</button>
        </view>
        <view class="modules-pop" v-if="isShowCash">
            <view class="container">
                <view class="infos">
                    <image src="../../static/cache-clear.png" class="logo" :lazy-load="true"></image>
                    <text class="txt">确定要清除缓存？</text>
                </view>
                <view class="btns">
                    <button @click="cacheBox(false)">取消</button>
                    <button class="blue" @click="getCashInfo(true)">确定</button>
                </view>
            </view>
        </view>
        <update :is-show="isUpdate" :pro-version="appInfo.version" :pro-infos="appInfo.infos"></update>
    </view>
</template>
<script>
export default {
    name: 'users-set',
    data() {
        return {
            isShowCash: false,
            currentSize: 0,
            mobile: '',//电话号码
            version: '1.0.2',//版本号
            isUpdate: false,//是否更新
            appInfo: {
                infos: '',
                version: '',
            }
        }
    },
    methods: {
        /**
         * 获取缓存数据
         */
        getCashInfo(isClear) {
            const _self = this;
            if (isClear) {
                this.cacheBox(false);
                uni.showLoading({
                    title: '正在清理中...',
                    mask: true,
                });
                const timer = setTimeout(() => {
                    clearTimeout(timer);
                    uni.hideLoading();
                    this.currentSize = 0;
                }, 2000);
                return;
            }
            uni.getStorageInfo({
                success: function (res) {
                    _self.currentSize = res.currentSize || 0;
                }
            });
        },
        /**
         * 缓存清理提示
         */
        cacheBox(isShowCash = false) {
            if (isShowCash) {
                if (!parseFloat(this.currentSize)) {
                    uni.showToast({
                        icon: 'none',
                        title: '没有需要清理的缓存啦',
                    });
                    return;
                }
            }
            this.isShowCash = isShowCash;
        },
        /**
         * 退出登录
         */
        loginOut() {
            uni.showLoading({
                title: '正在退出中...',
                mask: true,
            });
            uni.removeStorage({
                key: 'userId',
                success(res) {
                    uni.hideLoading();
                    uni.switchTab({
                        url: '/pages/index/index'
                    });
                },
                fail() {
                    uni.hideLoading();
                    uni.showToast({
                        icon: 'none',
                        title: '退出失败',
                    });
                }
            });
        },
        /**
		 * 获取数据
		 */
		getData() {
			this.$http({
				data: {
					module: 'Userinfo',
                    action: 'loadInfo',
                    isAuth: '1',
				}
			}).then(data => {
				if (data.code === 200) {
					const result = data.result;
                    this.mobile = result.phoneNumber || '';
				}
			}).catch(err => {
			});
        },
        /**
         * 更新
         */
        update() {
            uni.showLoading({
                title: '正在获取更新...',
                mask: true,
            });
            this.$http({
				data: {
					module: 'Start',
                    action: 'start',
				}
			}).then(data => {
                uni.hideLoading();
				const result = data.result || {};
                const isIos = uni.getSystemInfoSync().platform === 'ios';
                if (data.code === 200) {
                    this.appInfo.infos = isIos ? result.iosVersionInfo : result.androidVersionInfo;
                    this.appInfo.version = isIos ? result.iosVersionName : result.androidVersionName;
                    if (this.version !== this.appInfo.version) {
                        this.isUpdate = true;
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: '已经是最新版啦',
                        });
                        // this.isUpdate = true;
                        // this.appInfo.infos = '搞笑的<br>只是测试以下可以弹出来不';
                        // this.appInfo.version = '2.2.2';
                    }
                }
			}).catch(err => {
                uni.hideLoading();
			});
            
        }
    },
    onLoad() {
        this.getData();
        this.getCashInfo();
        this.version = uni.getStorageSync('version') || '1.0.2';
    },
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
.set {
    @include flex;
    width: 100%;
    justify-content: flex-start;
    .items {
        @include flex;
        width: 100%;
        padding-left: 30upx;
        background-color: #ffffff;
        .item {
            @include flex(row);
            width: 100%;
            height: 107upx;
            padding-right: 30upx;
            border-bottom: 1upx solid #EEEEEE;
            .iconfont {
                margin-right: 20upx;
                @include font-size(40upx);
                color: #999999;
                font-weight: bold;
            }
            .title {
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
                .txt {
                    @include font-size(28upx);
                    color: #999999;
                    font-weight: bold;
                }
                .icon-fangxiang {
                    margin-left: 19upx;
                    margin-right: 0;
                    @include font-size(28upx);
                    color: #999999;
                }
            }
        }
    }
    .btn-box {
        @include flex;
        width: 100%;
        margin: 100upx 0;
        padding: 0 30upx;
    }
    .modules-pop {
        position: fixed;
        left: 0;
        top: 0;
        @include flex;
        width: 100%;
        height: 100%;
        background-color: $uni-bg-color-mask;
        .container {
            @include flex;
            width: 550upx;
            background-color: #ffffff;
            border-radius: 10upx;
            overflow: hidden;
            .infos {
                @include flex;
                width: 100%;
                padding: 20upx 30upx 49upx;
                .logo {
                    @include flex;
                    width: 202upx;
                    height: 131upx;
                }
                .txt {
                    @include flex;
                    margin-top: 29upx;
                    font-family: 'PingFang-SC-Medium';
                    @include font-size(30upx);
                    color: #222222;
                    font-weight: 500;
                }
            }
            .btns {
                @include flex(row);
                width: 100%;
                border-top: 1upx solid #EEEEEE;
                button {
                    @include flex;
                    flex: 1;
                    height: 80upx;
                    @include font-size(30upx);
                    color: #999999;
                    background-color: #ffffff;
                    &.blue {
                        border-left: 1upx solid #EEEEEE;
                        color: #3C76F4;
                    }
                }
            }
        }
    }
}
</style>

