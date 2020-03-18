<template>
    <view class="help">
        <view class="operating">
            <text class="title">#热门问题</text>
            <view class="collapse">
                <view class="collapse-group" 
                    v-for="(hot, index) in hotItems"
                    :key="index"
                    @click="showHot(index)">
                    <view class="collapse-title">
                        <text class="txt">{{hot.question}}</text>
                        <text :class="['iconfont', 'icon-fangxiang']"></text>    
                    </view>
                    <view class="collapse-content" v-if="currenHot === index"><rich-text>{{hot.answer}}</rich-text></view>
                </view>
            </view>
        </view>
        <navigator hover-class="none" url="/pages/users/opinion" class="items">
            <image src="../../static/opinion.png" class="logo" :lazy-load="true"></image>
            <view class="assistant">
                <text class="txt">意见反馈</text>
                <text class="iconfont icon-fangxiang"></text>
            </view>
        </navigator>
        <update></update>
    </view>
</template>
<script>
export default {
    name: 'users-help',
    data() {
        return {
            hotItems: [
                {
                    question: '1.申请贷款后多久能出审核结果？',
                    answer: '各个机构的审核时间不同，一般为1小时到3个工日。',
                },
                {
                    question: '2.为什么申请贷款被拒绝？',
                    answer: '各个机构的审核要求不一样，可能是因为您的资质不符合该机构的要求，建议您多申请几家机构的产品',
                },
                {
                    question: '3.为什么放款额度和申请的金额不一致？',
                    answer: '机构会根据您的个人资料进行综合评估，最终放款额度以机构给出的为准，如果未能满足您的资金需求，建议多申请几家产品作为备用金。',
                },
                {
                    question: '4.如何还款？',
                    answer: '每个产品的还款方式不同，机构放款前会跟您确认还款方式，如有疑问，可致电相应的贷款机构。',
                },
                {
                    question: '5.逾期会有什么影响？',
                    answer: '逾期可能会影响您的个人征信，同时会收取逾期费，具体费用视您申请的贷款产品而定，建议您按时还款哦。',
                }
            ],
            currenHot: 0,
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
					module: 'Help',
                    action: 'index',
				}
			}).then(data => {
				// uni.hideLoading();
				if (isDownRefresh) uni.stopPullDownRefresh();
					
				if (data.code === 200) {
					console.log(data.result)
					const result = data.result;
                    this.hotItems = result || [];
				}
			}).catch(err => {
				// uni.hideLoading();
				if (isDownRefresh) uni.stopPullDownRefresh();
			});
		},
        /**
         * 设置显示的帮助
         */
        showHot(index = 0) {
            this.currenHot = index;
        }
    },
    onLoad(params) {
        this.getData();
    },
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
.help {
    @include flex;
    width: 100%;
    justify-content: flex-start;
    .operating {
        @include flex;
        width: 100%;
        padding-left: 30upx;
        background-color: #ffffff;
        .title {
            @include flex;
            width: 100%;
            margin-top: 39upx;
            font-family: 'PingFang-SC-Medium';
            align-items: flex-start;
            @include font-size(30upx);
            color: #222222;
            font-weight: bold;
        }
        .collapse {
            @include flex;
            width: 100%;
            .collapse-group {
                @include flex;
                width: 100%;
                padding: 40upx 30upx 30upx 0;
                border-bottom: 1upx solid #EEEEEE;
                .collapse-title {
                    @include flex(row);
                    width: 100%;
                    align-items: flex-start;
                    .txt {
                        @include flex;
                        flex: 1;
                        align-items: flex-start;
                        font-family: 'PingFang-SC-Medium';
                        @include font-size(26upx, 40upx);
                        color: #222222;
                        font-weight: bold;
                    }
                    .icon-fangxiang {
                        margin-left: 19upx;
                        @include font-size(26upx, 40upx);
                        color: #AAAAAA;
                        transform-style: preserve-3d;
                        backface-visibility: hidden;
                        &.active {
                            transform: rotate(90deg);
                        }
                    }
                }
                .collapse-content {
                    @include flex;
                    width: 100%;
                    margin-top: 27upx;
                    align-items: flex-start;
                    @include font-size(22upx, 36upx);
                    color: #999999;
                    font-weight: bold;
                }
            }
        }
    }
    .items {
        @include flex(row);
        width: 100%;
        height: 108upx;
        margin: 20upx 0;
        padding: 0 30upx;
        background-color: #ffffff;
        .logo {
            @include flex;
            width: 34upx;
            height: 34upx;
            margin-right: 20upx;
        }
        .assistant {
            @include flex(row);
            flex: 1;
            .txt {
                @include flex;
                flex: 1;
                align-items: flex-start;
                font-family: 'PingFang-SC-Medium';
                @include font-size(30upx);
                color: #222222;
                font-weight: bold;
            }
            .icon-fangxiang {
                @include font-size(30upx);
                color: #AAAAAA;
            }
        }
    }
}
</style>

