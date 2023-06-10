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
    <div class="mainframe-container">
        <el-header class="navbar">
            <img @click="this.$router.push('/welcome')" src="/assets/image/logo.png" class="navbar-logo" />
            <button @click="this.$router.push('/app')" class="navbar-button">
                应用
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
        <div class="mainframe-content">
            <Suspense>
                <template #default>
                    <RouterView></RouterView>
                </template>
                <template #fallback>
                    <div v-loading="true" style="width: 100px; height: 100%;">
                        &nbsp;
                    </div>
                </template>
            </Suspense>
        </div>
    </div>
</template>


<style scoped>
@import "/assets/css/navbar.css";

.navbar{
    user-select: none;
}
.mainframe-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
}

.mainframe-content {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
}
</style>
  