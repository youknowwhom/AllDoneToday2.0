<script>

let isTokenValid = false

let userInfo = {}

import axios from 'axios'

export default {
    name: 'NavbarAuth',
    data() {
        return {
            loggedIn: isTokenValid,
        }
    },
    computed: {

    },
    methods: {

    },
    async created() {

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

        // 获取用户基本信息

        try {
            let response = await axios.post('/api/users/getInfo', {
                token: token,
            })
        } catch (err) {
            // 获取用户基本信息失败
        }
        return
    }
}

</script>

<template>
    <template v-if="this.loggedIn">
        <el-container class="navbar-user">
            <span>你好，</span>
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
  