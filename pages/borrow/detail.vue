<template>
    <view class="detail">
        <view class="operating">
            <view class="content">
                <view class="write">
                    <view class="group mr-30">
                        <text class="small">额度 {{platform.moneyMin_format || '0'}}~{{platform.moneyMax_format || '0'}}元</text>
                        <view class="strong">
                            <input type="digit" class="input" v-model="loanMoney" maxlength="7" :placeholder="'0'" :placeholder-style="'color: #FFFFFF;'" />
                            <text class="assistant">元</text>
                            <text class="iconfont icon-pingjia"></text>
                        </view>
                    </view>
                    <view class="group">
                        <text class="small">期限 1~{{maxMonth}}月</text>
                        <view class="strong">
                            <!-- <input type="digit" class="input" v-model="time" maxlength="7" :placeholder="'请输入期限'" :placeholder-style="'color: #CCCCCC;'" /> -->
                            <picker :value="loanCycleIndex" :range="loanCycle" @change="selectedLoan">
                                <view class="selected-loan">{{loanTimeShow || '0天'}}</view>
                            </picker>
                            <!-- <text class="assistant">月</text> -->
                            <text class="iconfont icon-pingjia"></text>
                        </view>
                    </view>
                    <view class="mask"></view>
                    <view class="mask right"></view>
                </view>
                <view class="info">
                    <view class="group">
                        <text class="small">还款金额</text>
                        <text class="strong">{{total_format}}元</text>
                    </view>
                    <view class="group">
                        <text class="small">到账金额</text>
                        <text class="strong">{{loanMoney_format}}元</text>
                    </view>
                    <view class="group" @click="showInfo">
                        <view class="small">
                            利息和服务费
                            <view class="assistant">{{isShowInfo ? '收起' : '明细'}}<text class="iconfont icon-xia2"></text></view>
                        </view>
                        <text class="strong">{{interest_format}}元</text>
                    </view>
                </view>
            </view>
            <view class="bgs"></view>
        </view>
        <view class="data">
            <view class="modules-title">平台数据</view>
            <view class="items">
                <view class="item">
                    <view class="data-show">
                        <view class="content">
                            <text class="strong">{{platform.lendingNum_format}}</text>
                            <text class="small">万</text>
                        </view>
                    </view>
                    <text class="txt">申请人数</text>
                </view>
                <view class="item">
                    <view class="data-show two">
                        <view class="content">
                            <text class="strong">{{randDate.pend_time}}</text>
                            <text class="small">分钟</text>
                        </view>
                    </view>
                    <text class="txt">审核时间</text>
                </view>
                <view class="item">
                    <view class="data-show three">
                        <view class="content">
                            <text class="strong">{{randDate.repay_time}}</text>
                            <text class="small">分钟</text>
                        </view>
                    </view>
                    <text class="txt">放款速度</text>
                </view>
                <view class="item">
                    <view class="data-show four">
                        <view class="content">
                            <text class="strong">{{randDate.rate}}</text>
                            <text class="small">%</text>
                        </view>
                    </view>
                    <text class="txt">通过概率</text>
                </view>
            </view>
        </view>
        <view class="infos">
            <view class="modules-title">贷款流程</view>
            <view class="steps">
                <view class="item">
                    <image src="../../static/detail-step-0.png" class="pic" :lazy-load="true"></image>
                    <text class="small">提交申请</text>
                </view>
                <view class="item">
                    <image src="../../static/detail-step-1.png" class="pic" :lazy-load="true" :style="'width: 34upx; height: 36upx;'"></image>
                    <text class="small">机构审核</text>
                </view>
                <view class="item">
                    <image src="../../static/detail-step-2.png" class="pic" :lazy-load="true" :style="'width: 34upx; height: 34upx;'"></image>
                    <text class="small">确认贷款</text>
                </view>
                <view class="item">
                    <image src="../../static/detail-step-3.png" class="pic" :lazy-load="true" :style="'width: 40upx; height: 30upx;'"></image>
                    <text class="small">绑定银行卡</text>
                </view>
                <view class="item">
                    <image src="../../static/detail-step-4.png" class="pic" :lazy-load="true" :style="'width: 34upx; height: 33upx;'"></image>
                    <text class="small">签订合同</text>
                </view>
            </view>
            <view class="modules-title">审批条件</view>
            <view class="checked">
                <view class="item" 
                    v-for="(label, index) in labelItems"
                    :key="index">
                    <image src="../../static/detail-checked.png" class="pic" :lazy-load="true"></image>
                    <text class="small">{{label.name}}</text>
                </view>
                <!-- <view class="item">
                    <image src="../../static/detail-checked.png" class="pic" :lazy-load="true"></image>
                    <text class="small">实名手机</text>
                </view>
                <view class="item">
                    <image src="../../static/detail-checked.png" class="pic" :lazy-load="true"></image>
                    <text class="small">芝麻分600+</text>
                </view>
                <view class="item">
                    <image src="../../static/detail-checked.png" class="pic" :lazy-load="true"></image>
                    <text class="small">不查征信</text>
                </view> -->
            </view>
            <view class="modules-title">相关说明</view>
            <rich-text class="note" :nodes="platform.platformAdvantage">
                <!-- <view class="items">
                    放款时间：
                    <text class="assistant">审核通过后的24小时内放款</text>
                </view>
                <view class="items">
                    还款说明：
                    <text class="assistant">还款日当天11:00从绑定银行卡中自动扣款</text>
                </view>
                <view class="items">
                    提前还款：
                    <text class="assistant">不支持</text>
                </view>
                <view class="items">
                    逾期费用：
                    <text class="assistant">扣除本金的0.1%</text>
                </view> -->
            </rich-text>
        </view>
        <view class="btn-box" v-if="!isVvvv">
            <button class="base-btn" @click="recode">立即申请</button>
        </view>
        <view class="show-info" v-if="isShowInfo" @click.stop="showInfo">
            <view class="strong">
                <text class="main">利息</text>
                <text class="assistant">{{interest_format}}元({{specificDateItems[platform.specificDate]}}利率：{{platform.rate_format}}%)</text>
            </view>
            <view class="strong">
                <text class="main">服务费</text>
                <text class="assistant">0元</text>
            </view>
            <view class="small">*注：以上计算结果仅供参考，具体费用以实际下款情况为准</view>
        </view>
        <view class="base-mask" v-if="isShowInfo" @click.stop="showInfo"></view>
        <update></update>
    </view>
