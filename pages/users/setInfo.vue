<template>
    <view class="set-info">
        <view class="info-items">
            <view class="item">
                <text class="txt">手机号</text>
                <view class="assistant">{{phoneNumber || '--'}}</view>
            </view>
            <view class="item">
                <text class="txt">真实姓名</text>
                <view class="assistant">
                    <view class="content">
                        <input class="show" v-model="realName" type="text" placeholder="请输入真实姓名" :placeholder-style="'color: #CCCCCC;'" />
                    </view>
                <text class="iconfont icon-fangxiang"></text></view>
            </view>
            <view class="item">
                <text class="txt">昵称</text>
                <view class="assistant">
                    <view class="content">
                        <input class="show" v-model="nickName" type="text" placeholder="请输入昵称" :placeholder-style="'color: #CCCCCC;'" />
                    </view>
                <text class="iconfont icon-fangxiang"></text></view>
            </view>
			<view class="item">
			    <text class="txt">身份证号</text>
			    <view class="assistant">
			        <view class="content">
			            <input class="show" v-model="identityCard" type="idcard" placeholder="请输入身份证号" :placeholder-style="'color: #CCCCCC;'" />
			        </view>
			        <text class="iconfont icon-fangxiang"></text>
			    </view>
			</view>
            <view class="item">
                <text class="txt">性别</text>
                <view class="assistant">
                    <view class="content end">
                        <radio-group class="radio-group" @change="selectedSex">
                            <label><radio value="1" :checked="sex === '1'" />先生</label>
                            <label class="radio"><radio :checked="sex === '2'" value="2" />女士</label>
                        </radio-group>
                    </view>
                    <text class="iconfont icon-fangxiang"></text>
                </view>
            </view>
            <view class="item">
                <text class="txt">婚姻状况</text>
                <view class="assistant">
                    <picker class="content" id="marryStatus" mode="selector" :value="marryStatus - 1" :range="marryStatusItems" :range-key="'text'" @change="selected">
                        <view class="show">{{marryStatusShow || '请选择婚姻状况'}}</view>
                    </picker>
                    <text class="iconfont icon-fangxiang"></text>
                </view>
            </view>
            <view class="item">
                <text class="txt">最高学历</text>
                <view class="assistant">
                    <picker class="content" id="educatStatus" mode="selector" :value="educatStatus - 1" :range="educatStatusItems" :range-key="'text'" @change="selected">
                        <view class="show">{{educatStatusShow || '请选择最高学历'}}</view>
                    </picker>
                    <text class="iconfont icon-fangxiang"></text>
                </view>
            </view>
            <view class="item">
                <text class="txt">我的职业</text>
                <view class="assistant">
                    <picker class="content" id="companyStatus" mode="selector" :value="companyStatus - 1" :range="companyStatusItems" :range-key="'text'" @change="selected">
                        <view class="show">{{companyStatusShow || '请选择职业'}}</view>
                    </picker>
                    <text class="iconfont icon-fangxiang"></text>
                </view>
            </view>
            <!-- <view class="item">
                <text class="txt">工作城市</text>
                <view class="assistant">
                    <picker class="content" mode="region" :range="test" :range-key="'text'">
                        <view class="show">请选择工作城市</view>
                    </picker>
                    <text class="iconfont icon-fangxiang"></text>
                </view>
            </view> -->
            <view class="item">
                <text class="txt">月收入</text>
                <view class="assistant">
                    <picker class="content" id="incomes" mode="selector" :value="incomes - 1" :range="incomesItems" :range-key="'text'" @change="selected">
                        <view class="show">{{incomesShow || '请选择月收入'}}</view>
                    </picker>
                    <text class="iconfont icon-fangxiang"></text>
                </view>
            </view>
        </view>
        <view class="btn-box">
            <button class="base-btn" @click="updateInfo">保存</button>
        </view>
        <update></update>
    </view>
