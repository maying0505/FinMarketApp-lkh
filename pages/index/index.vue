<template>
	<view class="index">
		<view class="popularize">
			<!-- <navigator url="/pages/notice/index" class="notice">
				<view class="bar"></view>
				<image src="../../static/notice.png" class="logo" :lazy-load="true"></image>
			</navigator> -->
			<swiper class="swiper" 
				:autoplay="true"
				:circular="true"
				:indicator-dots="true"
				:indicator-color="'rgba(255, 255, 255, .5)'"
				:indicator-active-color="'#F67B03'">
				<swiper-item v-for="(banner, index) in bannerItems"
					:key="index">
					<view class="contennt" @click="set_banner(banner.url, banner.url_type)">
						<image :src="BASE_IMG_URL + banner.image" class="pic" :lazy-load="true"></image>
					</view>
				</swiper-item>
				<!-- <swiper-item>
					<navigator url="/pages/web?url=http://t.cn/EbLk3Yx" class="contennt">
						<image src="https://iph.href.lu/750x320" class="pic" :lazy-load="true"></image>
					</navigator>
				</swiper-item>
				<swiper-item>
					<navigator url="/pages/web?url=http://t.cn/EbLk3Yx" class="contennt">
						<image src="https://iph.href.lu/750x320" class="pic" :lazy-load="true"></image>
					</navigator>
				</swiper-item> -->
			</swiper>
		</view>
		<view class="recommend-items" v-if="platform[0]">
			<view class="recommend-items-title"><text class="main-text">今日首推</text><text class="bg-border"></text></view>
			<view class="recommend-items-main">
				<view class="all-finshed" v-if="platform[0].online_status === '2'"></view>
				<view class="item" @click="recode(platform[0].platformBm)">
					<view class="left">
						<image v-if="platform[0].logo" :src="BASE_IMG_URL + platform[0].logo" class="logo" :lazy-load="true"></image>
						<view class="title">
							<view class="title-info">
								<text class="txt">{{platform[0].name || '--'}}</text>
								<view class="icons" v-if="platform[0].defaultLabel">
								    <view class="icon">{{platform[0].defaultLabel}}</view>
								</view>
							</view>
							<view class="info">
							    <view class="small">额度范围</view>
							    <view class="strong orange">
							        {{platform[0].moneyMin_format}}
							        ~
							        {{platform[0].moneyMax_format}}
							    </view>
							</view>
						</view>
					</view>
					<view class="info right">
					    {{platform[0].online_status === '2' ? '全部抢光':'立即申请'}}
					</view>
				</view>
				<view class="reminder">
					温馨提示：申请5款以上产品，成功率超过99%！
				</view>
			</view>
		</view>
		<view class="hot-items">
			<navigator hover-class="none" url="/pages/borrow/index" open-type="switchTab" class="title recommend-items">
				<view class="recommend-items-title"><text class="main-text">热门推荐</text><text class="bg-border"></text></view>
				<view class="assistant">
					更多
					<text class="iconfont icon-fangxiang"></text>
				</view>
			</navigator>
			<borrow-list :result="platform" pageName="index"></borrow-list>
		</view>
		<update></update>
	</view>
