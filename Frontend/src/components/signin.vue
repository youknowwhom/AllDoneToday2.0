<template>
    <div class="body" onselectstart="return false;">
        <div class="box">
            <img src="/assets/image/logo.png" class="logo" />
            <input type="text" placeholder="用户名" class="input" v-model="LoginInfo.username" /><br />
            <input type="password" placeholder="密码" class="input" v-model="LoginInfo.passwordHash" /><br />
            <input type="submit" value="登录" class="login-button" @click="Login" />
            <input type="submit" value="忘记密码" class="forget-password" @click="this.$router.push('/forgetpassword')" />
            <input type="submit" value="注册" class="register" @click="this.$router.push('/signup')" />
        </div>
    </div>
</template>
 

<script>

import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
    name: 'signIn',
    data() {
        return {
            LoginInfo: {
                username: '',
                passwordHash: '',
            }
        }
    },
    mounted() {
        localStorage.removeItem('token')
    },
    methods: {
        async Login() {
            let response
            try {
                response = await axios.post('/api/user/signin', this.LoginInfo)
            } catch (err) {
                if (err.response.data.result == 'fail') {
                    ElMessage({
                        message: err.response.data.msg,
                        grouping: false,
                        type: 'error',
                    })
                } else {
                    ElMessage({
                        message: '未知错误',
                        grouping: false,
                        type: 'error',
                    })
                }
                return
            }
            ElMessage({
                message: '登录成功',
                grouping: false,
                type: 'success',
            })
            localStorage.setItem('token', response.data.token)
            this.$router.push('/app')
        },

    },
}
</script>
  
<style scoped>
.body {
    position: fixed;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    left: 0px;
    top: 0px;
    background-image: url(/assets/image/background.jpg);
}

.box {
    position: relative;
    top: 15%;
    border-radius: 25px;
    background-color: white;
    padding: 20px;
    width: 450px;
    height: 450px;
    margin: 0 auto;
    caret-color: transparent;
}

.logo {
    height: 80px;
    padding-top: 10px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
}

.input[type="text"] {
    background: url(/assets/image/user.png) no-repeat 0.25% 47%;
    background-size: 30px 30px;
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    margin: 0 auto;
    padding: 10px;
    padding-left: 50px;
    height: 40px;
    font-size: 20px;
    border: 0;
    outline: none;
    border-bottom: #c5c5fd solid;
    caret-color: #7a7af9;
}

.input::-webkit-input-placeholder {
    color: #cfcfcf;
}

.input[type="text"]:focus {
    background: url(/assets/image/user-focus.png) no-repeat 0.25% 47%;
    background-size: 30px 30px;
    border-bottom: #7a7af9 solid;
    animation: mymove 2s 1 linear;
}

.input[type="password"] {
    background: url(/assets/image/password.png) no-repeat 1% 47%;
    background-size: 25px 25px;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 350px;
    height: 40px;
    padding: 10px;
    padding-left: 50px;
    margin-top: 30px;
    font-size: 20px;
    border: 0;
    outline: none;
    border-bottom: #c5c5fd solid;
    caret-color: #7a7af9;
}

.input[type="password"]:focus {
    background: url(/assets/image/password-focus.png) no-repeat 1% 47%;
    background-size: 25px 25px;
    border-bottom: #2e2ed9 solid;
    animation: mymove 2s 1 linear;
}

@keyframes mymove {
    0% {
        border-bottom-color: #c5c5fd;
    }

    33% {
        border-bottom-color: #a4a4f2;
    }

    66% {
        border-bottom-color: #8989d8;
    }

    100% {
        border-bottom-color: #7a7af9;
    }
}

.login-button {
    background-color: #7a7af9;
    color: white;
    position: absolute;
    top: 72%;
    left: 8%;
    width: 410px;
    height: 45px;
    border: none;
    font-size: large;
    border-radius: 4px;
    cursor: pointer;
}

.login-button:hover {
    background-color: #c5c5fd;
}

.forget-password {
    color: #7a7af9;
    background-color: white;
    position: absolute;
    top: 88%;
    left: 7%;
    border: none;
    font-size: medium;
}

.forget-password:hover {
    text-decoration: underline;
    cursor: pointer;
}

.register {
    color: #7a7af9;
    background-color: white;
    position: absolute;
    top: 88%;
    left: 84%;
    border: none;
    font-size: medium;
}

.register:hover {
    text-decoration: underline;
    cursor: pointer;
}
</style>
