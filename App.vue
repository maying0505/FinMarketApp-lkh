<script>
export default {
	onLaunch: function () {
		uni.setStorageSync('version', '1.0.2');
		uni.setStorageSync('sourceId', 15);
		// console.log('App Launch')
	},
	onShow: function () {
		this.$http({
		    data: {
		        module: 'Dc',
		        action: 'index',
		        appstore: 'huawei',
				v: 0,
		    }
		}).then(data => {
			uni.setStorageSync('vvvv', data.result.v);
		}).catch(err => {
		    
		});
		//console.log('App Show')
	},
	onHide: function () {
		// console.log('App Hide')
	}
}
</script>
<style lang="scss">
@import './common/styles/defin';
@import './common/styles/iconfont';
page,
view,
text,
input,
button,
image,
navigator,
swiper,
textarea {
	display: flex;
	box-sizing: border-box;
	font-family: $font-normal;
}
page {
	background-color: #F6F6FB;
	min-height: 100%;
	width: 100%;
}
button::after{ 
	border: none; 
}
.base-btn {
	@include flex;
	width: 100%;
	height: 98upx;
	@include font-size(30upx);
	color: #FFFFFF;
	font-weight: bold;
	background-color: #FF7B28;
	background: linear-gradient(90deg, #F67B03, #F41C11);
	border-radius: 4upx;
	&.disabled {
		background: #CCCCCC;
	}
	&.grey {
		background-color: #BBBBBB;
		background: linear-gradient(90deg, #BBBBBB, #999999);
	}
}
.base-mask {
	position: fixed;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	z-index: 10;
	background-color: $uni-bg-color-mask;
}
.base-tips {
	@include flex;
	width: 100%;
	padding: 30upx;
	@include font-size(24upx);
	color: #999999;
}
@font-face {
	font-family: "DIN-Medium";
	src: url('./static/fonts/DIN Medium.ttf') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
}

.font-din {
	font-family: "DIN-Medium" !important;
}
</style>

