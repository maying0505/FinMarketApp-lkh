<template>
    <view class="entrance">
        <view class="close-box" @click="_back">
            <view class="bar"></view>
            <image src="../../static/entrance-close.png" class="close" :lazy-load="true"></image>
        </view>
        <view class="theme">
            <text class="title">{{typesItems[types]['title']}}</text>
            <view class="info">
                <image src="../../static/entrance-info.png" class="logo" :lazy-load="true" v-if="types === 'password'"></image>
                <navigator url="/pages/register/index" class="txt" hover-class="none" v-if="types === 'password'">注册领豪礼</navigator>
                <!-- <text class="txt" v-else>注册领豪礼</text> -->
            </view>
        </view>
        <view class="operating">
            <view class="write">
                <input type="number" v-model="params.mobile" :focus="true" maxlength="11" placeholder="请输入手机号码" :placeholder-style="'color: #CCCCCC;'" />
            </view>
            <view class="write" v-if="types !== 'register'">
                <input type="number" v-model="params.code" :maxlength="typesItems[types]['assistant']['maxLength']" :placeholder="typesItems[types]['assistant']['title']" :placeholder-style="'color: #CCCCCC;'" v-if="types !== 'password'" />
                <input type="text" v-model="params.password" :password="true" :maxlength="typesItems[types]['assistant']['maxLength']" :placeholder="typesItems[types]['assistant']['title']" :placeholder-style="'color: #CCCCCC;'" v-else />
                <view class="assistant">
                    <view class="line"></view>
                    <navigator url="/pages/forget/index" hover-class="none" class="btn" v-if="types === 'password'">忘记密码？</navigator>
                    <button class="btn highlight" v-else-if="types === 'code'" @click="_send_code">{{codeStatus.text}}</button>
                    <image src="https://iph.href.lu/110x48" class="pic" :lazy-load="true" v-else></image>
                </view>
            </view>
            <button class="base-btn" @click="operating">{{typesItems[types]['btns']}}</button>
            <view :class="['method', types === 'register' ? 'center' : '']">
                <navigator hover-class="none" :url="typesItems[types]['url']" open-type="redirect" class="btn" v-if="types !== 'register'">{{types === 'code' ? '密码登录' : '验证码登录'}}</navigator>
                <view v-else class="btn" @click="_back">已有账号，去登录</view>
            </view>
        </view>
        <view class="tips">
            <view class="txt">
                {{types === 'register' ? '注册' : '登录'}}即表示您同意<navigator  hover-class="none" url="/pages/agreement/register" class="highlight">《乐开花用户协议》</navigator>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    name: 'base-entrance',
    props: {
        // 类型
        types: {
            type: String,
            default: 'code', // code：短信登录（默认）password：密码登录 register：注册
        },
    },
    data() {
        return {
            typesItems: { //类型配置
                code: {
                    title: '登录',
                    btns: '立即登录',
                    assistant: {
                        title: '请输入短信验证码',
                        maxLength: 4,
                    },
                    url: '/pages/login/password'
                },
                password: {
                    title: '密码登录',
                    btns: '立即登录',
                    assistant: {
                        title: '请输入登录密码',
                        maxLength: 12,
                    },
                    url: '/pages/login/code'
                },
                register: {
                    title: '注册',
                    btns: '下一步',
                    assistant: {
                        title: '请输入图形验证码',
                        maxLength: 4,
                    },
                    url: '/pages/login/code'
                }
            },
            params: {//提交参数
                mobile: '',
                password: '',
                code: ''
            },
            isOperating: false,//是否可以操作
            codeStatus: {//验证码状态
                text: '获取验证码',//文字,
                isSend: true,//是否可以发送
                time: 60,//发送倒计时
            }
        }
    },
    methods: {
        /**
         * 设置验证码状态
         */
        _set_code_status(isSuccess = false) {
            let _isSend = true;
            let _text = '获取验证码';
            let _time = this.codeStatus.time;
            // 成功
            if (isSuccess) {
                const _timer = setTimeout(() => {
                    // 倒计时中
                    _time--;
                    if (_time > 0) {
                        this.codeStatus.text = `短信已发送(${_time}s)`;
                        this.codeStatus.isSend = false;
                        this.codeStatus.time = _time;
                        this._set_code_status(true);
                    } else {
                        this._set_code_status(false);
                    }
                    clearTimeout(_timer);
                }, 1000);
            } else {
                this.codeStatus.text = _text;
                this.codeStatus.isSend = _isSend;
            }
        },
        /**
         * 发送短信验证码
         */
        _send_code() {
            const _mobile = this.params.mobile;
            if (!this.codeStatus.isSend) return;
            if (!this.$checked.checkMobileNo(_mobile)) {
                uni.showToast({
                    icon: 'none',
                    title: '请输入正确电话号码',
                });
                return;
            }
            this.codeStatus.text = '发送请求中...';
            this.codeStatus.isSend = false;
            this.codeStatus.time = 60;
            this.$http({
                data: {
                    module: 'Login',
                    action: 'sendCode',
                    mobile: _mobile,
                    sta: '1',
                }
            }).then(data => {
                if (data.code === 200) {
                    this._set_code_status(true);
                } else {
                    this._set_code_status(false);
                }
            }).catch(err => {
                this._set_code_status(false);
            });
        },
        /**
         * 发送登录数据
         */
        _send_login(_data) {
            _data = Object.assign({
                module: 'Login',
                action: 'login'
            }, _data);

            uni.showLoading({
                title: '发送请求中...',
                mask: true,
            });
            this.$http({
                data: _data
            }).then(data => {
                uni.hideLoading();
                if (data.code === 200 && data.result && data.result.userId) {
                    uni.switchTab({
                        url: '/pages/users/index'
                    });
                }
            }).catch(err => {
                uni.hideLoading();
            });
        },
        /**
         * 操作
         */
        operating() {
            const _params = this.params;
            let data = {};

            if (!this.$checked.checkMobileNo(_params.mobile)) {
                uni.showToast({
                    icon: 'none',
                    title: '请输入正确电话号码',
                });
                return;
            }
            if (this.types === 'register') {
                // 注册
                uni.navigateTo({
                    url: `/pages/register/password?mobile=${this.params.mobile}`,
                });
                return;
            } else if (this.types === 'password') {
                if (!this.$checked.checkPassword(_params.password)) {
                    uni.showToast({
                        icon: 'none',
                        title: '请输入正确6-12位密码',
                    });
                    return;
                }
            } else if (this.types === 'code') {
                if (!this.$checked.checkSmsCode(_params.code)) {
                    uni.showToast({
                        icon: 'none',
                        title: '请输入正确短信验证码',
                    });
                    return;
                }
            }  
            data = {
                mobile: this.params.mobile,
                code: this.params.code,
                password: this.params.password,
				sourceId: uni.getStorageSync('sourceId'),
            };
            this._send_login(data);
        },
        /**
         * 返回
         */
        _back() {
            if (this.types !== 'register') {
                uni.switchTab({
                    url: '/pages/index/index'
                });
                return;
            }
            uni.navigateBack({
                delta: 1
            });
        },
        /**
         * 监听提交参数变化
         */
        _watch_params() {
            this.$watch(() => {
                return {
                    mobile: this.params.mobile,
                    code: this.params.code,
                    password: this.params.password,
                }
            }, (_params) => {
                const mobile = _params.mobile;
                const code = _params.code;
                const password = _params.password;

                this.isOperating = false;
                if (this.types === 'code') {
                    if (this.$checked.checkSmsCode(code)) this.isOperating = true;
                } else if (this.types === 'password') {
                    if (this.$checked.checkPassword(password)) this.isOperating = true;
                } else {
                    this.isOperating = true;
                }
                if (!this.$checked.checkMobileNo(mobile)) this.isOperating = false;
            });
        }
    },
    onLoad() {
        this._watch_params();
    },
}
</script>
<style lang="scss" scoped>
@import '../common/styles/defin';
@import '../common/styles/entrance';
page{
	width: 100%;
	.entrance{
		width: 100%;
	}
}

</style>

