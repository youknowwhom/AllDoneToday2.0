<script>

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

    },
    async created() {
        console.debug('root page')
    }
}
</script>

<script setup>

import { defineAsyncComponent } from 'vue'
const NavbarAuth = defineAsyncComponent(() => import('./navbarAuth.vue'))

</script>

<template>
    <el-container class="mainframe-container">
        <el-header class="navbar">
            <img @click="this.$router.push('/welcome')" src="../assets/image/logo.png" class="navbar-logo" />
            <button @click="this.$router.push('/app')" class="navbar-button">
                应用
            </button>
            <button @click="this.$router.push('/welcome')" class="navbar-button">
                欢迎页
            </button>
            <div style="flex: 0 1 100%"><!--填充空白--></div>
            <div style="height: 100%; flex: 0 0 auto;">
                <Suspense>
                    <template #default>
                        <NavbarAuth />
                    </template>
                    <template #fallback>
                        <el-container v-loading="true" style="width: 100px; height: 100%;">
                            &nbsp;
                        </el-container>
                    </template>
                </Suspense>
            </div>
        </el-header>
        <el-container class="mainframe-content">
            <Suspense>
                <template #default>
                    <RouterView></RouterView>
                </template>
                <template #fallback>
                    <el-container v-loading="true" style="width: 100px; height: 100%;">
                        &nbsp;
                    </el-container>
                </template>
            </Suspense>
        </el-container>
    </el-container>
</template>


<style scoped>
@import "../assets/css/navbar.css";

.mainframe-container {
    /* 占满页面 */
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
}

.mainframe-content {
    padding: 0;
    height: 100%;
}
</style>
  