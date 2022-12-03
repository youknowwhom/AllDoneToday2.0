<template>

    <el-container class="ToDoList-container">
        <div class="todolist-filter">
            <el-scrollbar>
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
            </el-scrollbar>
        </div>
        <el-divider direction="vertical" style="height: 100%" />

        <el-container class="todolist-main" direction="vertical" ref="ToDoList_CenterList">
            <el-container class="todolist-top-itemadder" direction="horizontal">
                <el-input type="text" placeholder="在此处添加新的待办事项" class="todolist-top-itemadder-input"
                    v-model="this.newEventBriefInput" clearable @keypress.enter="CreateEventFromBrief" />
                <el-divider direction="vertical" style="height: 100%; border: none;" />
                <el-button type="primary" @click="CreateEventFromBrief" style="height: 100%;">
                    <el-icon color="#FFFFFF">
                        <Plus />
                    </el-icon>
                </el-button>
            </el-container>
            <el-divider content-position="left">
                <h4 class="todolist-top-headline">待办清单</h4>
            </el-divider>
            <el-container direction="vertical">
                <el-scrollbar>
                    <el-collapse v-model="this.openedGroups">
                        <template v-for="group in eventGrouped" :key="group.groupName">
                            <el-collapse-item :title="group.groupName" :name="group.groupName">
                                <el-space direction="vertical" alignment="flex-start" :fill="true"
                                    class="todolist-item-group">
                                    <template v-for="ev in group.events" :key="ev.id">
                                        <el-card class="todolist-item" :class="{ chosen: this.chosenEventID == ev.id }"
                                            :shadow="this.chosenEventID == ev.id ? 'always' : 'hover'"
                                            :body-style="{ padding: '10px' }" @click="this.chosenEventID = ev.id">
                                            <el-space style="display: flex; flex-flow: row nowrap; align-items: center">
                                                <el-checkbox class="todolist-item-checkbox" v-model="ev.finished">
                                                </el-checkbox>
                                                <span class="todolist-list-item-title" :class="{ empty: !ev.brief }">{{
                                                        ev.brief ? ev.brief : '无标题'
                                                }}
                                                </span>
                                                <el-tag v-if="ev.importance.important">重要</el-tag>
                                                <el-tag v-if="ev.importance.urgent">紧急</el-tag>
                                            </el-space>
                                        </el-card>
                                    </template>
                                </el-space>
                            </el-collapse-item>
                        </template>
                    </el-collapse>
                </el-scrollbar>
            </el-container>
        </el-container>
        <el-divider direction="vertical" style="height: 100%" />
        <div class="todolist-detail-right-background">
            <el-container class="todolist-detail" v-if="this.chosenEventID" direction="vertical">
                <el-space class="todolist-detail-container" direction="vertical" :fill="true">
                    <input v-model="chosenEvent.brief" id="todolist-detail-brief" placeholder="添加事件简介……" />
                </el-space>
                <el-space class="todolist-detail-container" direction="horizontal">
                    <span style="font-weight: bold; margin: 0; width: 100px;">重要程度：</span>
                    <el-check-tag 
                        :checked="this.chosenEvent.importance.important" 
                        style="width:100px; text-align: center; "
                        @change="status => this.chosenEvent.importance.important = status">
                        {{ this.chosenEvent.importance.important ? '重要' : '不重要' }}
                    </el-check-tag>
                    <el-check-tag 
                        :checked="this.chosenEvent.importance.urgent" 
                        style="width:100px; text-align: center; "
                        @change="status => this.chosenEvent.importance.urgent = status">
                        {{ this.chosenEvent.importance.urgent ? '紧急' : '不紧急' }}
                    </el-check-tag>
                </el-space>
                <el-space class="todolist-detail-container" direction="horizontal">
                    <el-button text bg v-if="!this.chosenEvent.time.beginTime.date"
                        @click="this.chosenEvent.time.beginTime.date = new Date()">
                        <el-space>
                            <el-icon>
                                <Calendar />
                            </el-icon>
                            <span>添加{{ this.beginTimeTag +
                                    this.beginTimeType
                            }}</span>
                        </el-space>
                    </el-button>
                    <template v-else>
                        <span style="font-weight: bold; margin: 0; width: 100px;">
                            {{ this.beginTimeTag + this.beginTimeType + '：' }}
                        </span>
                        <el-date-picker v-model="this.chosenEvent.time.beginTime.date"></el-date-picker>
                        <el-button text bg v-if="!this.chosenEvent.time.beginTime.time"
                            @click="this.chosenEvent.time.beginTime.time = new Date()">
                            <el-space>
                                <el-icon>
                                    <Clock />
                                </el-icon>
                                <span>添加{{ this.beginTimeTag }}时间</span>
                            </el-space>
                        </el-button>
                        <el-time-picker v-else v-model="this.chosenEvent.time.beginTime.time"></el-time-picker>
                    </template>
                </el-space>
                <el-space class="todolist-detail-container" direction="horizontal"
                    v-if="this.chosenEvent.time.beginTime.date">
                    <el-button text bg v-if="!this.chosenEvent.time.endTime.date"
                        @click="this.chosenEvent.time.endTime.date = new Date()">
                        <el-space>
                            <el-icon>
                                <Calendar />
                            </el-icon>
                            <span>添加结束{{ this.endTimeType }}</span>
                        </el-space>
                    </el-button>
                    <template v-else>
                        <span style="font-weight: bold; margin: 0; width: 100px;">{{ '结束' + this.endTimeType + '：' }}
                        </span>
                        <el-date-picker v-model="this.chosenEvent.time.endTime.date"></el-date-picker>
                        <el-button text bg v-if="!this.chosenEvent.time.endTime.time"
                            @click="this.chosenEvent.time.endTime.time = new Date()">
                            <el-space>
                                <el-icon>
                                    <Clock />
                                </el-icon>
                                <span>添加结束时间</span>
                            </el-space>
                        </el-button>
                        <el-time-picker v-else v-model="this.chosenEvent.time.endTime.time"></el-time-picker>
                    </template>
                </el-space>
                <el-space class="todolist-detail-container" direction="vertical" :fill="true" style="flex: 1 1 100%;">
                    <textarea placeholder="点击添加详细信息" v-model="this.chosenEvent.description"
                        class="todolist-detail-description"></textarea>
                </el-space>
                <el-divider style="margin: 0;" />
                <el-space class="todolist-detail-container" direction="horizontal" style="flex-direction: row-reverse;">
                    <el-button style="width: 100px;" type="danger" @click="this.deleteEvent(this.chosenEvent)">
                        <el-space direction="horizontal">
                            <el-icon>
                                <Delete />
                            </el-icon>
                            <span>删除</span>
                        </el-space>
                    </el-button>
                    <el-button style="width: 100px;" @click="this.updateEvent(this.chosenEvent, true)">
                        <el-space direction="horizontal">
                            <el-icon>
                                <Check />
                            </el-icon>
                            <span>保存</span>
                        </el-space>
                    </el-button>
                </el-space>
            </el-container>
        </div>

    </el-container>

