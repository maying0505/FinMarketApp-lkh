<template>
    <view class="borrow">
        <view class="bar"></view>
        <view class="search-box">
            <view class="content">
                <image src="../../static/search-logo.png" class="logo" :lazy-load="true"></image>
                <input type="text" v-model="keyWord" class="search" :focus="isFocus"  placeholder="搜索平台名称/关键字" :placeholder-style="'color: #DDDDDD;'" :confirm-type="'search'" @confirm="getSearch" />
                <view class="close-box" @click="clearSearch" v-if="keyWord">
                    <image src="../../static/search-close.png" class="close" :lazy-load="true"></image>
                </view>
            </view>
            <view class="cancel" @click="_back">取消</view>
        </view>
        <view class="hot" v-if="isHotShow">
            <text class="title">热门搜索</text>
            <view class="items">
                <!-- <view class="item active">不限</view> -->
                <view v-for="(hot, index) in hotWord"
                    :key="index" 
                    class="item"
                    @click="selected(hot.hotLabel)">{{hot.hotLabel}}
                </view>
            </view>
        </view>
        <view class="container" v-if="!isHotShow && platform.length">
            <borrow-list :result="platform"></borrow-list>
        </view>
        <no-data v-if="!isHotShow && !platform.length"></no-data>
        <update></update>
    </view>
</template>
<script>
import BorrowList from '../../components/BorrowList';
export default {
    name: 'borrow-search',
    components: {
        BorrowList,
    },
    data() {
        return {
            keyWord: '',//搜索关键词
            isHotShow: true,//是否显示热门搜索
            hotWord: [],//热门搜索词
            platform: [],//数据列表
            isFocus: false,
        }
    },
    methods: {
        /**
         * 返回
         */
        _back() {
            uni.navigateBack({
                delta: 1
            });
        },
        /**
         * 清空搜索
         */
        clearSearch() {
            this.isHotShow = true;
            this.keyWord = '';
            this.isFocus = true;
        },
        /**
         * 获取搜索
         */
        getSearch() {
            if (!this.keyWord) {
                uni.showToast({
                    icon: 'none',
                    title: '请输入正确搜索项',
                });
                return;
            }
            this.isHotShow = false;
            this.isFocus = false;
            uni.hideKeyboard();
            this.$http({
				data: {
					module: 'Search',
                    action: 'search',
                    keyWord: this.keyWord,
				}
			}).then(data => {
				if (data.code === 200) {
					const result = data.result;
					if (result && result.platform) this.platform = this.$borrowListFilter(result.platform);
                }
                // this.isFocus = false;
			}).catch(err => {
                // this.isFocus = false;
			});
        },
        /**
         * 选择
         */
        selected(_keyWord = '') {
            this.keyWord = _keyWord;
            this.getSearch();
        },
        /**
		 * 获取热门关键词
		 */
		getHotWord(isDownRefresh) {
			this.$http({
				data: {
					module: 'Search',
					action: 'getHotWord',
				}
			}).then(data => {
				if (data.code === 200) {
					const result = data.result;
					if (result && result.hotWord) this.hotWord = result.hotWord;
                }
			}).catch(err => {
			});
		}
    },  
    onLoad(params) {
		this.getHotWord();
    },
    onShow() {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            this.isFocus = true;
        }, 0);
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
@import '../../common/styles/borrow_index';
.borrow {
    .hot {
        @include flex;
        width: 100%;
        height: 100%;
        padding: 0 30upx;
        justify-content: flex-start;
        background-color: #ffffff;
		borrow-list{
			width: 100%;
		}
        .title {
            @include flex;
            width: 100%;
            padding: 49upx 0;
            align-items: flex-start;
            font-family: 'PingFang-SC-Medium';
            @include font-size(40upx);
            color: #222222;
            font-weight: 500;
        }
        .items {
            @include flex(row);
            width: 100%;
            margin-top: -20upx;
            justify-content: space-between;
            flex-wrap: wrap;
            .item {
                @include flex;
                width: 196upx;
                height: 70upx;
                margin-top: 20upx;
                @include font-size(26upx);
                color: #333333;
                border: 1upx solid #EEEEEE;
                border-radius: 4upx;
                &.active {
                    color: #FF5555;
                    border-color: #FF5555;
                }
            }
        }
    }
}
</style>
