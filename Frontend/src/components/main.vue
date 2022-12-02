<script>

import axios from 'axios'

import App from './app.vue'
import Welcome from './welcome.vue'

export default {
    name: 'MainFrame',
    data() {
        return {
            username: undefined,
        }
    },
    components: {
        App,
        Welcome,
    },
    computed: {
        loggedIn() {
            return false
        }
    },
    methods: {
        async verifyToken() {
            let token = localStorage.getItem('token')
            if (!token) {
                return false
            }
            try {
                await axios.post('/api/user/verifyToken', {
                    token: token
                })
            } catch (err) {
                return false
            }
            return true
        }
    },
    async created() {
        console.log('root page')
        if (!this.verifyToken()) {
            this.mainContent = 'Welcome'
        } else {
            this.mainContent = 'App'
        }
    }
}

</script>

<template>
    <el-container class="mainframe-container">
        <el-header class="mainframe-header">
            <img src="../assets/image/logo.png" class="mainframe-header-logo" />
            <el-button text  @click="this.$router.push('/app')" class="mainframe-navbutton">
                应用
            </el-button>
            <el-button text  @click="this.$router.push('/welcome')" class="mainframe-navbutton">
                欢迎页
            </el-button>
            <div style="flex: 0 1 100%"><!--填充空白--></div>
            <div>
                <el-container v-if="this.loggedIn" direction="horizontal">
                    你好
                </el-container>
                <el-container v-else direction="horizontal">
                    <el-button text class="mainframe-navbutton" @click="this.$router.push('/signin')">
                        登录
                    </el-button>
                    <el-button text class="mainframe-navbutton" @click="this.$router.push('/signup')">
                        注册
                    </el-button>
                </el-container>
            </div>
        </el-header>
        <el-container class="mainframe-content">
            <RouterView></RouterView>
        </el-container>
    </el-container>
</template>


<style scoped>
.mainframe-header-logo {
    --logo-height: 50px;
    height: var(--logo-height);
    padding: calc((var(--el-menu-item-height) - var(--logo-height)) / 2)
}

.mainframe-container {
    /* 占满页面 */
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;

    background: rgb(255, 255, 255);
    text-align: left;
}

.mainframe-header {
    box-shadow: 0px 0px 5px 5px #e9e9ff;
    border-bottom: #e1e1e14d solid 1px;
    height: var(--el-menu-item-height);

    /* flex */
    display: flex;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
}

.mainframe-content {
    padding: 0;
}

.mainframe-navbutton {
    font-size: large;
}
</style>
  