</template>
  
<script>

import { v4 as uuid } from 'uuid'

import { ElMessage } from 'element-plus'
import axios from 'axios'

function compareDate(a, b) {
    a = new Date(a), b = new Date(b)
    if (a.getFullYear() != b.getFullYear()) return a.getFullYear() < b.getFullYear() ? -1 : 1
    if (a.getMonth() != b.getMonth()) return a.getMonth() < b.getMonth() ? -1 : 1
    if (a.getDate() != b.getDate()) return a.getDate() < b.getDate() ? -1 : 1
    return 0
}

function compareTime(a, b) {
    a = new Date(a), b = new Date(b)
    if (a.getHours() != b.getHours()) return a.getHours() < b.getHours() ? -1 : 1
    if (a.getMinutes() != b.getMinutes()) return a.getMinutes() < b.getMinutes() ? -1 : 1
    if (a.getSeconds() != b.getSeconds()) return a.getSeconds() < b.getSeconds() ? -1 : 1
    if (a.getMilliseconds() != b.getMilliseconds()) return a.getMilliseconds() < b.getMilliseconds() ? -1 : 1
    return 0
}

function CompareDateTime(a, b) {
    let dateResult = compareDate(a.date, b.date)
    if (!a.time || !b.time || dateResult !== 0) return dateResult
    return compareTime(a.time, b.time)
}

