<template>
	<view>
		<web-view :src="url" :webview-styles="webviewStyles"></web-view>
	</view>
</template>
<script>
let wv; //计划创建的webview
let wLoading;//计划创建loading
export default {
	name: 'web',
	data() {
		return {
			dtask: null,
			url: '',
			webviewStyles: {
				progress: {
					color: '#FF6F22'
				}
			},
		};
	},
	onLoad(params) {
		this.url = params.url || '';
		console.log('当前环境：' + uni.getSystemInfoSync().platform); //如果是安卓才执行
		if (uni.getSystemInfoSync().platform == 'android') {
			let currentWebview = this.$mp.page.$getAppWebview(); //获取当前页面的webview对象
			let _this = this;
			setTimeout(function() {
				wv = currentWebview.children()[0];
				let url222 = wv.getURL();
				//console.log('当前网址222: '+url222);
				// 拦截所有页面跳转，可使用参数拦截.apk的跳转
				wv.overrideUrlLoading({ mode: 'reject', match: '.*\.apk.*' }, function(e) {
					wLoading = plus.nativeUI.showWaiting("   开始下载...   ");  
					console.log('拦截的URL666: '+e.url);
					_this.dtask = plus.downloader.createDownload(e.url, {}, function(d, status) {
						wLoading.setTitle("   下载成功   ");
						// wLoading.close();
						// _this.dtask.removeEventListener('statechanged');
						// 下载完成
						if (status == 200) {
							plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, function(error) {
								uni.showToast({
									title: '安装失败',
									mask: false,
									duration: 1500
								});
							});
						} else {
							uni.showToast({
								title: '下载失败，请检查您的网络',
								mask: false,
								duration: 1500
							});
						}
					});
					_this.dtask.addEventListener('statechanged', task => {
						if (!_this.dtask) {
							return;
						}
						switch (task.state) {
							case 1:
								console.log('开始下载');
								break;
							case 2:
								console.log('链接到服务器...');
								break;
							case 3:
								let progressVal = 0/0;
								progressVal = Math.ceil(task.downloadedSize/1024/1024) + "/" + Math.ceil(task.totalSize/1024/1024) + "M"
								// progressVal = (task.downloadedSize/1024/1024).toFixed(4) + "/" + Math.ceil(task.totalSize/1024/1204) + "M"
								// progressVal = Math.ceil(task.downloadedSize / task.totalSize * 100);
								wLoading.setTitle("　　 下载中 "+progressVal+"　　 ");    
								console.log("　　 下载中"+task.downloadedSize,task.totalSize+"%　　 ");
								break;
							case 4:
								cnosole.log('监听下载完成');
								wLoading.close(); 
								break;
						}
					});
					_this.dtask.start();
				});
			}, 1000); //如果是页面初始化调用时，需要延时一下
		}
	},
	onUnload(){
		this.dtask.removeEventListener('statechanged');
		if(wLoading){
			wLoading.close();
		}
	},
	onHide(){
		if(wLoading){
			// wLoading.close();
		}
	}
};
</script>
<style lang="scss" scoped>
	.test{
		position: fixed;
		z-index: 100;
		width: 100%;
	}
</style>
