<script>

import axios from 'axios'
import { ElMessage } from 'element-plus'

let userLoggedIn = false

export default {
    name: 'App',
    data() {
        return {
            loggedIn: userLoggedIn,
        }
    },
    methods: {

    },
    async setup() {
        console.debug('app')
        let token = localStorage.getItem('token')
        if (!token) {
            console.debug('no token')
            userLoggedIn = false
            return
        }
        try {
            await axios.post('/api/user/verifyToken', {
                token: token
            })
        } catch (err) {
            console.debug('bad token')
            localStorage.removeItem('token')
            userLoggedIn = false
            return
        }
        console.debug('good token')
        userLoggedIn = true
        return
    },
    created() {
        if (!this.loggedIn) {
            console.debug('no')
            ElMessage({
                message: '您还未登录',
                type: 'error',
                grouping: true,
            })
            this.$router.replace('/welcome')
        }
    }
}

</script>

<template>
    <el-container class="app-content" v-if="this.loggedIn">
        <el-aside class="sidebar" width="auto">
            <!--TODO 优化此处判断-->
            <img v-if="this.$route.fullPath !== '/app/ToDoList'" src="/assets/image/app-leftbar-todolist.png" class="leftbar-icon"
                @click="this.$router.push('ToDoList')" />
            <img v-else src="/assets/image/app-leftbar-todolist-focus.png" class="leftbar-icon" />
            <br />
            <!-- <img v-if="this.$route.fullPath !== '/app/TimeTable'" src="/assets/image/app-leftbar-timetable.png"
                        class="leftbar-icon" @click="this.$router.push('TimeTable')" />
                    <img v-else src="/assets/image/app-leftbar-timetable-focus.png" class="leftbar-icon" />
                    <br /> -->
            <img v-if="this.$route.fullPath !== '/app/Concentration'" src="/assets/image/app-leftbar-concentrate.png" class="leftbar-icon"
                @click="this.$router.push('Concentration')" />
            <img v-else src="/assets/image/app-leftbar-concentrate-focus.png" class="leftbar-icon" />
        </el-aside>
        <el-main class="component-content">
            <RouterView></RouterView>
        </el-main>
    </el-container>
</template>


<style scoped>
.sidebar {
    padding-left: 13px;
    padding-right: 13px;
    background: #f5f5f5;
    font-size: 20px;
}

.app-content {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    height: 100%;
}


.leftbar-icon {
    margin-top: 20px;
    height: 25px;
    cursor: pointer;
}

.component-content {
    height: 100%;
    width: 100%;
    padding: 0;
    display: flex;
}
</style>
  