function CheckDateTime(x) {
    if (!x) return false
    return !!x.date
}

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
            let curDateTime = {
                date: new Date(),
                time: new Date(),
            }
            if (!ev.time) return false
            if (CheckDateTime(ev.time.endTime)) {
                return CompareDateTime(curDateTime, ev.time.endTime) === 1
            } else if (CheckDateTime(ev.time.beginTime)) {
                return CompareDateTime(curDateTime, ev.time.beginTime) === 1
            } else {
                return false
            }
        }
    },
    {
        groupName: '进行中',
        filterFunction(ev) {
            if (!ev.time) return false
            if (!CheckDateTime(ev.time.beginTime) || !CheckDateTime(ev.time.endTime)) return false
            let curDateTime = {
                date: new Date(),
                time: new Date(),
            }
            return CompareDateTime(ev.time.beginTime, curDateTime) !== 1
                || CompareDateTime(curDateTime, ev.time.endTime) !== 1
        }
    },
    {
        groupName: '今天',
        filterFunction(ev) {
            if (!ev.time) return false
            if (!CheckDateTime(ev.time.beginTime)) return false
            return compareDate(ev.time.beginTime.date, new Date()) === 0
        }
    },
    {
        groupName: '近期',
        filterFunction(ev) {
            if (!ev.time) return false
            if (!CheckDateTime(ev.time.beginTime)) return false
            let evDate = new Date(ev.time.beginTime.date), next7day = (new Date()).setDate((new Date()).getDate() + 7)
            return compareDate(new Date(), evDate) === -1 && compareDate(evDate, next7day) === -1
        }
    }
]

let DisplayFilters = []

// import axios from 'axios'

let loopRequestID = 0
const maxLoopRequestID = 10000
const updateDelay = 1000

let notUserEdit = false

