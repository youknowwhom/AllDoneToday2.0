<template>

    <el-container class="ToDoList-container">
        <div class="todolist-filter">
            <p class="todolist-filter-index"> 时间 </p>
            <div class="todolist-filter-alternative-box">
                <img src="../assets/image/filter-all.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 全部 </p>
            </div>
            <div class="todolist-filter-alternative-box">
                <img src="../assets/image/filter-past.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 往日 </p>
            </div>
            <div class="todolist-filter-alternative-box">
                <img src="../assets/image/filter-today.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 今日 </p>
            </div>
            <div class="todolist-filter-alternative-box">
                <img src="../assets/image/filter-recent7.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 最近七日 </p>
            </div>
            <hr class="todolist-filter-separater">
            <p class="todolist-filter-index"> 四象限 </p>
            <div class="todolist-filter-alternative-box">
                <img src="../assets/image/filter-one.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 重要 & 紧急 </p>
            </div>
            <div class="todolist-filter-alternative-box">
                <img src="../assets/image/filter-two.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 重要 & 不紧急 </p>
            </div>
            <div class="todolist-filter-alternative-box">
                <img src="../assets/image/filter-three.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 紧急 & 不重要 </p>
            </div>
            <div class="todolist-filter-alternative-box">
                <img src="../assets/image/filter-four.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 不重要 & 不紧急 </p>
            </div>
        </div>
        <el-divider direction="vertical" style="height: 100%" />

        <el-container class="todolist-main" direction="vertical">

            <el-container class="todolist-top-itemadder" direction="horizontal">
                <el-input type="text" placeholder="在此处添加新的待办事项" id="todolist-top-itemadder-input" />
                <el-divider direction="vertical" style="height: 100%" />
                <el-button type="primary" class="todolist-button" color="#7a7af9">
                    <el-icon color="#FFFFFF">
                        <Plus />
                    </el-icon>
                </el-button>
            </el-container>
            <el-divider content-position="left">
                <h4 class="todolist-top-headline">待办清单</h4>
            </el-divider>
            <el-container class="todolist-list" direction="vertical">
                <el-collapse v-model="this.openedGroups">
                    <template v-for="group in eventGrouped" :key="group.groupName">
                        <el-collapse-item :title="group.groupName" :name="group.groupName">
                            <el-space direction="vertical" alignment="flex-start" :fill="true"
                                class="todolist-item-group">
                                <template v-for="ev in group.events" :key="ev.id">
                                    <el-card class="todolist-item" :class="{ chosen: this.chosenEventID == ev.id }"
                                        :shadow="this.chosenEventID == ev.id ? 'always' : 'hover'"
                                        :body-style="{ padding: '8px' }" @click="this.chosenEventID = ev.id">
                                        <el-checkbox class="todolist-item-checkbox" v-model="ev.finished"></el-checkbox>
                                        {{ ev.brief }}
                                    </el-card>
                                </template>
                            </el-space>
                        </el-collapse-item>
                    </template>
                </el-collapse>
            </el-container>
        </el-container>
        <el-divider direction="vertical" style="height: 100%" />
        <div class="todolist-detail-right-background">
            <el-container class="todolist-detail" v-if="this.chosenEventID">
                <!-- <el-input v-model="chosenEvent.brief" /> -->
                {{chosenEvent.brief}}
            </el-container>
        </div>

    </el-container>

</template>
  
<script>

// import { v4 as uuid } from 'uuid'

let GroupFilters = [
    {
        groupName: '已完成',
        reversePosition: true,
        filterFunction(ev) {
            return ev.finished == true
        }
    },
    {
        groupName: '已过期',
        filterFunction(ev) {
            if (ev.time.endTime) {
                return ev.time.endTime < new Date()
            } else if (ev.time.beginTime) {
                return ev.time.beginTime < new Date()
            } else {
                return false
            }
        }
    },
    {
        groupName: '进行中',
        filterFunction(ev) {
            let currentTime = new Date()
            return ev.time.beginTime <= currentTime && currentTime <= ev.time.endTime
        }
    },
    {
        groupName: '今天',
        filterFunction(ev) {
            let evTime = new Date(ev.time.beginTime), currentTime = new Date()
            if (evTime.getFullYear() != currentTime.getFullYear()) return false
            if (evTime.getMonth() != currentTime.getMonth()) return false
            return (new Date(ev.time.beginTime)).getDate() == (new Date()).getDate()
        }
    },
    {
        groupName: '近期',
        filterFunction(ev) {
            let evTime = new Date(ev.time.beginTime), currentTime = new Date()
            if (evTime.getFullYear() != currentTime.getFullYear()) return false
            if (evTime.getMonth() != currentTime.getMonth()) return false
            return (new Date(ev.time.beginTime)).getDate() <= (new Date()).getDate() + 7
        }
    }
]

let DisplayFilters = []

