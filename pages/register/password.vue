<template>
    <view class="entrance">
        <view class="operating">
            <view class="write">
                <input type="number" v-model="params.code" maxlength="4" :focus="true" placeholder="请输入短信验证码" :placeholder-style="'color: #CCCCCC;'" />
                <view class="assistant">
                    <view class="line"></view>
                    <button class="btn highlight" @click="_send_code">{{codeStatus.text}}</button>
                </view>
            </view>
            <view class="write">
                <input type="text" v-model="params.password" :password="true" maxlength="12" placeholder="请输入密码" :placeholder-style="'color: #CCCCCC;'" />
            </view>
            <text class="msg">6-12位数字和字母的组合</text>
            <button :class="['base-btn', !isOperating ? 'disabled' : '']" @click="_send_register">完成</button>
        </view>
        <view class="tips">
            <view class="txt">注册即表示您同意<navigator hover-class="none" url="/pages/agreement/register" class="highlight">《乐开花用户协议》</navigator></view>
        </view>
    </view>
</template>
<script>
export default {
    name: 'register-password',
    data() {
        return {
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
         * 设置注册密码
         */
        _set_password(userId = '') {
            // console.log('userId', userId);
            uni.showLoading({
                title: '设置密码中...',
                mask: true,
            });

            this.$http({
                data: {
                    module: 'User',
                    action: 'setpassword',
                    userId: userId,
                    password: this.params.password,
                }
            }).then(data => {
                uni.hideLoading();

                uni.switchTab({
                    url: '/pages/users/index'
                });
            }).catch(err => {
                uni.hideLoading();

                uni.switchTab({
                    url: '/pages/users/index'
                });
            });
        },
        /**
         * 发送注册数据
         */
        _send_register(_data) {
            const _params = this.params;
            let data = {};
            
            if (!this.$checked.checkMobileNo(_params.mobile)) {
                uni.showToast({
                    icon: 'none',
                    title: '请输入正确电话号码',
                });
                return;
            }
            if (!this.$checked.checkSmsCode(_params.code)) {
                uni.showToast({
                    icon: 'none',
                    title: '请输入正确短信验证码',
                });
                return;
            }
            if (!this.$checked.checkPassword(_params.password)) {
                uni.showToast({
                    icon: 'none',
                    title: '请输入正确6-12位密码',
                });
                return;
            }

            uni.showLoading({
                title: '正在注册中...',
                mask: true,
            });

            this.$http({
                data: {
                    module: 'Login',
                    action: 'login',
                    mobile: _params.mobile,
                    code: _params.code,
                    password: '',
                }
            }).then(data => {
                uni.hideLoading();
                    
                if (data.code === 200 && data.result && data.result.userId) {
                    // console.log('s');
                    this._set_password(data.result.userId);
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
                    mobile: this.params.mobile,
                    code: this.params.code,
                    password: this.params.password,
                }
            }, (_params) => {
                const mobile = _params.mobile;
                const code = _params.code;
                const password = _params.password;

                this.isOperating = false;
                if (this.$checked.checkSmsCode(code) 
                    && this.$checked.checkPassword(password) 
                    && this.$checked.checkMobileNo(mobile)) {
                    this.isOperating = true
                }
            });
        }
    },
    onLoad(params) {
        this.params.mobile = params.mobile || '';
        this._watch_params();
	}
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
@import '../../common/styles/entrance';
</style>