export default {
    name: 'ToDoList',
    data() {
        return {
            newEventBriefInput: '',
            openedGroups: [],
            chosenEventID: undefined,
            EventList: [],
            chosenEvent: undefined
        }
    },
    watch: {
        chosenEventID() {
            this.chosenEvent = this.EventList.find(ev => ev.id === this.chosenEventID)
            if (!this.chosenEvent) return
            notUserEdit = true
            this.chosenEvent.brief = this.chosenEvent.brief ?? null
            this.chosenEvent.description = this.chosenEvent.description ?? null
            this.chosenEvent.importance = this.chosenEvent.importance ?? {}
            this.chosenEvent.importance.important = this.chosenEvent.importance.important ?? false
            this.chosenEvent.importance.urgent = this.chosenEvent.importance.urgent ?? false
            this.chosenEvent.time = this.chosenEvent.time ?? {}
            this.chosenEvent.time.beginTime = this.chosenEvent.time.beginTime ?? {}
            this.chosenEvent.time.beginTime.date = this.chosenEvent.time.beginTime.date ?? null
            this.chosenEvent.time.beginTime.time = this.chosenEvent.time.beginTime.time ?? null
            this.chosenEvent.time.endTime = this.chosenEvent.time.endTime ?? {}
            this.chosenEvent.time.endTime.date = this.chosenEvent.time.endTime.date ?? null
            this.chosenEvent.time.endTime.time = this.chosenEvent.time.endTime.time ?? null
        },
        eventGrouped(current, former) {
            let currentGroups = current.map(group => group.groupName)
            let formerGroups = former.map(group => group.groupName)
            this.openedGroups = this.openedGroups.concat(currentGroups.filter(group => !formerGroups.includes(group)))
            let groupsWithNewEvent = []
            for (let groupNow of current) {
                let groupFormer = former.find(group => group.groupName === groupNow.groupName)
                if (!groupFormer) continue
                let newEvents = groupNow.events.filter(ev => !groupFormer.events.map(ev => ev.id).includes(ev.id))
                if (newEvents.length === 0) continue
                groupsWithNewEvent.push(groupNow.groupName)
            }
            this.openedGroups = this.openedGroups.concat(groupsWithNewEvent)
        },
        openedGroups(current, former) {
            let closedGroups = former.filter(group => !current.includes(group))
            if (this.eventGrouped
                .filter(group => closedGroups.includes(group.groupName))
                .find(group => group.events.find(ev => ev.id === this.chosenEventID))) {
                // 刚刚被折叠的分组中，包含当前正在查看的事件
                this.chosenEventID = undefined
            }
        },
        'chosenEvent.time.beginTime.date': function () {
            if (!this.chosenEvent) return
            if (!this.chosenEvent.time.beginTime.date) {
                notUserEdit = true
                this.chosenEvent.time.beginTime = {}
            }
        },
        'chosenEvent.time.endTime.date': function () {
            if (!this.chosenEvent) return
            if (!this.chosenEvent.time.endTime.date) {
                notUserEdit = true
                this.chosenEvent.time.endTime = {}
            }
        },
        chosenEvent: {
            handler(newEvent, formerEvent) {
                if (notUserEdit) {
                    notUserEdit = false
                    return
                } else if (!newEvent) {
                    this.updateEvent(formerEvent, true)
                    return
                }
                if (!formerEvent) return
                if (newEvent) this.updateEvent(newEvent)
            },
            deep: true,
        },
    },
    methods: {
        async CreateEventFromBrief() {
            let GetUniqueUUID = () => {
                let id = uuid()
                while (this.EventList.map(event => event.id).includes(id)) {
                    id = uuid()
                }
                return id
            }
            let newEvent = {
                id: GetUniqueUUID(),
                brief: this.newEventBriefInput ?? '',
                description: '',
                finished: false,
                importance: {
                    important: false,
                    urgent: false,
                },
                time: undefined
            }
            this.newEventBriefInput = ''

            // 先同步到后端

            // eslint-disable-next-line no-constant-condition
            while (true) {
                try {
                    await axios.post('/api/event/create', {
                        token: localStorage.getItem('token'),
                        event: newEvent,
                    })
                    break
                } catch (err) {
                    if (err.response.data.msg === 'duplicate_id') {
                        newEvent.id = GetUniqueUUID()
                        continue
                    }
                    else if (err.response.data.msg === 'invalid_token') {
                        this.$router.replace('/welcome')
                        localStorage.removeItem('token')
                        ElMessage({
                            message: '登录信息无效',
                            type: 'error',
                            grouping: true
                        })
                    } else {
                        ElMessage({
                            message: '保存失败',
                            type: 'error',
                            grouping: true
                        })
                    }

                    return
                }
            }

            this.EventList.push(newEvent)
            this.chosenEventID = newEvent.id
        },
        async updateEvent(eventToUpdate, immediate) {
            // 在用户频繁修改事件时，延迟一段时间再同步数据

            loopRequestID++
            loopRequestID %= maxLoopRequestID
            if (loopRequestID < 0) loopRequestID += maxLoopRequestID
            if (!immediate) {
                let currentID = loopRequestID
                await new Promise(r => setTimeout(r, updateDelay)) // sleep
                if (currentID !== loopRequestID) return
            }
            try {
                await axios.post('/api/event/update', {
                    token: localStorage.getItem('token'),
                    event: eventToUpdate,
                })
            } catch (err) {
                if (err.response.data.msg === 'invalid_token') {
                    this.$router.replace('/welcome')
                    localStorage.removeItem('token')
                    ElMessage({
                        message: '登录信息无效',
                        type: 'error',
                        grouping: true
                    })
                } else {
                    ElMessage({
                        message: '保存失败',
                        type: 'error',
                        grouping: true
                    })
                }
                return
            }
            ElMessage({
                message: '已保存',
                type: 'success',
                grouping: true
            })
        },
        async deleteEvent(eventToDelete) {
            try {
                await axios.post('/api/event/delete', {
                    token: localStorage.getItem('token'),
                    id: eventToDelete.id,
                })
            } catch (err) {
                if (err.response.data.msg === 'invalid_token') {
                    this.$router.replace('/welcome')
                    localStorage.removeItem('token')
                    ElMessage({
                        message: '登录信息无效',
                        type: 'error',
                        grouping: true
                    })
                } else {
                    ElMessage({
                        message: '保存失败',
                        type: 'error',
                        grouping: true
                    })
                }
                return
            }
            this.EventList = this.EventList.filter(ev => ev.id != eventToDelete.id)
            this.chosenEventID = undefined
            notUserEdit = true
            ElMessage({
                message: '已保存',
                type: 'success',
                grouping: true
            })
        }
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
        beginTimeTag() {
            return CheckDateTime(this.chosenEvent.time.endTime) ? '开始' : ''
        },
        beginTimeType() {
            try {
                return this.chosenEvent.time.beginTime.time ? '时间' : '日期'
            } catch (err) {
                return '日期'
            }
        },
        endTimeType() {
            try {
                return this.chosenEvent.time.endTime.time ? '时间' : '日期'
            } catch (err) {
                return '日期'
            }
        },
    },
    created() {
        this.openedGroups = this.eventGrouped.map(group => group.groupName) // 默认展开所有事件组
    },
    async mounted() {
        let response
        try {
            response = await axios.post('/api/event/getAll', {
                token: localStorage.getItem('token'),
            })
        } catch (err) {
            if (err.response.data.msg === 'invalid_token') {
                this.$router.replace('/welcome')
                localStorage.removeItem('token')
                ElMessage({
                    message: '登录信息无效',
                    type: 'error',
                    grouping: true
                })
            } else {
                ElMessage({
                    message: '保存失败',
                    type: 'error',
                    grouping: true
                })
            }

            return
        }

        this.EventList = response.data
    }
}
</script>
  
