<script>

import axios from 'axios'

export default {
    name: 'MainFrame',
    data() {
        return {

        }
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
    }
}

</script>

<template>
    <el-container class="mainframe-container">
        <el-header class="mainframe-header">
            <img @click="this.$router.push('/welcome')" src="../assets/image/logo.png" class="mainframe-header-logo" />
            <button @click="this.$router.push('/app')" class="mainframe-navbutton">
                应用
            </button>
            <button @click="this.$router.push('/welcome')" class="mainframe-navbutton">
                欢迎页
            </button>
            <div style="flex: 0 1 100%"><!--填充空白--></div>
            <div style="height: 100%">
                <el-container v-if="this.loggedIn" direction="horizontal" style="height: 100%">
                    你好
                </el-container>
                <el-container v-else direction="horizontal" style="height: 100%">
                    <button class="mainframe-navbutton" @click="this.$router.push('/signin')">
                        登录
                    </button>
                    <button class="mainframe-navbutton" @click="this.$router.push('/signup')">
                        注册
                    </button>
                </el-container>
            </div>
        </el-header>
        <el-container class="mainframe-content">
            <Suspense>
                <template #default>
                    <RouterView></RouterView>
                </template>
                <template #fallback>
                    <div><!--TODO 加载画面--></div>
                </template>
            </Suspense>
        </el-container>
    </el-container>
</template>


<style scoped>
.mainframe-header-logo {
    --logo-height: 50px;
    vertical-align: middle;
    height: min(var(--logo-height), var(--mainframe-header-height));
    cursor: pointer;
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
    --mainframe-header-height: var(--el-menu-item-height);

    box-shadow: 0px 0px 5px 5px #e9e9ff;
    box-sizing: content-box;
    border-bottom: 1px var(--el-border-color) var(--el-border-style);
    height: var(--mainframe-header-height);

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
    --mainframe-navbutton-horizontal-padding: 15px;
    --mainframe-navbutton-underline-width: 2px;
    box-sizing: border-box;
    height: 100%;
    padding: 0;
    padding-left: var(--mainframe-navbutton-horizontal-padding);
    padding-right: var(--mainframe-navbutton-horizontal-padding);
    font-size: large;
    white-space: nowrap;
    background-color: transparent;
    text-align: center;
    border: none;
    transition: var(--el-transition-duration-fast);
    color: var(--el-color-primary-dark-2);
}

.mainframe-navbutton:hover {
    cursor: pointer;
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    border-top: var(--mainframe-navbutton-underline-width) solid transparent;
    border-bottom: var(--mainframe-navbutton-underline-width) solid var(--el-color-primary);
}
</style>
  