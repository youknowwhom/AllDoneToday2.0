<script>

import ToDoList from './todolist.vue'
// import TimeTable from './timetable.vue'

export default {
    name: 'app',
    data() {
        return {
            //最左侧选择的功能 应为"ToDoList"[清单] "TimeTable"[日程] "Concentration"[专注]之一
            ModeChosen: 'ToDoList',
        }
    },
    components: {
        ToDoList,
        // TimeTable,
    }
}

</script>

<template>

    <body>
        <el-container class="container">
            <el-header class="header">
                <img src="../assets/image/logo.png" class="logo" />
            </el-header>

            <el-container class="app-content">
                <el-aside class="sidebar" width="auto">
                    <img v-if="ModeChosen != 'ToDoList'" src="../assets/image/app-leftbar-todolist.png"
                        class="leftbar-icon" @click="ModeChosen = 'ToDoList'" />
                    <img v-else src="../assets/image/app-leftbar-todolist-focus.png" class="leftbar-icon" />
                    <br />
                    <!-- <img v-if="ModeChosen != 'TimeTable'" src="../assets/image/app-leftbar-timetable.png"
                        class="leftbar-icon" @click="ModeChosen = 'TimeTable'" />
                    <img v-else src="../assets/image/app-leftbar-timetable-focus.png" class="leftbar-icon" />
                    <br /> -->
                    <img v-if="ModeChosen != 'Concentration'" src="../assets/image/app-leftbar-concentrate.png"
                        class="leftbar-icon" @click="ModeChosen = 'Concentration'" />
                    <img v-else src="../assets/image/app-leftbar-concentrate-focus.png" class="leftbar-icon" />
                </el-aside>
                <el-main class="component-content">
                    <component :is="ModeChosen" />
                </el-main>
            </el-container>
        </el-container>
    </body>
</template>


<style scoped>
body {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    margin: 0;
    text-align: center;
}

.logo {
    height: 50px;
}

.container {
    width: 100%;
    height: 100%;
    background: rgb(255, 255, 255);
    text-align: left;
}

.header {
    background: #f5f5f584;
    box-shadow: 0px 0px 5px 5px #e9e9ff;
    border-bottom: #e1e1e14d solid 1px;
}

.sidebar {
    padding-left: 13px;
    padding-right: 13px;
    background: #ebebef;
    font-size: 20px;
}

.app-content {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    height: 100%;
    background-color: rgb(255, 255, 255);
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
  