<style scoped>
.todolsit-main-additem {
    padding: auto;
}

.todolist-main {
    flex: 1 0 35%;
    padding: 20px;
}

.todolist-detail-right-background {
    flex: 1 0 35%;
}

.todolist-filter {
    flex: 1 0 10%;
    padding: 0;
    overflow-y: hidden;
}

.todolist-top-headline {
    font-weight: bold;
    margin: 0;
}

.todolist-top-itemadder-input {
    height: 40px;
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
}

.todolist-list-item-title {
    flex: 1 0 auto;
    margin: 0px;
    overflow: hidden;
}

.todolist-list-item-title.empty {
    color: var(--el-color-info)
}

#todolist-detail-right-itemname {
    font-weight: bolder;
}

#todolist-detail-right-time {
    padding-top: 10px;
    font-size: 13px;
    font-weight: bold;
    display: inline-block;
    white-space: nowrap;
    color: #7a7af9;
}

#todolist-detail-right-priority {
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

.todolist-detail {
    background: white;
    width: 100%;
    height: 100%;
    padding: 0;
    overflow: hidden;
}

.todolist-item.chosen {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
}

.todolist-detail-container {
    padding: 15px;
}

#todolist-detail-brief {
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 2px;
    border-color: var(--el-color-info-light-7);
    outline: none;
    font-size: xx-large;
    font-weight: bold;
    padding: 5px;
    box-sizing: border-box;
    color: var(--el-text-color-regular);
}

#todolist-detail-brief:focus {
    border-bottom-width: 3px;
    padding-bottom: 4px;
    border-color: var(--el-color-info);
    color: var(--el-text-color-primary);
}

.todolist-detail-description {
    border: none;
    outline: none;
    font-size: large;
    font-family: "微软雅黑";
    box-sizing: border-box;
    resize: none;
    border-radius: var(--el-border-radius-base);
    padding: 20px;
    color: var(--el-text-color-regular);
    transition: var(--el-transition-duration-fast);
}

.todolist-detail-description:focus {
    color: var(--el-text-color-primary);
    background-color: #f5f5f584;
}

.todolist-detail-description:hover {
    background-color: #f5f5f584;
}
</style>
  