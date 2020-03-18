<template>
    <view class="entrance">
        <view class="operating">
            <view class="write">
                <input type="number" v-model="params.mobile" :focus="!isDisabled"  maxlength="11" placeholder="请输入手机号码" :disabled="isDisabled" :placeholder-style="'color: #CCCCCC;'" />
            </view>
            <view class="write">
                <input type="number" v-model="params.code" maxlength="4" placeholder="请输入短信验证码" :placeholder-style="'color: #CCCCCC;'" />
                <view class="assistant">
                    <view class="line"></view>
                    <button class="btn highlight" @click="_send_code">{{codeStatus.text}}</button>
                </view>
            </view>
            <button :class="['base-btn', !isOperating ? 'disabled' : '']" @click="operating">下一步</button>
        </view>
    </view>
</template>
<script>
export default {
    name: 'forget',
    data() {
        return {
            isDisabled: false,//是否可修改
            isOperating: false,//是否可以操作
            params: {//提交参数
                mobile: '',
                password: '',
                code: ''
            },
            codeStatus: {//验证码状态
                text: '获取验证码',//文字,
                isSend: true,//是否可以发送
                time: 60,//发送倒计时
            }
        }
    },
    methods: {
        /**
         * 操作
         */
        operating() {
            const _params = this.params;
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
            uni.navigateTo({
                url: `/pages/forget/password?mobile=${_params.mobile}&code=${_params.code}`
            });
        },
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
         * 监听提交参数变化
         */
        _watch_params() {
            this.$watch(() => {
                return {
                    mobile: this.params.mobile,
                    code: this.params.code,
                }
            }, (_params) => {
                const mobile = _params.mobile;
                const code = _params.code;

                this.isOperating = false;
                if (this.$checked.checkMobileNo(mobile) && this.$checked.checkSmsCode(code)) this.isOperating = true;
            });
        }
    },
    onLoad(params) {
        // var pages = getCurrentPages();
        // var page = pages[pages.length - 1];
        // // #ifdef APP-PLUS
        // var currentWebview = page.$getAppWebview();
        // console.dir(currentWebview.id);
        // currentWebview.show("slide-in-bottom");
        // // #endif
        if (params.mobile) {
            this.params.mobile = params.mobile;
            this.isDisabled = true;
        }
        this._watch_params();
    },  
    // onUnload() {
    //     var pages = getCurrentPages();
    //     var page = pages[pages.length - 1];
    //     // #ifdef APP-PLUS
    //     var currentWebview = page.$getAppWebview();
    //     console.dir(currentWebview.id);
    //     currentWebview.hide("slide-out-bottom");
    //     // #endif
    // }
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
@import '../../common/styles/entrance';
</style>