export default {
    name: 'ToDoList',
    data() {
        return {
            openedGroups: [],
            chosenEventID: undefined,
            EventList: [
                {
                    id: '0f819113-1b91-48cf-bddc-9179c35689f6',
                    brief: '测试事项 1 普通',
                    finished: false,
                    description: '第一个测试事件',
                    importance: {
                        important: false,
                        urgent: false,
                    },
                    time: {
                        beginTime: new Date(2077, 1, 1),
                    }
                },
                {
                    id: 'cdd8af25-899a-44fb-b0d1-204c239df3fe',
                    brief: '测试事项 2 近期',
                    finished: false,
                    description: '第二个测试事件',
                    importance: {
                        important: true,
                        urgent: false,
                    },
                    time: {
                        beginTime: (new Date).setDate((new Date()).getDate() + 1),
                    }
                },
                {
                    id: 'f1cfa4f3-f164-46f8-b5fb-33e61f457a0e',
                    brief: '测试事项 3 过期未完成',
                    finished: false,
                    description: '第三个测试事件',
                    importance: {
                        important: true,
                        urgent: true,
                    },
                    time: {
                        beginTime: new Date(1926, 8, 17),
                    }
                },
                {
                    id: 'cc5856a2-1c84-41ca-a11c-2d18517e03b1',
                    brief: '测试事项 4 已完成',
                    finished: true,
                    description: '第四个测试事件',
                    importance: {
                        important: false,
                        urgent: true,
                    },
                    time: {
                        beginTime: new Date(2077, 1, 1),
                    }
                },
                {
                    id: '1c142254-3e58-4ef9-9af8-02116b4d57af',
                    brief: '测试事项 5 进行中',
                    finished: false,
                    description: '第五个测试事件',
                    importance: {
                        important: true,
                        urgent: false,
                    },
                    time: {
                        beginTime: new Date(1926, 8, 17),
                        endTime: new Date(2077, 1, 1),
                    }
                },
            ]
        }
    },
    methods: {

    },
    computed: {
        eventGrouped() {
            let ungrouped = this.EventList
            for (let filter of DisplayFilters) {
                ungrouped = ungrouped.filter(filter.filterFunction)
            }
            let grouped = []
            let grouped_reverse = []
            for (let filter of GroupFilters) {
                let filterd = ungrouped.filter(filter.filterFunction)
                ungrouped = ungrouped.filter(ev => !filter.filterFunction(ev))
                if (filterd.length !== 0) {
                    (filter.reversePosition ? grouped_reverse : grouped).push({
                        groupName: filter.groupName,
                        events: filterd
                    })
                }
            }
            if (ungrouped.length > 0) {
                grouped.push({
                    groupName: '未分组',
                    events: ungrouped
                })
            }
            return grouped.concat(grouped_reverse.reverse())
        },
        chosenEvent() {
            if (!this.chosenEventID) return undefined
            return this.EventList.find(ev => ev.id === this.chosenEventID)
        }
    },
    created() {
        this.openedGroups = this.eventGrouped.map(group => group.groupName) // 默认展开所有事件组
    }
}
</script>
  
<style scoped>
.todolsit-main-additem {
    padding: auto;
}

.todolist-main {
    flex: 0 0 35%;
    padding: 20px;
}

.todolist-detail-right-background {
    flex: 1 1 auto;
}

.todolist-filter {
    flex: 0 0 20%;
    padding: 0;
}

.todolist-top-headline {
    font-weight: bold;
    margin: 0;
}

#todolist-top-itemadder-input {
    height: fit-content;
    caret-color: #7a7af9;
    background-color: #f6f6ff;
}

.todolist-top-itemadder {
    height: fit-content;
    background-color: #ffffff;
    flex: 0 0 auto;
}

.todolist-filter-icon {
    height: 30px;
    margin-left: 8px;
    margin-right: 5px;
    margin-top: 5px;
}

.todolist-filter-alternative-box:hover {
    background-color: #f7f7ff;
    cursor: pointer;
    background-clip: content-box;
}

.todolist-filter-alternative-box:active {
    cursor: pointer;
    background-color: #f2f2ff;
    background-clip: content-box;
}


.todolist-filter-alternative-box {
    padding-left: 10px;
    padding-right: 10px;
    height: 40px;
    margin-top: 5px;
    margin-bottom: 5px;
    line-height: 40px;
    border-radius: 25px;
    display: flex;
}

.todolist-filter-alternative-text {
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 0;
    margin-bottom: 0;
    width: max-content;
}

.todolist-filter-index {
    padding-left: 25px;
    padding-right: 25px;
    color: #5b5bef;
}

.todolist-filter-separater {
    margin-top: 30px;
    margin-bottom: 18px;
    border: none;
    height: 1px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: #7a7af9;
    opacity: 20%;
}

.ToDoList-container {
    height: 100%;
    width: 100%;
    padding: 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    background-color: rgb(255, 255, 255);
    font-size: medium;
}

.todolist-detail-right-itemname {
    font-weight: bolder;
}

.todolist-detail-right-time {
    padding-top: 10px;
    font-size: 13px;
    font-weight: bold;
    display: inline-block;
    white-space: nowrap;
    color: #7a7af9;
}

.todolist-detail-right-priority {
    padding-top: 5px;
    font-size: 13px;
    font-weight: bold;
    display: inline-block;
    white-space: nowrap;
    color: #b8b8ff;
}

.todolist-item-group {
    width: 100%
}

.todolist-item-checkbox {}

.todolist-detail {
    background: white;
    width: 100%;
    height: 100%;
}

.todolist-item.chosen {
    background-color: #ebebefaa;
}
</style>
  