</template>
<script>
import BorrowList from '../../components/BorrowList';
export default {
	name: 'index',
	components: {
		BorrowList,
	},
	data() {
		return {
			// aa: '0',
			BASE_IMG_URL: this.$HTTP_CONFIG.BASE_IMG_URL,
			bannerItems: [],//广告图
			platform: [],//推荐列表数据
			specificDateItems: {//借款期限配置
			    year: '年',
			    month: '月',
			    day: '日'
			}
		}
	},
	/**
	 * 刷新
	 */
	onPullDownRefresh() {
		// uni.startPullDownRefresh();
		// uni.stopPullDownRefresh();
		this.getData(true);
	},
	methods: {
		/**
		 * 立即申请
		 */
		recode(platformBm) {
		    uni.showLoading({
		        title: '申请中...',
		        mask: true,
		    });
			this.$http({
				data: {
					module: 'PlatformList',
		            action: 'recode',
		            isAuth: '1',
		            platformBm: platformBm,
		            loanMoney: 0,
		            loanTime: 0,
				}
			}).then(data => {
		        uni.hideLoading();
		        if (data.code === 200) {
					let platformURL = data.result.platformURL;
		            uni.navigateTo({
		                url: `/pages/web?url=${platformURL}`
		            });
		        }
			}).catch(err => {
				uni.hideLoading();
			});
		},
		/**
		 * banner跳转
		 */
		set_banner(url = '', url_type = '') {
			if (url_type === '1') {
				uni.navigateTo({
					url: `/pages/web?url=${url}`,
				});
			} else if (url_type === '2') {
				// 跳转贷款超市
				if (url.indexOf('/pages/borrow/index') !== -1) {
					url = url.replace('/pages/borrow/index?', '');
					// console.log(url);
					const _query = this.$filter.getQuery(url);
					let labels = '';
					let types = '';
					if (_query['defaultLabel']) {
						labels = _query['defaultLabel'] || '';
						types = 'defaultLabel';
					} else {
						labels = _query['label'] || '';
						types = 'label';
					}
					this.$store.dispatch('setLabelAsync', {
						label: labels,
						types: types,
						status: 'set',
					});
					uni.switchTab({
						url: '/pages/borrow/index',
					});
				} else {
					uni.navigateTo({
						url: url,
					});
				}
			};
		},
		/**
		 * 获取banner
		 */
		getBanner() {
			return this.$http({
				data: {
					module: 'Start',
					action: 'banner'
				}
			})
		},
		/**
		 * 获取列表数据
		 */
		getHomeplatform() {
			return this.$http({
				data: {
					module: 'platform',
					action: 'homeplatform',
				}
			});
		},
		/**
		 * 获取数据
		 */
		getData(isDownRefresh) {
			// uni.showLoading({
            //     title: '数据加载中...',
            //     mask: true,
            // });
			Promise.all([this.getBanner(), this.getHomeplatform()]).then(res => {
				// uni.hideLoading();
				if (isDownRefresh) uni.stopPullDownRefresh();

				const _banner = res[0];
				const _homeplatform = res[1];
				if (_banner.code === 200) {
					const _bannerResult = _banner.result;
					let _banner_temp = [];
					if (_bannerResult) {
						for (let _banner of _bannerResult) {
							_banner_temp.push(Object.assign(_banner, {
								url_type: _banner.url.indexOf('https://') !== -1 
									|| _banner.url.indexOf('http://') !== -1 ? '1' : 
									_banner.url.indexOf('/pages') !== -1 ? '2' : '0',
							}));
						}
					}
					this.bannerItems = _banner_temp;
				}
				if (_homeplatform.code === 200) {
					const _homeplatformResult = _homeplatform.result;
					if (_homeplatform && _homeplatformResult.platform) this.platform = this.$borrowListFilter(_homeplatformResult.platform);
				}
			}).catch(err => {
				// uni.hideLoading();
				if (isDownRefresh) uni.stopPullDownRefresh();
			});
		},
		/**
		 * 跳转tab贷款超市
		 */
		// setLables(pages = '/pages/borrow/index', labels = '', types = 'label') {
		// 	this.$store.dispatch('setLabelAsync', {
		// 		label: labels,
		// 		types: types,
		// 		status: 'set',
		// 	});
		// 	uni.switchTab({
		// 		url: pages,
		// 	});
		// },
	},
	onLoad(params) {
		this.getData();
		//console.log(params.t);
		if(params.t != undefined && params.t != ''){
			uni.setStorageSync('userId', params.t);
		}
		
		// uni.showLoading({
		//     title: this.aa
		// });
		// this.aa = '999'
	}
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
.index {
	@include flex;
	width: 100%;
	justify-content: flex-start;
	background-color: #F6F6FB;
	.popularize {
		position: relative;
		@include inline-block;
		width: 100%;
		.notice {
			position: absolute;
			top: 34upx;
			right: 30upx;
			z-index: 999;
			@include flex;
			.bar {
				@include flex;
				width: 36upx;
				height: var(--status-bar-height);
			}
			.logo {
				@include flex;
				width: 36upx;
				height: 36upx;
			}
		}
		.swiper {
			@include inline-block;
			width: 100%;
			height: 320upx;
			.contennt {
				@include inline-block;
				width: 100%;
				height: 320upx;
				.pic {
					width: 750upx;
					height: 320upx;
				}
			} 
		}
	}
	.popularize-items {
		@include flex;
		width: 100%;
		padding: 0 30upx;
		background-color: #ffffff;
		.item {
			@include flex(row);
			width: 100%;
			padding: 30upx 0;
			border-bottom: 1upx solid #EEEEEE;
			&.last {
				border-bottom: none;
			}
			.group {
				@include flex(row);
				width: 50%;
				.info {
					@include flex;
					flex: 1;
					align-items: flex-start;
					.strong,
					.small {
						@include flex;
						@include font-size(24upx, 30upx);
						color: #999999;
						font-weight: 400;
					}
					.strong {
						margin-bottom: 19upx;
						font-family: 'PingFang-SC-Medium';
						@include font-size(30upx);
						color: #222222;
						font-weight: 500;
					}
				}
				.logo {
					@include flex;
					width: 99upx;
					height: 78upx;
				}
			}
			.line {
				@include flex;
				width: 1upx;
				height: 68upx;
				margin: 0 19upx;
				background-color: #EEEEEE;
			}
		}
		.ad-items {
			@include flex;
			width: 100%;
			margin: 43upx 0;
			.logo {
				@include flex;
				width: 687upx;
				height: 108upx;
			}
		}
	}
	.recommend-items{
		width: 100%;
		flex-direction: column;
		.recommend-items-title{
			position: relative;
			padding: 0 30upx;
			margin-top: 30upx;
			margin-bottom: 10upx;
			@include font-size(24upx);
		}
		.recommend-items-main{
			width: 100%;
			background: #fff;
			position: relative;
			flex-direction: column;
			padding: 28upx 30upx;
			.reminder{
				@include font-size(24upx);
				margin-top: 18upx;
				padding-left: 32upx;
				margin-left: 20upx;
				background: url(../../static/24.png) no-repeat;
				background-size: contain;
				color: #666;
			}
			.all-finshed{
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
			}
		}
		.main-text{
			position: relative;
			z-index: 1;
			color: #333;
			@include font-size(30upx);
			font-weight: bold;
		}
		.bg-border{
			background: linear-gradient(90deg, #f7574f, #F67B03);
			width: 64upx;
			height: 10upx;
			position: absolute;
			bottom: 0upx;
			left: 90upx;
		}
		.item {
			@include flex;
			width: 100%;
			background: #323232;
			padding: 15upx 20upx;
			border-bottom: 1upx solid #EEEEEE;
			border-radius: 70upx;
			flex-direction: row;
			color: #fff;
			.left{
				flex: 1;
				align-items: center;
				.logo{
					width: 100upx;
					height: 100upx;
					border-radius: 100%;
				}
				.title{
					flex-direction: column;
					margin: 0 20upx;
					.title-info{
						flex-direction: row;
						align-items: center;
						.txt{
							@include font-size(30upx);
							font-weight: bold;
						}
						.icons{
							@include font-size(20upx);
							color: #D26026;
							border: 1px solid #D26026;
							border-radius: 20upx;
							padding: 4upx 14upx;
							margin: 0 10upx;
							line-height: 1.1;
						}
					}
					.info{
						@include font-size(20upx);
						color: #777777;
						margin-top: 10upx;
					}
				}
			}
			.right{
				width: 100upx;
				height: 100upx;
				@include font-size(26upx);
				padding: 24upx;
				line-height: 1.2;
				align-items: center;
				justify-content: center;
				background: linear-gradient(90deg, #F67B03, #F41C11);
				border-radius: 100%;
			}
		}
	}
	.hot-items {
		@include flex;
		width: 100%;
		margin-bottom: 20upx;
		borrow-list{
			width: 100%;
		}
		.title {
			@include flex(row);
			justify-content: flex-start;
			width: 100%;
			height: 88upx;
			padding-right: 30upx;
			.recommend-items-title{
				flex: 1;
			}
			.txt {
				@include flex;
				flex: 1;
				align-items: flex-start;
				font-family: 'PingFang-SC-Medium';
				@include font-size(30upx);
				color: #222222;
			}
			.assistant {
				@include flex(row);
				width: auto;
				@include font-size(24upx, 30upx);
				color: #999999;
				.icon-fangxiang {
					position: relative;
					top: -1upx;
					margin-left: 11upx;
					@include font-size(24upx, 30upx);
					color: #999999;
				}
			}
		}
	}
}
</style>


