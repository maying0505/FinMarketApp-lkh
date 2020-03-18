<template>
    <view class="borrow">
        <!--  #ifdef APP-PLUS -->
        <view class="bar"></view>
        <!--  #endif -->
        <view class="search-box">
            <view class="content">
                <image src="../../static/search-logo.png" class="logo" :lazy-load="true"></image>
                <view class="search grey" @click="goSearch">搜索平台名称/关键字</view>
                <!-- <image src="../../static/search-close.png" class="close" :lazy-load="true"></image> -->
            </view>
        </view>
        <view class="operating" id="operatingEl">
            <view class="items">
                <view :class="['item', order ? 'active' : '']" @click="showBox('Sort', true)">
                    {{!orderItems[order] || order === 'sort' ? '综合排序' : orderItems[order]}}
                    <text class="iconfont icon-xia2"></text>
                </view>
                <view :class="['item', defaultLabel === '40' ? 'active' : '']" @click="selecteDefaultLabel('40', true)">
                    闪电贷款
                </view>
                <view :class="['item', defaultLabel === '39' ? 'active' : '']" @click="selecteDefaultLabel('39', true)">
                    低利息
                </view>
                <view :class="['item', label || price ? 'active' : '']" @click="showBox('Selected', true)">
                    筛选
                </view>
            </view>
            <view class="sort" v-if="isShowSort && !isFixed">
                <view v-for="(txt, key, index) in orderItems"
                    :key="index"
                    :class="['item', key === order ? 'active' : '']"
                    @click="selectedOrder(key)">
                    {{txt}}
                </view>
            </view>
            <view class="selected" v-if="isShowSelected && !isFixed">
                <text class="title">贷款区间（元）</text>
                <view class="write-box">
                    <input type="number" v-model="sendPrice.priceMin" class="search" placeholder="最低金额" :placeholder-style="'color: #BBBBBB;'" />
                    ~
                    <input type="number" v-model="sendPrice.priceMax" class="search" placeholder="最高金额" :placeholder-style="'color: #BBBBBB;'" />
                </view>
                <text class="title">我有</text>
                <view class="items">
                    <view :class="['item', !label ? 'active' : '']"
                        @click="selecteLabel('')">
                        不限
                    </view>
                    <view v-for="(_label, index) in labelItems"
                        :key="index"
                        :class="['item', _label.id === label ? 'active' : '']"
                        @click="selecteLabel(_label.id)">
                        {{_label.name}}
                    </view>
                </view>
                <view class="btn-box">
                    <button class="base-btn grey" @click="sendSelected(false)">重置</button>
                    <button class="base-btn" @click="sendSelected(true)">确认</button>
                </view>
            </view>
        </view>
        <view class="container">
            <borrow-list :result="platform" v-if="platform.length"></borrow-list>
            <no-data v-else></no-data>
            <text class="base-tips" v-if="platform.length">
                {{
                    isPending ? '正在加载中...' : 
                    isNoMore ? '我是有底线的啦' : '上拉加载更多'
                }}
            </text>
        </view>
        <view class="base-mask" v-if="isShowSort" @click="showBox('Sort', false, 'reset')"></view>
        <view class="base-mask" v-if="isShowSelected" @click="showBox('Selected', false, 'reset')"></view>
        <view class="operating fixed" v-if="isFixed">
            <!--  #ifdef APP-PLUS -->
            <view class="bar"></view>
            <!--  #endif -->
            <view class="items">
                <view :class="['item', order ? 'active' : '']" @click="showBox('Sort', true)">
                    {{!orderItems[order] || order === 'sort' ? '综合排序' : orderItems[order]}}
                    <text class="iconfont icon-xia2"></text>
                </view>
                <view :class="['item', defaultLabel === '40' ? 'active' : '']" @click="selecteDefaultLabel('40', true)">
                    闪电贷款
                </view>
                <view :class="['item', defaultLabel === '39' ? 'active' : '']" @click="selecteDefaultLabel('39', true)">
                    低利息
                </view>
                <view :class="['item', label || price ? 'active' : '']" @click="showBox('Selected', true)">
                    筛选
                </view>
            </view>
            <view class="sort" v-if="isShowSort && isFixed">
                <!--  #ifdef APP-PLUS -->
                <view class="bar"></view>
                <!--  #endif -->
                <view v-for="(txt, key, index) in orderItems"
                    :key="index"
                    :class="['item', key === order ? 'active' : '']"
                    @click="selectedOrder(key)">
                    {{txt}}
                </view>
            </view>
            <view class="selected" v-if="isShowSelected && isFixed">
                <!--  #ifdef APP-PLUS -->
                <view class="bar"></view>
                <!--  #endif -->
                <text class="title">贷款区间（元）</text>
                <view class="write-box">
                    <input type="number" v-model="sendPrice.priceMin" class="search" placeholder="最低金额" :placeholder-style="'color: #BBBBBB;'" />
                    ~
                    <input type="number" v-model="sendPrice.priceMax" class="search" placeholder="最高金额" :placeholder-style="'color: #BBBBBB;'" />
                </view>
                <text class="title">我有</text>
                <view class="items">
                    <view :class="['item', !label? 'active' : '']"
                        @click="selecteLabel('')">
                        不限
                    </view>
                    <view v-for="(_label, index) in labelItems"
                        :key="index"
                        :class="['item', _label.id === label ? 'active' : '']"
                        @click="selecteLabel(_label.id)">
                        {{_label.name}}
                    </view>
                </view>
                <view class="btn-box">
                    <button class="base-btn grey" @click="sendSelected(false)">重置</button>
                    <button class="base-btn" @click="sendSelected(true)">确认</button>
                </view>
            </view>
        </view>
        <update></update>
    </view>
