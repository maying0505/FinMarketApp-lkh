<template>
    <view class="borrow-list">
		<view v-for="(borrow, index) in result"
			    :key="index" class="borrow-item" v-if="pageName === 'index' && index === 0 ? false : true">
			<view class="has-ended" v-if="borrow.online_status === '2'">
				<view class="has-ended-mask"></view>
				<image class="has-ended-img" src="/static/q.png" :lazy-load="true"></image>
			</view>
			<view class="item"
			    @click="recode(borrow.platformBm)">
				<view class="title">
					<view class="title-left">
						<image v-if="borrow.logo" :src="BASE_IMG_URL + borrow.logo" class="logo" :lazy-load="true"></image>
						<view class="title-main">
							<text class="txt">{{borrow.name || '--'}}</text>
							<view class="icons" v-if="borrow.defaultLabel">
								<view class="icon">{{borrow.defaultLabel}}</view>
							</view>
						</view>
					</view>
					<view class="strong">立即申请</view>
			    </view>
			    <view class="infos">
			        <view class="info">
						<view class="info-box">
							<view class="strong orange">
							    {{borrow.moneyMin_format}}
							    ~
							    {{borrow.moneyMax_format}}
							</view>
							<view class="small">额度范围</view>
						</view>
			        </view>
			        <view class="info info1">
			            <view class="strong">{{borrow.rate_format}}<text class="assistant">%</text></view>
						<view class="small">{{specificDateItems[borrow.specificDate]}}利率</view>
					</view>
			        <view class="info last">
						<view class="info-box">
							<view class="strong">{{borrow.lendingNum_format}}人</view>
							<view class="small">申请人数</view>
						</view>
					</view>
			    </view>
			</view>
		</view>
        
        <!-- <navigator url="/pages/borrow/detail" class="item">
            <view class="title">
                <image src="../../static/ads.png" class="logo" :lazy-load="true"></image>
                <text class="txt">百度有钱花</text>
                <view class="icons">
                    <text class="icon blue">审核快</text>
                </view>
            </view>
            <view class="infos">
                <view class="info">
                    <view class="small">额度范围</view>
                    <view class="strong orange">1000~5<text class="assistant">万</text></view>
                </view>
                <view class="info">
                    <view class="small">日利率</view>
                    <view class="strong">0.03<text class="assistant">%</text></view>
                </view>
                <view class="info last">
                    <view class="small">2000人今日申请</view>
                    <view class="strong">立即申请</view>
                </view>
            </view>
        </navigator> -->
    </view>
</template>
<script>
export default {
    name: 'base-borrow-list',
    props: {
        result: {
            type: Array,
            default: [], 
        },
		pageName: {
			type: String,
			default: '', 
		}
    },
    data() {
        return {
            BASE_IMG_URL: this.$HTTP_CONFIG.BASE_IMG_URL,
            specificDateItems: {//借款期限配置
                year: '年',
                month: '月',
                day: '日'
            }
        }
    },
	methods:{
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
	}
}
</script>
<style lang="scss" scoped>
@import '../common/styles/defin';
.borrow-list {
    @include flex;
    width: 100%;
    min-height: auto;
	.borrow-item{
		width: 100%;
		margin-bottom: 10upx;
		position: relative;
		background: #fff;
		padding: 0 30upx;
		.has-ended{
			position: absolute;
			width: 100%;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 1;
			.has-ended-mask{
				position: absolute;
				width: 100%;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				background: #fff;
				opacity: 0.7;
			}
			.has-ended-img{
				width: 177upx;
				height: 144upx;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%) translateY(-50%);
			}
		}
		
		.item {
			@include flex;
			width: 100%;
			.title {
				@include flex(row);
				width: 100%;
				padding: 20upx 0 20upx;
				justify-content: flex-start;
				border-bottom: 1upx solid #EEEEEE;
				.title-main{
					flex-direction: column;
				}
				.title-left{
					flex: 1;
					align-items: center;
				}
				.logo {
					@include flex;
					width: 84upx;
					height: 84upx;
					margin-right: 11upx;
					border-radius: 10upx;
				}
				.strong {
					align-items: center;
					justify-content: center;
					@include font-size(24upx);
					padding: 15upx 30upx;
					color: #ffffff;
					background: linear-gradient(90deg, #F67B03, #F41C11);
					border-radius: 30upx;
				}
				.txt {
					@include flex;
					@include font-size(28upx);
					color: #333;
					font-weight: bold;
				}
				.icons {
					@include flex(row);
					margin-top: 10upx;
					.icon {
						@include flex;
						margin-left: 9upx;
						padding: 6upx 14upx;
						@include font-size(20upx);
						color: #FF6F22;
						background: #FFE3D4;
						border-radius: 14upx;
						&.blue {
							color: #3C76F4;
							border-color: #3C76F4;
						}
					}
				}
			}
			.infos {
				@include flex(row);
				width: 100%;
				margin-bottom: 20upx;
				.info {
					@include flex;
					flex: 1;
					align-items: flex-start;
					.info-box{
						flex-direction: column;
					}
					&.last {
						align-items: flex-end;
						
					}
					.small,
					.strong {
						@include flex(row);
						justify-content: flex-start;
						@include font-size(28upx);
						color: #AAAAAA;
						justify-content: center;
					}
					.small{
						@include font-size(24upx);
					}
					.strong {
						margin: 16upx 0;
						margin-bottom: 6upx;
						align-items: flex-end;
						font-weight: bold;
						color: #555555;
						&.orange {
							color: #FF6F22;
						}
						.assistant {
							@include flex;
							font-family: 'DIN-Medium';
							@include font-size(24upx);
						}
					}
				}
				.info1{
					justify-content: center;
					align-items: center;
				}
			}
		}
	}
}
</style>

