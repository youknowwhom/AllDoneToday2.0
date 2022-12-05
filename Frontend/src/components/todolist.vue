<template>

    <div class="ToDoList-container">
        <div class="todolist-filter">
            <el-scrollbar>
                <el-space direction="vertical" :fill="true" style="padding: 20px;">
                    <template v-for="group in this.DisplayFilters">
                        <p class="todolist-filter-index">{{ group.groupName }}</p>
                        <el-space direction="vertical" :fill="true">
                            <template v-for="filter in group.filters">
                                <el-check-tag class="todolist-filter-alternative-box"
                                    :checked="group.active === filter.name"
                                    :class="{enabled: group.active === filter.name}"
                                    @change="this.toggleDisplayFilter(group.groupName, filter.name)">
                                    <img :src="filter.icon" class="todolist-filter-icon" />
                                    <p class="todolist-filter-alternative-text">{{ filter.name }}</p>
                                </el-check-tag>
                            </template>
                        </el-space>
                    </template>
                    <el-divider />
                </el-space>
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
            <el-container direction="vertical" class="todolist-list">
                <el-scrollbar max-height="100%">
                    <el-collapse v-model="this.openedGroups" v-if="eventGrouped.length">
                        <template v-for="group in eventGrouped" :key="group.groupName">
                            <el-collapse-item :title="group.groupName" :name="group.groupName">
                                <el-space direction="vertical" alignment="flex-start" :fill="true" style="width: 100%;">
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
                    <el-empty v-else>
                        
                    </el-empty>
                </el-scrollbar>
            </el-container>
        </el-container>
        <el-divider direction="vertical" style="height: 100%" />
        <div class="todolist-detail-right-background">
            <el-container class="todolist-detail" v-if="this.chosenEventID" direction="vertical">
                <el-space class="todolist-detail-container" direction="vertical" :fill="true">
                    <input v-model="chosenEvent.brief" class="todolist-detail-brief" placeholder="添加事件简介……" />
                </el-space>
                <el-space class="todolist-detail-container" direction="horizontal">
                    <span style="font-weight: bold; margin: 0; width: 100px;">重要程度：</span>
                    <el-check-tag :checked="this.chosenEvent.importance.important"
                        style="width:100px; text-align: center; "
                        @change="status => this.chosenEvent.importance.important = status">
                        {{ this.chosenEvent.importance.important ? '重要' : '不重要' }}
                    </el-check-tag>
                    <el-check-tag :checked="this.chosenEvent.importance.urgent"
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
                    <textarea placeholder="添加详细信息……" v-model="this.chosenEvent.description"
                        class="todolist-detail-description"></textarea><!--TODO 将placeholder和文本对齐-->
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

    </div>

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