</template>
<script>
import BorrowList from '../../components/BorrowList';
export default {
    name: 'borrow-index',
    components: {
        BorrowList,
    },
    data() {
        return {
            page: 0,//当前页码
            order: 'sort',//排序
            price: '',//额度区间
            label: '',//我有
            defaultLabel: '',//列表标签
            isShowSort: false,//是否显示排序选择框
            isShowSelected: false,//是否显示筛选框
            labelItems: [],//列表筛选项
            platform: [],//列表数据
            isPending: false,//是否正在加载中
            isNoMore: false,//是否有更多数据
            orderItems: {
                sort: '不限',
                rate: '利率最低',
                moneyMax: '额度最高',
            },
            sendPrice: {
                priceMin: '',//最小金额
                priceMax: '',//最大金额
            },
            fastId: '40',//易通过和闪电贷款id
            isFixed: false,//是否显示浮动条
        }
    },
    /**
	 * 刷新
	 */
	onPullDownRefresh() {
        this.page = 0;
        this.isNoMore = false;
		this.getData(true);
    },
    /**
     * 加载
     */
    onReachBottom() {
        this.getData(true, true);
    },
    /**
     * 监听页面滚动
     */
    onPageScroll(e) {
        // console.info(e.scrollTop);
        this.scrollTop = e.scrollTop || 0;
        const operatingEl = uni.createSelectorQuery().select('#operatingEl');
        operatingEl.fields({
            rect: true,
        }, data => {
            // console.info('s', data);
            if (data.top <= 0) {
                this.isFixed = true;
            } else {
                this.isFixed = false;
            }
        }).exec();
    },
    methods: {
        /**
         * 去搜索页面
         */
        goSearch() {
            uni.navigateTo({
                url: '/pages/borrow/search'
            });
        },
        /**
         * 获取列表筛选项
         */
        getNewFilter() {
            this.$http({
				data: {
					module: 'PlatformList',
                    action: 'getNewFilter',
				}
			}).then(data => {
				if (data.code === 200) {
                    const result = data.result;
                    if (result && result.label) this.labelItems = result.label || [];
                }
			}).catch(err => {
			});
        },
        /**
		 * 获取数据
		 */
		getData(isDownRefresh, isReachBottom) {
            if (this.isPending || this.isNoMore) return;
            this.isPending = true;
			// uni.showLoading({
            //     title: '数据加载中...',
            //     mask: true,
            // });
            this.tempLabel = this.label;
			this.$http({
				data: {
					module: 'PlatformList',
                    action: 'index',
                    order: this.order,
                    price: this.price,
                    label: this.label,
                    defaultLabel: this.defaultLabel,
                    page: this.page,
                    loanTime: '',
				}
			}).then(data => {
                // uni.hideLoading();
				if (isDownRefresh) uni.stopPullDownRefresh();
                this.isPending = false;
					
				if (data.code === 200) {
                    const result = data.result;
                    if (this.page === 0) {
                        this.platform = this.$borrowListFilter(result.platform);
                    } else {
                        this.platform = [...this.platform, ...this.$borrowListFilter(result.platform)];
                    }
                    this.page += 1;
                    // console.info(!result, !result.platform, result.platform.length < this.$CONFIG.BASE_LIMIT_SIZE);
                    this.isNoMore = (!result || !result.platform || result.platform.length < this.$CONFIG.BASE_LIMIT_SIZE) ? true : false;
                }
			}).catch(err => {
				// uni.hideLoading();
                if (isDownRefresh) uni.stopPullDownRefresh();
                this.isPending = false;
			});
        },
        /**
         * 显示弹出框
         */
        showBox(_types, _isSHow, _ty) {
            if (_isSHow) {
                this[`isShow${_types === 'Sort' ? 'Selected' : 'Sort'}`] = false;
            }
            // if (_types === 'Selected' && !_isSHow) this.clearSelected();
            if (_types === 'Selected' && _ty === 'reset') {
                this.label = this.tempLabel || '';
            }
            this[`isShow${_types}`] = _isSHow;
        },
        /**
         * 选择排序
         */
        selectedOrder(key = 'sort', isClear) {
            if (isClear && this.order === key) {
                this.order = 'sort';
            } else {
                this.order = key;
            }
            this.page = 0;
            this.isNoMore = false;
            if (isClear) {
                this.clearSelected();
            }
            this.getData();
            this.showBox('Sort', false);
            uni.pageScrollTo({
                scrollTop: this.scrollTop - 100,
                duration: 0
            });
        },
        /**
         * 监听筛选额度变化
         */
        _watch_send_price() {
            this.$watch(() => {
                return {
                    priceMin: this.sendPrice.priceMin,
                    priceMax: this.sendPrice.priceMax,
                }
            }, (_params) => {
                const priceMin = _params.priceMin;
                const priceMax = _params.priceMax;
                this.price = `${priceMin}-${priceMax}`;
            });
        },
        /**
         * 选择筛选项
         */
        selecteLabel(label = '', isSend) {
            // console.log(label, isSend);
            // 是快贷并且快贷是已选择项
            if (this.label === label && label === this.fastId && isSend) {
                this.label = '';
            } else {
                this.label = label;
            }
            if (isSend) {
                // this.clearSelected();
                this.order = 'sort';
                this.sendSelected(true);
            }
        },
        /**
         * 选择筛选项DefaultLabel
         */
        selecteDefaultLabel(id = '') {
            this.label = '';
            if (this.defaultLabel === id) {
                this.defaultLabel = '';
            } else {
                this.defaultLabel = id;
            }
            this.page = 0;
            this.isNoMore = false;
            this.showBox('Sort', false);
            this.showBox('Selected', false);
            this.getData();
            uni.pageScrollTo({
                scrollTop: this.scrollTop - 100,
                duration: 0
            });
        },
        /**
         * 清除筛选项
         */
        clearSelected() {
            this.label = '';
            this.sendPrice.priceMax = '';
            this.sendPrice.priceMin = '';
        },
        /**
         * 提交筛选
         */
        sendSelected(isSelected) {
            if (isSelected) {
                if (this.sendPrice.priceMin || this.sendPrice.priceMax) {
                    if (!this.$checked.checkMoney(this.sendPrice.priceMin) 
                        || !this.$checked.checkMoney(this.sendPrice.priceMax)) {
                        uni.showToast({
                            icon: 'none',
                            title: '请输入正确额度范围',
                        });
                        return;
                    }
                }
                this.defaultLabel = '';
                this.page = 0;
                this.isNoMore = false;
                this.getData();
                this.showBox('Selected', false);
                uni.pageScrollTo({
                    scrollTop: this.scrollTop - 100,
                    duration: 0
                });
            } else {
                this.clearSelected();
            }
        }
    },
    // watch: {
    //     /**
    //      * 监听label变化
    //      */
    //     label(n) {
    //         if (n === this.fastId) {
    //             this.tempLabel = n;
    //         }
    //     }
    // },
    onLoad(params) {
        this.getNewFilter();
        this._watch_send_price();
    },
    onShow() {
        uni.pageScrollTo({
            scrollTop: this.scrollTop - 100,
            duration: 0
        });
        const _getLabel = this.$store.getters.getLabel || {};
        if (_getLabel.types === 'defaultLabel') {
            this.defaultLabel = _getLabel.label || '';
            this.label = '';
        } else {
            this.label = _getLabel.label || '';
            this.defaultLabel = '';
        }

        if (_getLabel.label && _getLabel.status === 'set') {
            this.$store.dispatch('setLabelAsync', {
				label: '',
                status: 'done',
                types: 'label'
			});
        }
        this.isNoMore = false;
        this.isPending = false;
        this.page = 0;
        this.order = 'sort'
        this.getData();
    },
    onHide() {
        this.isShowSort = false;
        this.isShowSelected = false;
    } 
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
@import '../../common/styles/borrow_index';
borrow-list{
	width: 100%;
}
</style>