</template>
<script>
export default {
    name: 'borrow-detail',
    data() {
        return {
            money: '50000',
            time: 12,
            isShowInfo: false,
			isVvvv: uni.getStorageSync('vvvv') == 1 ? true : false,
            loanMoney: '',//投资金额
            loanMoney_format: '',//投资金额格式化
            maxMonth: '12',//最大投资月份
            interest_format: 0,//利息
            total_format: 0,//还款金额
            loanTime: '',//投资时间
            loanTimeShow: '',//投资时间显示
            platformBm: '',//平台id
            platform: {//平台数据

            },
            labelItems: [],//审批条件
            loanCycle: [],//期限选择
            loanItems: [],//期限数字配置
            loanCycleIndex: 0,//当前选择期限的索引
            specificDateItems: {//借款期限配置
                year: '年',
                month: '月',
                day: '日'
            },
            isFavorite: false,//是否收藏
            randDate: {
                repay_time: (Math.random() * 2 + 2).toFixed(1),
                pend_time: (Math.random() * 2 + 2).toFixed(1),
                rate: Math.ceil(Math.random() * 25) + 70,
            }
        }
    },
    /**
	 * 刷新
	 */
	onPullDownRefresh() {
		this.getData(true);
    },
    /**
     * 收藏
     */
    onNavigationBarButtonTap(params) {
        if (params.index === 0) {
            uni.showLoading({
                title: '正在请求中...',
                mask: true,
            });
            let data = {
                module: 'UserFavorite',
                action: 'add',
                isAuth: '1',
                platformBm: this.platformBm,
            };
            //已收藏
            if (this.isFavorite) {
                data = {
                    module: 'UserFavorite',
                    action: 'del',
                    isAuth: '1',
                    platformBm: this.platformBm,
                }
            }
            this.$http({
				data: data,
			}).then(data => {
				uni.hideLoading();
					
				if (data.code === 200) {
					uni.showToast({
                        title: this.isFavorite ? '取消收藏成功' : '收藏成功',
                    });
                    this.isFavorite = !this.isFavorite;
                    this.setFavoriteStyle();
				}
			}).catch(err => {
				uni.hideLoading();
			});
        }
    },
    methods: {
        /**
         * 设置收藏的样式
         */
        setFavoriteStyle() {
            let pages = getCurrentPages();
            let page = pages[pages.length - 1];
            // #ifdef APP-PLUS
            let currentWebview = page.$getAppWebview();
            let titleObj = currentWebview.getStyle().titleNView;
            if (!titleObj.buttons) {
                return;
            }
            // console.log(this.isFavorite);
            titleObj.buttons[0].text = this.isFavorite ? "\ue602" : "\ue600";
            currentWebview.setStyle({
                titleNView: titleObj
            });
            // #endif
        },
        /**
         * 显示明细
         */
        showInfo(e) {
            this.isShowInfo = !this.isShowInfo;
        },
        /**
         * 选择期限
         */
        selectedLoan(e) {
            this.loanTime = this.loanItems[e.detail.value];
            this.loanTimeShow = this.loanCycle[e.detail.value];
        },
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
					module: 'PlatformList',
                    action: 'getPlatform',
                    platformBm: this.platformBm,
                    userId: uni.getStorageSync('userId') || ''
				}
			}).then(data => {
				// uni.hideLoading();
				if (isDownRefresh) uni.stopPullDownRefresh();
					
				if (data.code === 200) {
                    const result = data.result;
                    const _platform = result.platform || {};
                    this.platform = Object.assign(_platform, {
                        moneyMin_format: this.$filter.thousandBitSeparator(_platform.moneyMin) || "0",
                        moneyMax_format: this.$filter.thousandBitSeparator(_platform.moneyMax) || "0",
                        lendingNum_format: this.$filter.thousandBitSeparator((_platform.lendingNum / 1e4).toFixed(2)),
                        rate_format: this.$filter.thousandBitSeparator(_platform.rate) || "0",
                        // platformAdvantage: _platform.platformAdvantage.split('<br>'),
                    });
                    this.labelItems = result.label || [];
                    this.isFavorite = parseFloat(result.isFavorite) ? true : false;
                    this.loanCycle = result.loanCycle || [];
                    this.loanItems = result.loan || [];

                    this.loanMoney = parseFloat(this.platform.moneyMax);
                    this.loanCycleIndex = 0;
                    this.loanTime = this.loanItems[this.loanCycleIndex];
                    this.loanTimeShow = this.loanCycle[this.loanCycleIndex];
                    this.maxMonth = result.loan[result.loan.length - 1];
                    this.setFavoriteStyle();
				}
			}).catch(err => {
				// uni.hideLoading();
				if (isDownRefresh) uni.stopPullDownRefresh();
			});
        },
        /**
         * 立即申请
         */
        recode() {
            if (!this.$checked.checkMoney(this.loanMoney)) {
                uni.showToast({
                    icon: 'none',
                    title: '请输入正确金额',
                });
                return;
            }
            if (parseFloat(this.loanMoney) > parseFloat(this.platform.moneyMax)) {
                uni.showToast({
                    icon: 'none',
                    title: '输入金额超过最大可投额度',
                });
                return;
            }
            if (parseFloat(this.loanMoney) < parseFloat(this.platform.moneyMin)) {
                uni.showToast({
                    icon: 'none',
                    title: '输入金额低于最小可投额度',
                });
                return;
            }
            uni.showLoading({
                title: '申请中...',
                mask: true,
            });
			this.$http({
				data: {
					module: 'PlatformList',
                    action: 'recode',
                    isAuth: '1',
                    platformBm: this.platformBm,
                    loanMoney: this.loanMoney,
                    loanTime: this.loanTime,
				}
			}).then(data => {
                uni.hideLoading();
                if (data.code === 200) {
                    uni.navigateTo({
                        url: `/pages/web?url=${this.platform.platformURL}`
                    });
                }
			}).catch(err => {
				uni.hideLoading();
			});
        },
        /**
         * 监听提交参数变化
         */
        _watch_params() {
            this.$watch(() => {
                return {
                    loanMoney: this.loanMoney,
                    loanTime: this.loanTime,
                }
            }, (_params) => {
                let resBack = 0;
                let resInterest = 0;
                
                let userMoney = parseFloat(_params.loanMoney) || 0;
                let userDate  = parseFloat(_params.loanTime);
                let userDate2 = parseFloat(_params.loanTime);
                let rate      = parseFloat(this.platform.rate) / 100;
                let specificDate = this.platform.specificDate;
                // console.log(userDate);
                if(specificDate == 'year'){
                    if(userDate < 1){
                        //代表为日,将日转化为月
                        let temp = userDate.toString().split('.');;
                        userDate = temp[1];
                        resBack = parseFloat(((userMoney*rate/365)*userDate).toFixed(2))+userMoney;
                    }else{
                        resBack = parseFloat(((userMoney*rate/12)*userDate).toFixed(2))+userMoney;
                    }
                    resInterest = (resBack/userDate).toFixed(2);
                }
                if(specificDate == 'month'){
                    if(userDate < 1){
                        //代表为日,将日转化为月
                        let temp = userDate.toString().split('.');;
                        userDate = temp[1];
                        resBack = parseFloat(((userMoney*rate/12)*userDate).toFixed(2))+userMoney;
                    }else{
                        resBack = parseFloat((userMoney*userDate*rate).toFixed(2))+userMoney;
                        
                    }
                    resInterest = (resBack/userDate).toFixed(2);
                }
                if(specificDate == 'day'){
                    if(userDate < 1){
                        //代表为日,将日转化为月
                        let temp = userDate.toString().split('.');;
                        userDate = temp[1];
                        resBack = parseFloat((userMoney*rate*userDate).toFixed(2))+userMoney;
                    }else{
                        resBack = parseFloat((userMoney*rate*userDate*30).toFixed(2))+userMoney;
                    }
                    resInterest = (resBack*30/userDate).toFixed(2);
                }
                
                if(userDate2 < 1){
                    // $('#huankuan').text('一次性还款（元）');
                    // $('#resBack').text(resBack);
                    this.total_format = this.$filter.thousandBitSeparator(resBack);
                    this.interest_format = this.$filter.thousandBitSeparator((resBack-userMoney).toFixed(2));
                    // $('#resInterest').text((resBack-userMoney).toFixed(2));
                    // console.log(resBack, (resBack-userMoney).toFixed(2));
                }else{
                    // $('#huankuan').text('月还款（元）');
                    // $('#resBack').text((resBack/userDate).toFixed(2));
                    // $('#resInterest').text((resBack-userMoney).toFixed(2));
                    this.total_format = this.$filter.thousandBitSeparator(resBack);
                    this.interest_format = this.$filter.thousandBitSeparator((resBack-userMoney).toFixed(2));
                }
                this.loanMoney_format = this.$filter.thousandBitSeparator(userMoney);
            });
        }
    },
    onLoad(params) {
        this.platformBm = params.platformBm || '';
        uni.setNavigationBarTitle({
            title: params.name || '平台详情',
        });
        this.getData();
        this._watch_params();
	}
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
.detail {
    @include flex;
    width: 100%;
    justify-content: flex-start;
    .operating {
        position: relative;
        @include flex;
        width: 100%;
        padding: 0 30upx 30upx;
        background-color: #ffffff;
        .content {
            position: relative;
            z-index: 1;
            @include flex;
            width: 100%;
            padding: 0 30upx;
            background: linear-gradient(90deg, #F67B03, #F41C11);
            border-radius: 30upx;
            overflow: hidden;
            .write {
                position: relative;
                @include flex(row);
                width: 100%;
                padding: 48upx 0 31upx;
                border-bottom: 1upx solid rgba(#ffffff, .2);
                .group {
                    @include flex;
                    width: 50%;
                    align-items: flex-start;
                    &.mr-30 {
                        margin-right: 30upx;
                    }
                    .small {
                        @include font-size(24upx);
                        color: rgba(#ffffff, .7);
                    }
                    .strong {
                        @include flex(row);
                        margin-top: 18upx;
                        transform-style: preserve-3d;
                        backface-visibility: hidden;
                        .input {
                            position: relative;
                            top: -10upx;
                            @include flex;
                            width: 200upx;
                            height: 65upx;
                            font-family: "DIN-Medium";
                            @include font-size(48upx);
                            color: #FFFFFF;
                            font-weight: bold;
                        }
                        .selected-loan {
                            @include flex;
                            width: auto;
							height: 65upx;
                            font-family: "DIN-Medium";
                            @include font-size(48upx);
                            color: #FFFFFF;
                            transform-style: preserve-3d;
                            backface-visibility: hidden;
                        }
                        .assistant {
                            @include font-size(24upx);
                            color: #FFFFFF;
                            font-weight: bold;
                        }
                        .icon-pingjia {
                            @include font-size(24upx);
                            color: #FFFFFF;
                        }
                    }
                }
                .mask {
                    position: absolute;
                    left: -65upx;
                    bottom: -30upx;
                    @include flex;
                    width: 60upx;
                    height: 60upx;
                    background-color: #ffffff;
                    border-radius: 100%;
                    &.right {
                        left: auto;
                        right: -65upx;
                    }
                }
            }
            .info {
                position: relative;
                @include flex(row);
                width: 100%;
                padding: 29upx 0 49upx;
                .group {
                    @include flex;
                    width: calc(100% / 3);
                    align-items: flex-start;
                    .small {
                        @include flex(row);
                        white-space: nowrap;
                        @include font-size(24upx);
                        color: rgba(#ffffff, .7);
                        .assistant {
                            // position: relative;
                            // top: 4upx;
                            @include flex(row);
                            margin-left: 21upx;
                        }
                    }
                    .strong {
                        @include flex(row);
                        margin-top: 18upx;
                        @include font-size(30upx);
                        color: #FFFFFF;
                    }
                }
            }
        }
        .bgs {
            position: absolute;
            top: 0;
            left: 60upx;
            @include flex;
            width: 630upx;
            height: 100%;
            background: linear-gradient(90deg, #F67B03, #F41C11);
            border-radius: 30upx;
            filter: blur(10upx);
            opacity: .3;
        }
    }
    .modules-title {
        @include flex;
        width: 100%;
        padding: 39upx 0 40upx;
        align-items: flex-start;
        font-family: 'PingFang-SC-Medium';
        @include font-size(30upx);
        color: #222222;
        font-weight: bold;
    }
    .data {
        @include flex;
        width: 100%;
        padding: 0 30upx;
        background-color: #ffffff;
        .items {
            @include flex(row);
            width: 100%;
            .item {
                @include flex;
                width: calc(100% / 4);
                .data-show {
                    @include flex(row);
                    width: 100upx;
                    height: 100upx;
                    // border: 3upx solid transparent;
                    // border-image: linear-gradient(90deg, #FF6628, #F4363E) 30 30; 
                    background: linear-gradient(90deg, #FF6628, #F4363E); 
                    border-radius: 100%;
                    &.two {
                        background: linear-gradient(90deg, #FFE328, #F47036); 
                    }
                    &.three {
                        background: linear-gradient(90deg, #28D9FF, #3670F4); 
                    }
                    &.four {
                        background: linear-gradient(90deg, #FF28E3, #9D36F4); 
                    }
                    .content {
                        @include flex(row);
                        width: 94upx;
                        height: 94upx;
                        background-color: #ffffff;
                        border-radius: 100%;
                        .strong {
                            @include font-size(30upx);
                            color: #222222;
                            font-weight: bold;
                        }
                        .small {
                            @include font-size(18upx);
                            color: #222222;
                        }
                    }
                }
                .txt {
                    @include flex;
                    margin: 20upx 0 40upx;
                    @include font-size(24upx);
                    color: #999999;
                    font-weight: bold;
                }
            }
        }
    }
    .infos {
        @include flex;
        width: 100%;
        margin: 20upx 0 200upx;
        padding: 0 30upx;
        background-color: #ffffff;
        .steps {
            @include flex(row);
            width: 100%;
            margin: 3upx 0 10upx;
            .item {
                @include flex;
                width: calc(100% / 5);
                .pic {
                    @include flex;
                    width: 32upx;
                    height: 36upx;
                }
                .small {
                    @include flex;
                    @include font-size(24upx);
                    color: #999999;
                    margin-top: 20upx;
                    font-weight: bold;
                }
            }
        }
        .checked {
            @include flex(row);
            width: 100%;
            margin: -20upx 0 9upx;
            justify-content: flex-start;
            flex-wrap: wrap;
            .item {
                @include flex(row);
                width: calc(100% / 4);
                margin-top: 20upx;
                justify-content: flex-start;
                .pic {
                    @include flex;
                    width: 24upx;
                    height: 24upx;
                    margin-right: 12upx;
                }
                .small {
                    @include font-size(22upx);
                    color: #666666;
                    font-weight: bold;
                }
            }
        }
        .note {
            box-sizing: border-box;
            @include flex;
            width: 100%;
            align-items: flex-start;
            margin: -11upx 0 37upx;
            @include font-size(24upx, 40upx);
            color: #666666;
            font-weight: bold;
            .items {
                @include inline-block;
                width: 100%;
                @include font-size(24upx, 40upx);
                color: #666666;
                font-weight: bold;
                .assistant {
                    display: inline;
                    color: #999999;
                }
            }
        }
    }
    .show-info {
        position: fixed;
        left: 30upx;
        top: 253upx;
        z-index: 11;
        @include flex;
        width: 690upx;
        align-items: flex-start;
        padding: 30upx;
        background-color: #ffffff;
        .strong {
            @include flex(row);
            width: 100%;
            margin-bottom: 26upx;
            justify-content: flex-start;
            @include font-size(30upx);
            color: #000000;
            font-weight: bold;
            .main {
                @include flex;
                width: 162upx;
                align-items: flex-start;
            }
            .assistant {
                @include flex;
                flex: 1;
                align-items: flex-start;
                @include font-size(24upx);
                color: #666666;
                font-weight: bold;
            }
        }
        .small {
            @include flex;
            width: 100%;
            align-items: flex-start;
            margin-top: 11upx;
            @include font-size(20upx, 1.5);
            color: #999999;
            font-weight: bold;
        }
    }
    .btn-box {
        position: fixed;
        left: 0;
        bottom: 0;
        @include flex;
        width: 100%;
        padding: 41upx 30upx;
        background-color: #ffffff;
    }
}
</style>