let DisplayFilters = [
    {
        groupName: '时间',
        active: '',
        filters: [
            {
                name: '全部',
                icon: '/assets/image/filter-all.png',
                filterFunction() {
                    return true
                }
            },
            {
                name: '往日',
                icon: '/assets/image/filter-past.png',
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
                name: '今日',
                icon: '/assets/image/filter-today.png',
                filterFunction(ev) {
                    if (!ev.time) return false
                    if (!CheckDateTime(ev.time.beginTime)) return false
                    return compareDate(ev.time.beginTime.date, new Date()) === 0
                }
            },
            {
                name: '最近七日',
                icon: '/assets/image/filter-recent7.png',
                filterFunction(ev) {
                    if (!ev.time) return false
                    if (!CheckDateTime(ev.time.beginTime)) return false
                    let evDate = new Date(ev.time.beginTime.date), next7day = (new Date()).setDate((new Date()).getDate() + 7)
                    return compareDate(new Date(), evDate) !== 1 && compareDate(evDate, next7day) === -1
                }
            },
        ]
    },
    {
        groupName: '四象限',
        active: '',
        filters: [
            {
                name: '重要 & 紧急',
                icon: '/assets/image/filter-one.png',
                filterFunction(ev) {
                    return ev.importance.important && ev.importance.urgent
                }
            },
            {
                name: '重要 & 不紧急',
                icon: '/assets/image/filter-two.png',
                filterFunction(ev) {
                    return ev.importance.important && !ev.importance.urgent
                }
            },
            {
                name: '紧急 & 不重要',
                icon: '/assets/image/filter-three.png',
                filterFunction(ev) {
                    return !ev.importance.important && ev.importance.urgent
                }
            },
            {
                name: '不重要 & 不紧急',
                icon: '/assets/image/filter-four.png',
                filterFunction(ev) {
                    return !ev.importance.important && !ev.importance.urgent
                }
            },
        ]
    },
]

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
            chosenEvent: undefined,
            DisplayFilters: DisplayFilters,
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
        },
        toggleDisplayFilter(groupName, filterName) {
            for (let group of this.DisplayFilters.filter(group => group.groupName === groupName)) {
                if (group.active === filterName) {
                    group.active = ''
                } else {
                    group.active = filterName
                }
            }
        }
    },
    computed: {
        eventGrouped() {
            let ungrouped = this.EventList
            for (let filterGroup of this.DisplayFilters) {
                for (let filter of filterGroup.filters.filter(filter => filter.name === filterGroup.active)) {
                    ungrouped = ungrouped.filter(filter.filterFunction)
                }
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
            console.debug(grouped.concat(grouped_reverse.reverse()))
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
.todolist-main {
    flex: 1 0 35%;
    padding: 20px;
}

.todolist-detail-right-background {
    flex: 1 1 35%;
    display: flex;
    width: 100%;
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
    flex: 0 0 auto;
}

.todolist-filter-icon {
    height: 30px;
    margin-left: 8px;
    margin-right: 5px;
    margin-top: 5px;
}


.todolist-filter-alternative-box {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    background-color: initial;
    transition: var(--el-transition-duration-fast);
    border: 0;
    padding: 0;
    border-radius: var(--el-border-radius-round);
}

.todolist-filter-alternative-box:hover {
    background-color: var(--el-color-info-light-9);
    box-shadow: var(--el-box-shadow-light);
}

.todolist-filter-alternative-box:active {
    background-color: var(--el-color-info-light-7);
}

.todolist-filter-alternative-box.enabled {
    background-color: var(--el-color-primary-light-9);
}

.todolist-filter-alternative-box.enabled:hover {
    background-color: var(--el-color-primary-light-7);
}

.todolist-filter-alternative-box.enabled:active {
    background-color: var(--el-color-primary-light-5);
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

.ToDoList-container {
    height: 100%;
    width: 100%;
    padding: 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
}

.todolist-list {
    height: 0;
    /* 这样写可以修复折叠菜单超出父元素高度的 BUG ，不知道为什么 */
}

.todolist-list-item-title {
    flex: 1 0 auto;
    margin: 0px;
    overflow: hidden;
}

.todolist-list-item-title.empty {
    color: var(--el-color-info)
}

.todolist-item.chosen {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
}

.todolist-detail {
    width: 100%;
    height: 100%;
    padding: 0;
    overflow: hidden;
}

.todolist-detail-container {
    padding: 15px;
}

.todolist-detail-brief {
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
    transition: var(--el-transition-duration-fast);
}

.todolist-detail-brief:focus {
    border-bottom-width: 3px;
    padding-bottom: 4px;
    border-color: var(--el-color-info);
    color: var(--el-text-color-primary);
}

.todolist-detail-description {
    border: none;
    outline: none;
    font-family: var(--el-font-family);
    font-size: large;
    box-sizing: border-box;
    resize: none;
    border-radius: var(--el-border-radius-base);
    padding: 20px;
    color: var(--el-text-color-regular);
    transition: var(--el-transition-duration-fast);
}

.todolist-detail-description::placeholder {
    font-size: large;
}

.todolist-detail-description:focus {
    color: var(--el-text-color-primary);
    background-color: var(--el-color-info-light-9);
}

.todolist-detail-description:hover {
    background-color: var(--el-color-info-light-9);
}
</style>
  