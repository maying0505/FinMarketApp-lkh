<template>
    <view class="entrance">
        <view class="operating">
            <view class="write">
                <input type="text" v-model="params.password" :focus="true" :password="true" maxlength="12" placeholder="请输入新密码" :placeholder-style="'color: #CCCCCC;'" />
            </view>
            <text class="msg">6-12位数字和字母的组合</text>
            <view class="write">
                <input type="text" v-model="params.oncepassword" :password="true" maxlength="12" placeholder="请再次输入新密码" :placeholder-style="'color: #CCCCCC;'" />
            </view>
            <button :class="['base-btn', !isOperating ? 'disabled' : '']" @click="operating">完成</button>
        </view>
    </view>
</template>
<script>
export default {
    name: 'forget-password',
    data() {
        return {
            isOperating: false,//是否可以操作
            params: {//提交参数
                mobile: '',
                password: '',
                oncepassword: '',
                code: ''
            },
        }
    },
    methods: {
        /**
         * 监听提交参数变化
         */
        _watch_params() {
            this.$watch(() => {
                return {
                    mobile: this.params.mobile,
                    code: this.params.code,
                    password: this.params.password,
                    oncepassword: this.params.oncepassword,
                }
            }, (_params) => {
                const mobile = _params.mobile;
                const code = _params.code;
                const password = _params.password;
                const oncepassword = _params.oncepassword;

                this.isOperating = false;
                if (this.$checked.checkMobileNo(mobile) 
                    && this.$checked.checkSmsCode(code)
                    && this.$checked.checkPassword(password)
                    && password === oncepassword) this.isOperating = true;
            });
        },
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
            if (!this.$checked.checkPassword(_params.password)) {
                uni.showToast({
                    icon: 'none',
                    title: '请输入正确6-12位密码',
                });
                return;
            }
            if (!this.$checked.checkPassword(_params.oncepassword)) {
                uni.showToast({
                    icon: 'none',
                    title: '请输入正确6-12位密码',
                });
                return;
            }
            if (_params.oncepassword !== _params.password) {
                uni.showToast({
                    icon: 'none',
                    title: '两次密码不一致',
                });
                return;
            }
            uni.showLoading({
                title: '正在修改中...',
                mask: true,
            });

            this.$http({
                data: {
                    module: 'User',
                    action: 'findpassword',
                    mobile: _params.mobile,
                    code: _params.code,
                    newpassword: _params.password,
                }
            }).then(data => {
                uni.hideLoading();
                    
                if (data.code === 200) {
                    uni.removeStorageSync('userId');
                    uni.reLaunch({
                        url: '/pages/login/code'
                    });
                }
            }).catch(err => {
                uni.hideLoading();
            });
        },
    },
    onLoad(params) {
        this.params.mobile = params.mobile || '';
        this.params.code = params.code || '';
        this._watch_params();
    }, 
}
</script>
<style lang="scss" scoped>
@import '../../common/styles/defin';
@import '../../common/styles/entrance';
</style>

