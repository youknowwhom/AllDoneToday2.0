<template>
    <body>
        <div class="container">
            <div class="header">
                <img src="../assets/image/logo.png" class="logo" />
            </div>

            <div class="content">
                <div class="sidebar">
                    <img v-if="ModeChosen != 'ToDoList'" src="../assets/image/app-leftbar-todolist.png" class="leftbar-icon" @click="ChangeMode('ToDoList')" />
                    <img v-else src="../assets/image/app-leftbar-todolist-focus.png" class="leftbar-icon" />
                    <br/>
                    <img v-if="ModeChosen != 'TimeTable'" src="../assets/image/app-leftbar-timetable.png" class="leftbar-icon" @click="ChangeMode('TimeTable')" />
                    <img v-else src="../assets/image/app-leftbar-timetable-focus.png" class="leftbar-icon" />
                    <br/>
                    <img v-if="ModeChosen != 'Concentration'"  src="../assets/image/app-leftbar-concentrate.png" class="leftbar-icon" @click="ChangeMode('Concentration')" />
                    <img v-else src="../assets/image/app-leftbar-concentrate-focus.png" class="leftbar-icon" />
                </div>
                <div class="maincontent">
                    <h1>网页正文</h1>
                    <h1>网页正文</h1>
                    <h1>网页正文</h1>
                    <h1>网页正文</h1>
                    <h1>网页正文</h1>
                    <h1>网页正文</h1>
                </div>
            </div>
        </div>
    </body>
</template>
  
<script>

export default {
    name: 'toDoList',
    data() {
        return {
            ModeChosen: "ToDoList"
        }
    },
    methods: {
        ChangeMode(modechosen){
            this.ModeChosen = modechosen;
        }

    },
}
</script>
  
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
    margin: 0 auto;
    text-align: left;
    font-size: 0;
}

.header {
    width: 100%;
    margin: 0;
    padding: 10px 0;
    background: #f6f6ff;
    box-shadow: 0px 0px 5px 5px #e9e9ff;
}

.sidebar {
    float: left;
    top: 0;
    position: relative;
    height: 100%;
    padding-top: 10px;
    padding-left: 15px;
    padding-right: 15px;
    background: #e2e2fe;
    font-size: 20px;
}

.maincontent {
    top: 0;
    margin: 0;
    padding: 1px;
    height: 100%;
    width: 570px;
    background: #eee;
    font-size: 20px;
}

.content {
    margin: 0;
    padding: 0;
    top: 0;
    height: 100%;
    background-color: aqua;
}


.leftbar-icon {
    margin-top: 20px;
    height : 25px;
    cursor: pointer;
}


</style>
  