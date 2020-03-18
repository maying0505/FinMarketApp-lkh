const config = require('../config/config.http').default;
export default {
    /**
     * http请求
     */
    http({url = '/Api/Index/index', data = {}, method = 'POST', responseType = 'text', dataType = 'json'} = {}) {
        return new Promise((resolve, reject) => {
            url = `${config.BASE_API_URL}${url}`;

            // 添加平台
            const platform = uni.getSystemInfoSync().platform;
            //data['clientFrom'] = platform || platform === 'devtools'  ? 'ios' : platform;
			data['clientFrom'] = 'android';
			
            // 添加userid
            if (data.isAuth) {
                delete data.isAuth;
                data['userId'] = uni.getStorageSync('userId') || '';
                // 没有userID
                if (!data['userId']) {
                    uni.hideLoading();
                    uni.navigateTo({
                        url: '/pages/login/code'
                    });
                    return false;
                }
            }
            // console.info(JSON.stringify(data));
            uni.request({
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                url,
                data,
                method,
                dataType,
                responseType,
                success(res) {
                    res = res.data || {};
                    //console.info(JSON.stringify(res));
                    if (res.code !== 200) {
                        uni.hideLoading();
                        uni.showToast({
                            icon: 'none',
                            title: res.text || '服务器错误',
                        }); 
                    } else {
                        if (res.result && res.result.userId) {
                            uni.setStorageSync('userId', res.result.userId);
                        }
                    }
                    resolve(res);
                },
                fail(err) {
                    uni.hideLoading();
                    uni.showToast({
                        icon: 'none',
                        title: '服务器错误',
                    });
                    reject(err);
                }
            });
        });
    },
};