<template>
    <div class="auth-container" style="user-select: none;">
        <div class="auth-box">
            <div class="auth-box-item">
                <img src="/assets/image/logo.png" class="auth-box-logo" />
            </div>
            <el-input class="auth-box-item" placeholder="用户名" v-model="this.UserName" />
            <el-input class="auth-box-item" placeholder="邮箱" v-model="this.EmailAddress" />
            <div style="display: flex; flex-flow: row nowrap; ">
                <el-input class="auth-box-item" placeholder="验证码" v-model="this.VerificationCode" />
                <div style="flex: 0 0 10px;"></div>
                <el-button class="auth-box-item" style="flex: 0 1 250px;" type="primary" v-if="this.SecCodeCooldown"
                    disabled>
                    重新发送（{{ this.SecCodeCooldown }}）
                </el-button>
                <el-button class="auth-box-item" style="flex: 0 1 250px;" type="primary" v-else
                    @click="SendSecCode">发送验证码</el-button>
            </div>
            <el-input type="password" class="auth-box-item" placeholder="密码" v-model="this.Password" />
            <el-input type="password" class="auth-box-item bottomMargin" placeholder="确认密码" v-model="this.PasswordAgain" />
            <el-button class="auth-box-item" type="primary" @click="SignUp">注册</el-button>
            <div style="flex: 0 0 10px;"></div>
        </div>
    </div>
</template>
  
<script>

import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
    name: 'signUp',
    data() {
        return {
            EmailAddress: '',
            Password: '',
            PasswordAgain: '',
            VerificationCode: '',
            UserName: '',
            SecCodeCooldown: 0,
            CooldownID: undefined,
        }
    },
    methods: {
        async SignUp() {
            if (!this.UserName) {
                ElMessage({
                    message: '请输入用户名',
                    grouping: false,
                    type: 'error',
                })
            }
            if (!this.EmailAddress) {
                ElMessage({
                    message: '请输入电子邮箱地址',
                    grouping: false,
                    type: 'error',
                })
            }
            if (!this.VerificationCode) {
                ElMessage({
                    message: '请输入电子邮箱验证码',
                    grouping: false,
                    type: 'error',
                })
            }
            if (!this.Password) {
                ElMessage({
                    message: '请输入密码',
                    grouping: false,
                    type: 'error',
                })
            }
            if (!this.PasswordAgain) {
                ElMessage({
                    message: '请再次输入密码',
                    grouping: false,
                    type: 'error',
                })
            }
            if (this.Password !== this.PasswordAgain) {
                ElMessage({
                    message: '两次密码不一致',
                    grouping: false,
                    type: 'error',
                })
                return
            }
            try {
                await axios.post('/api/user/signup', {
                    UserName: this.UserName,
                    EmailAddress: this.EmailAddress,
                    PasswordHash: this.Password,
                    VerificationCode: this.VerificationCode,
                })
            } catch (err) {
                ElMessage({
                    message: err.response.data.msg,
                    grouping: false,
                    type: 'error',
                })
                return
            }
            ElMessage({
                message: '注册成功，请重新登录',
                grouping: false,
                type: 'success',
            })
            this.$router.push('/signin')
        },
        async SendSecCode() {
            try {
                console.warn(this.EmailAddress)
                await axios.post('api/user/sendVerificationCode', {
                    email: this.EmailAddress,
                })
            } catch (err) {
                if (err.response.data.type === 'cooldown') {
                    ElMessage({
                        message: '操作过于频繁',
                        grouping: false,
                        type: 'error',
                    })
                    this.SetCooldown(err.response.data.cd)
                    return
                }
                ElMessage({
                    message: '验证码发送失败',
                    grouping: false,
                    type: 'error',
                })
                return
            }
            ElMessage({
                message: '验证码已发送',
                grouping: false,
                type: 'success',
            })
            this.SetCooldown(60)
        },
        SetCooldown(cd) {
            this.SecCodeCooldown = Math.round(cd)
            clearInterval(this.CooldownID)
            this.CooldownID = setInterval(() => {
                if (this.SecCodeCooldown <= 0) {
                    clearInterval(this.CooldownID)
                    this.CooldownID = undefined
                    return
                }
                this.SecCodeCooldown -= 1
            }, 1000)
        }
    },
    mounted() {
        localStorage.removeItem('token')
    },
}
</script>
  
<style scoped>
@import "/assets/css/auth-box.css";

.bottomMargin{
    margin-bottom: 20px;
}

</style>