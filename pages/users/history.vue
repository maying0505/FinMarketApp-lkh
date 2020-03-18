<template>
    <view class="history">
        <borrow-list :result="platform" v-if="platform.length"></borrow-list>
        <no-data v-else></no-data>
        <text class="base-tips" v-if="platform.length">
            {{
                isPending ? '正在加载中...' : 
                isNoMore ? '我是有底线的啦' : '上拉加载更多'
            }}
        </text>
        <update></update>
    </view>
</template>
<script>
import BorrowList from '../../components/BorrowList';
export default {
    name: 'users-history',
    components: {
        BorrowList
    },
    data() {
        return {
            types: 'history',//当前类型
            module: '',//当前module
            action: '',//当前action
            typesItems: {//类型配置
                history: {//浏览历史
                    title: '访问记录',
                    module: 'account',
                    action: 'visit',
                },
                collection: {//收藏记录
                    title: '我的收藏',
                    module: 'UserFavorite',
                    action: 'index',
                }
            },
            page: 0,//当前页吗\
            platform: [],//列表数据
            isPending: false,//是否正在加载中
            isNoMore: false,//是否有更多数据
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
    },
    methods: {
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
			this.$http({
				data: {
					module: this.module,
                    action: this.action,
                    isAuth: '1',
                    page: this.page,
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
                    this.isNoMore = !result || !result.platform || result.platform.length < this.$CONFIG.BASE_LIMIT_SIZE  ? true : false;
                }
			}).catch(err => {
				// uni.hideLoading();
                if (isDownRefresh) uni.stopPullDownRefresh();
                this.isPending = false;
			});
		}
    },
    onLoad(params) {
        this.types = params.types || 'history';
        const _typesItem = this.typesItems[this.types];
        this.module = _typesItem.module;
        this.action = _typesItem.action;
        uni.setNavigationBarTitle({
            title: _typesItem.title,
        });
    },
    onShow() {
        if (this.$isAuth()) {
            uni.pageScrollTo({
                scrollTop: this.scrollTop - 100,
                duration: 0
            });
            this.page = 0;
            this.isPending = false;
            this.isNoMore = false;
            this.getData();
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
.history {
    @include flex;
    width: 100%;
    min-height: auto;
    justify-content: flex-start;
	borrow-list{
		width: 100%;
	}
}
</style>