</template>
<script>
export default {
    name: 'users-set-info',
    data() {
        return {
            marryStatusItems: [//婚姻状况配置
                {
                    value: '1',
                    text: '未婚'
                },
                {
                    value: '2',
                    text: '已婚'
                },
                {
                    value: '3',
                    text: '离异'
                },
                {
                    value: '4',
                    text: '丧偶'
                },
            ],
            educatStatusItems: [//文化程度配置
                {
                    value: '1',
                    text: '初中及以下',
                },
                {
                    value: '2',
                    text: '高中/职高',
                },
                {
                    value: '3',
                    text: '大专',
                },
                {
                    value: '4',
                    text: '本科',
                },
                {
                    value: '5',
                    text: '硕士',
                },
                {
                    value: '6',
                    text: '博士及以上',
                }
            ],
            companyStatusItems: [//公司类型配置
                {
                    value: '1',
                    text: '普通企业',
                },
                {
                    value: '2',
                    text: '事业单位',
                },
                {
                    value: '3',
                    text: '国企央企',
                },
                {
                    value: '4',
                    text: '外资企业',
                },
                {
                    value: '5',
                    text: '上市公司',
                },
                {
                    value: '6',
                    text: '其他',
                }
            ],
            incomesItems: [//月收入配置
                {
                    value: '1',
                    text: '1000及以下',
                },
                {
                    value: '2',
                    text: '1001~2000',
                },
                {
                    value: '3',
                    text: '2001~4000',
                },
                {
                    value: '4',
                    text: '4001~6000',
                },
                {
                    value: '5',
                    text: '6001~10000',
                },
                {
                    value: '6',
                    text: '10000以上',
                }
            ],
            marryStatusShow: '',//显示婚姻状况
            educatStatusShow: '',//显示文化程度
            companyStatusShow: '',//显示公司类型
            incomesShow: '',//显示月收入
            realName: '',//真实姓名
            nickName: '',//昵称
            phoneNumber: '',//电话号码
            identityCard: '',//身份证号
            sex: '',//性别
            marryStatus: '',//婚姻状况
            educatStatus: '',//文化程度
            companyStatus: '',//公司类型
            incomes: '',//月收入
        }
    },
    methods: {
        /**
		 * 获取数据
		 */
		getData() {
			// uni.showLoading({
            //     title: '数据加载中...',
            //     mask: true,
            // });
			this.$http({
				data: {
					module: 'Userinfo',
                    action: 'loadInfo',
                    isAuth: '1',
				}
			}).then(data => {
				// uni.hideLoading();
					
				if (data.code === 200) {
					const result = data.result;
                    this.realName = result.realName || '';
                    this.nickName = result.nickName || '';
                    this.phoneNumber = result.phoneNumber || '';
                    this.identityCard = result.identityCard || '';
                    this.sex = result.sex || '';
                    this.marryStatus = result.marryStatus || '';
                    this.educatStatus = result.educatStatus || '';
                    this.companyStatus = result.companyStatus || '';
                    this.incomes = result.incomes || '';
				}
			}).catch(err => {
				// uni.hideLoading();
			});
        },
        /**
         * 选择
         */
        selected(e) {
            const _items = this[`${e.currentTarget.id}Items`] || [];
            this[e.currentTarget.id] = _items[e.detail.value]['value'] || '';
        },
        /**
         * 选择性别
         */
        selectedSex(e) {
            this.sex = e.detail.value || '';
        },
        /**
		 * 修改数据
		 */
		updateInfo() {
            if (this.realName && !this.$checked.checkNickName(this.realName)) {
                uni.showToast({
                    icon: 'none',
                    title: '请输入正确姓名',
                });
                return;
            }
            if (this.nickName && !this.$checked.checkNickName(this.nickName)) {
                uni.showToast({
                    icon: 'none',
                    title: '请输入正确2-20位昵称',
                });
                return;
            }
            if (this.identityCard && !this.$checked.checkIdCard(this.identityCard)) {
                uni.showToast({
                    icon: 'none',
                    title: '请输入正确身份证号',
                });
                return;
            }
			uni.showLoading({
                title: '正在修改中...',
                mask: true,
            });
			this.$http({
				data: {
					module: 'Userinfo',
                    action: 'updateInfo',
                    isAuth: '1',
                    realName: this.realName,
                    nickName: this.nickName,
                    sex: this.sex,
                    phoneNumber: this.phoneNumber,
                    identityCard: this.identityCard,
                    marryStatus: this.marryStatus,
                    educatStatus: this.educatStatus,
                    companyStatus: this.companyStatus,
                    incomes: this.incomes
				}
			}).then(data => {
				uni.hideLoading();
					
				if (data.code === 200) {
                    uni.navigateBack({
                        delta: 1
                    });
				}
			}).catch(err => {
				uni.hideLoading();
			});
        },
        /**
         * 监听选择数据变化
         */
        watch_params() {
            const paramsArry = ['marryStatus', 'educatStatus', 'companyStatus', 'incomes'];

            //设置监听数据
            for (let params of paramsArry) {
                this.$watch(params, _params => {
                    // console.info(params, _params);
                    const _items = this[`${params}Items`] || [];
                    if (_items) {
                        // 设置监听对象显示文字
                        for (let _itme of _items) {
                            // console.info(params, _itme.value, _params);
                            if (_itme.value === _params) {
                                this[`${params}Show`] = _itme.text;
                            }
                        }
                    }
                });
            }
        }
    },
    onLoad() {
        this.watch_params();
    },
    onShow() {
        if (this.$isAuth()) {
            this.getData();
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
.set-info {
    @include flex;
    width: 100%;
    justify-content: flex-start;
    .info-items {
        @include flex;
        width: 100%;
        margin-bottom: 201upx;
        padding-left: 30upx;
        background-color: #ffffff;
        .item {
            @include flex(row);
            width: 100%;
            height: 108upx;
            padding-right: 30upx;
            border-bottom: 1upx solid #EEEEEE;
            .txt {
                @include flex;
                width: 243upx;
                align-items: flex-start;
                font-family: 'PingFang-SC-Medium';
                @include font-size(30upx);
                color: #222222;
                font-weight: bold;
            }
            .assistant {
                @include flex(row);
                width: calc(100% - 243upx);
                height: 107upx;
                justify-content: flex-start;
                @include font-size(28upx);
                color: #999999;
                font-weight: bold;
                .content {
                    @include flex(row);
                    flex: 1;
                    align-items: flex-start;
                    &.end {
                        align-items: flex-end;
                    }
                    .radio-group {
                        @include flex(row);
                        .radio {
                            margin-left: 105upx;
                        }
                    }
                    .show {
                        @include inline-block;
                        width: 400upx;
                        text-align: left;
                        @include font-size(28upx);
                        color: #CCCCCC;
                        font-weight: bold;
                    }
                }
                .icon-fangxiang {
                    margin-left: 19upx;
                    @include font-size(28upx);
                    color: #999999;
                }
            }
        }
    }
    .btn-box {
        position: fixed;
        left: 0;
        bottom: 0;
		z-index: 1;
        width: 100%;
        padding: 50upx 30upx 53upx;
        background-color: #ffffff;
    }
}
</style>

