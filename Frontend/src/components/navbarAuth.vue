<script>

let isTokenValid = false

import axios from 'axios'

export default {
    name: 'NavbarAuth',
    data() {
        return {
            loggedIn: isTokenValid,
            userInfo: {
                username: '',
            }
        }
    },
    computed: {

    },
    methods: {
        handleDropdownCommand(command) {
            if (command === 'logout') {
                localStorage.removeItem('token');
                this.loggedIn = false
                this.$router.push('/welcome')
            }
        }
    },
    async mounted() {

        // 获取用户基本信息

        try {
            let response = await axios.post('/api/user/getInfo', {
                token: localStorage.getItem('token'),
            })
            this.userInfo.username = response.data.UserName
        } catch (err) {
            // 获取用户基本信息失败
            console.error(err)
        }
        return

    },
    async setup() {
        // await new Promise(r => setTimeout(r, 2000)) // sleep

        let token = localStorage.getItem('token')
        if (!token) {
            isTokenValid = false
            return
        }
        try {
            await axios.post('/api/user/verifyToken', {
                token: token,
            })
        } catch (err) {
            isTokenValid = false
            return
        }
        isTokenValid = true
    }
}

</script>

<template>
    <template v-if="this.loggedIn">
        <el-container class="navbar-user-dropdown-container">
            <el-dropdown style="height: 100%" @command="this.handleDropdownCommand">
                <el-container class="navbar-user-inner-container">
                    <p>你好，{{this.userInfo.username}}</p>
                </el-container>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="info">个人设置</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </el-container>
    </template>
    <template v-else>
        <button class="navbar-button" @click="this.$router.push('/signin')">
            登录
        </button>
        <button class="navbar-button" @click="this.$router.push('/signup')">
            注册
        </button>
    </template>
</template>


<style scoped>
@import "../assets/css/navbar.css";
</style>
  