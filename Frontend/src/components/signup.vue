<template>
    <div class="auth-container">
        <div class="auth-box">
            <div class="auth-box-item">
                <img src="/assets/image/logo.png" class="auth-box-logo" />
            </div>
            <el-input class="auth-box-item" placeholder="用户名" v-model="UserName" />
            <el-input class="auth-box-item" placeholder="邮箱" v-model="EmailAddress" />
            <div style="display: flex; flex-flow: row nowrap; ">
                <el-input class="auth-box-item" placeholder="验证码" v-model="SecurityCodeInput" />
                <div style="flex: 0 0 10px;"></div>
                <el-button class="auth-box-item" style="flex: 0 1 250px;" type="primary" v-if="this.SecCodeCooldown"
                    disabled>
                    重新发送（{{ this.SecCodeCooldown }}）
                </el-button>
                <el-button class="auth-box-item" style="flex: 0 1 250px;" type="primary" v-else
                    @click="SendSecCode">发送验证码</el-button>
            </div>
            <el-input class="auth-box-item" placeholder="密码" v-model="PasswordHash" />
            <el-input class="auth-box-item" placeholder="确认密码" v-model="PasswordAgainHash" />
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
            PasswordHash: '',
            PasswordAgainHash: '',
            SecurityCodeInput: '',
            UserName: '',
            SecCodeCooldown: 0,
            CooldownID: undefined,
        }
    },
    methods: {
        async SignUp() {
            let response
            try {
                response = await axios.post('/api/user/signup', {
                    UserName: this.UserName,
                    EmailAddress: this.EmailAddress,
                    PasswordHash: this.PasswordHash,
                    SecurityCode: this.SecurityCodeInput
                })
            } catch (err) {
                console.error(err.response)
                ElMessage({
                    message: '未知错误',
                    grouping: false,
                    type: 'error',
                })
                return
            }

        },
        async SendSecCode() {
            try {
                await axios.post('api/user/sendSecurityCode', {
                    email: this.EmailAddress,
                })
            } catch (err) {
                ElMessage({
                    message: '验证码发送失败',
                    grouping: false,
                    type: 'error',
                })
                return
            }
            this.SecCodeCooldown = 60
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
</style>