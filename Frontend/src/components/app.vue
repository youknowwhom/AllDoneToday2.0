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
        <div class="container">
            <div class="header">
                <img src="../assets/image/logo.png" class="logo" />
            </div>

            <div class="app-content">
                <div class="sidebar">
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
                </div>
                <div class="component-content">
                <component :is="ModeChosen" /></div>
            </div>
        </div>
    </body>
</template>


<style scoped>
body {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    padding: 0;
    margin: 0;
    text-align: center;
    caret-color: transparent;
}

.logo {
    margin-left: 20px;
    height: 50px;
}

.container {
    width: 100%;
    height: 100%;
    background: rgb(255, 255, 255);
    text-align: left;
}

.header {
    width: 100%;
    margin: 0;
    padding: 10px 0;
    background: #f5f5f584;
    box-shadow: 0px 0px 5px 5px #e9e9ff;
    border-bottom: #e1e1e14d solid 1px;
}

.sidebar {
    float: left;
    top: 0;
    position: relative;
    height: 100%;
    padding-top: 10px;
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
    display: flex;
}

:root {
  --el-color-primary: #7a7af9;
}
</style>
  