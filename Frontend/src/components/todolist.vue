<template>

    <div class="ToDoList-container">
        <div class="todolist-filter">
            <p class="todolist-filter-index"> 时间 </p>
            <div :class="ToDoList.Filter == 'all' ? 'todolist-filter-alternative-box-chosen' : 'todolist-filter-alternative-box'"
                @click="ToDoList.Filter = 'all'">
                <img src="../assets/image/filter-all.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 全部 </p>
            </div>
            <div :class="ToDoList.Filter == 'past' ? 'todolist-filter-alternative-box-chosen' : 'todolist-filter-alternative-box'"
                @click="ToDoList.Filter = 'past'">
                <img src="../assets/image/filter-past.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 往日 </p>
            </div>
            <div :class="ToDoList.Filter == 'today' ? 'todolist-filter-alternative-box-chosen' : 'todolist-filter-alternative-box'"
                @click="ToDoList.Filter = 'today'">
                <img src="../assets/image/filter-today.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 今日 </p>
            </div>
            <div :class="ToDoList.Filter == 'recent7' ? 'todolist-filter-alternative-box-chosen' : 'todolist-filter-alternative-box'"
                @click="ToDoList.Filter = 'recent7'">
                <img src="../assets/image/filter-recent7.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 最近七日 </p>
            </div>
            <hr class="todolist-filter-separater">
            <p class="todolist-filter-index"> 四象限 </p>
            <div :class="ToDoList.Filter == 'iu' ? 'todolist-filter-alternative-box-chosen' : 'todolist-filter-alternative-box'"
                @click="ToDoList.Filter = 'iu'">
                <img src="../assets/image/filter-one.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 重要 & 紧急 </p>
            </div>
            <div :class="ToDoList.Filter == 'i!u' ? 'todolist-filter-alternative-box-chosen' : 'todolist-filter-alternative-box'"
                @click="ToDoList.Filter = 'i!u'">
                <img src="../assets/image/filter-two.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 重要 & 不紧急 </p>
            </div>
            <div :class="ToDoList.Filter == 'u!i' ? 'todolist-filter-alternative-box-chosen' : 'todolist-filter-alternative-box'"
                @click="ToDoList.Filter = 'u!i'">
                <img src="../assets/image/filter-three.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 紧急 & 不重要 </p>
            </div>
            <div :class="ToDoList.Filter == '!i!u' ? 'todolist-filter-alternative-box-chosen' : 'todolist-filter-alternative-box'"
                @click="ToDoList.Filter = '!i!u'">
                <img src="../assets/image/filter-four.png" class="todolist-filter-icon" />
                <p class="todolist-filter-alternative-text"> 不重要 & 不紧急 </p>
            </div>
        </div>


        <div class="todolist-main">
            <p class="todolist-top-headline">日毕清单</p>

            <div class="todolist-top-itemadder">
                <input type="text" placeholder="在此处添加新的待办事项" class="todolist-top-itemadder-input" />
            </div>

            <div class="todolist-list">
                <div class="todolist-main-menu">
                    <p>未毕</p>
                    <div v-for="item in UndoneInfoList" class="todolist-main-item" :key="item.name"
                        @click="this.ToDoList.ItemDisplay = item">
                        <img src="../assets/image/item-unchosen.png" class="todolist-main-item-icon"
                            @click="item.isDone = true" />
                        {{ item.name }}
                    </div>
                </div>
                <div class="todolist-main-menu">
                    <p>待毕</p>
                    <div v-for="item in TobedoneInfoList" class="todolist-main-item" :key="item.name"
                        @click="this.ToDoList.ItemDisplay = item">
                        <img src="../assets/image/item-unchosen.png" class="todolist-main-item-icon"
                            @click="item.isDone = true" />
                        {{ item.name }}
                    </div>
                </div>
                <div class="todolist-main-menu">
                    <p>已毕</p>
                    <div v-for="item in DoneInfoList" class="todolist-main-item" style="color: gainsboro;"
                    @click="this.ToDoList.ItemDisplay = item" :key="item.name">
                        <img src="../assets/image/item-chosen.png" class="todolist-main-item-icon"
                            @click="item.isDone = false" />
                        {{ item.name }}
                    </div>
                </div>
            </div>
        </div>
        <div class="todolist-detail-right">
            <div v-if="ToDoList.ItemDisplay != undefined">
                <div class="todolist-detail-right-itemname">
                    {{ ToDoList.ItemDisplay.name }}
                </div>
                <div v-if="GetDeltaDate(ToDoList.ItemDisplay) >= -2 && GetDeltaDate(ToDoList.ItemDisplay) <= 2"
                    class="todolist-detail-right-time">
                    {{ ADJACENT_DAY_NAME[GetDeltaDate(ToDoList.ItemDisplay)] }}
                </div>
                <div v-else-if="GetDeltaWeek(ToDoList.ItemDisplay) >= -1 && GetDeltaWeek(ToDoList.ItemDisplay) <= 1"
                    class="todolist-detail-right-time">
                    {{ WEEK_RELATION[GetDeltaWeek(ToDoList.ItemDisplay)] }}{{
                            WEEK_DAY_NAME[ToDoList.ItemDisplay.time.getDay()]
                    }}
                </div>
                <div v-else class="todolist-detail-right-time">
                    {{ ToDoList.ItemDisplay.time.getMonth() + 1 }} 月 {{ ToDoList.ItemDisplay.time.getDate() }} 日
                </div>

                <div v-if="ToDoList.ItemDisplay.isDetailedTimeSet" class="todolist-detail-right-time">
                    &nbsp;&nbsp;{{ GetTimeString(ToDoList.ItemDisplay) }}
                </div>

                <div class="todolist-detail-right-priority">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ PRIORITY[ToDoList.ItemDisplay.priority] }}
                </div>
            </div>

        </div>

    </div>

</template>
  
<script>

const AdjacentDayName = { '-2': '前日', '-1': '昨日', '0': '今日', '1': '明日', '2': '后日' }
const WeekRelation = { '-1': '上周', '0': '周', '1': '下周' }
const WeekDayName = ['日', '一', '二', '三', '四', '五', '六']
const Priority = { 'iu': '重要&紧急', 'i!u': '重要&不紧急', 'u!i': '紧急&不重要', '!i!u': '不重要&不紧急' }

export default {
    name: 'ToDoList',
    data() {
        return {
            //ToDoList清单模式内的变量
            ToDoList: {
                /* 左侧选择器选择的内容
                   时间 : ["all", "past", "today", "recent7"]
                   四象限 : ["iu", "i!u", "u!i", "!i!u"] (i = important, u = urgent)
                */
                Filter: 'all',
                //当前展示的所有清单信息
                NewItem: undefined,
                ItemDisplay: undefined,
                InfoList: [
                    //调试用
                    {
                        name: '记得过生日',
                        time: new Date(2022, 5, 4),
                        isDetailedTimeSet: false,
                        priority: '!i!u',
                        detail: '今天是我的生日',
                        isDone: false,
                    },
                    {
                        name: '计算机科学导论课后作业',
                        time: new Date(2022, 11, 5, 12, 0, 0),
                        isDetailedTimeSet: true,
                        priority: 'iu',
                        detail: '第三章',
                        isDone: true,
                    }
                ],
            }
        }
    },
    methods: {
        InputProcess: function () {
            if (this.ToDoList.InputBox.indexOf('今天') != -1) {
                this.ToDoList.InputBox = this.ToDoList.InputBox.replace('今天', '')
            }
            console.info(this.ToDoList.InputBox, this.ToDoList.InputBox.indexOf('今天'))
        },
        //判断是否符合过滤条件
        IsInFilter: function (item) {
            const per_day_sec = 86400000
            var currentTime = new Date()
            var currentDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate())
            var setDate = new Date(item.time.getFullYear(), item.time.getMonth(), item.time.getDate())
            var difDate = (setDate - currentDate) / per_day_sec
            if (this.ToDoList.Filter == 'all')
                return true
            else if (this.ToDoList.Filter == 'past')
                return difDate < 0
            else if (this.ToDoList.Filter == 'today')
                return difDate == 0
            else if (this.ToDoList.Filter == 'recent7')
                return difDate >= 0 && difDate < 7
            else
                return this.ToDoList.Filter == item.priority
        },
        //返回和当前系统日期差
        GetDeltaDate: function (item) {
            const per_day_sec = 86400000
            var currentTime = new Date()
            var currentDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate())
            var setDate = new Date(item.time.getFullYear(), item.time.getMonth(), item.time.getDate())
            var difDate = (setDate - currentDate) / per_day_sec
            return difDate
        },
        //返回和当前系统星期差
        GetDeltaWeek: function (item) {
            const per_week_sec = 86400000 * 7
            var currentTime = new Date()
            //统一到周一来计算 二者差距几周
            var currentDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() - currentTime.getDay() + (currentTime.getDay() == 0 ? (-6) : (+1)))
            var setDate = new Date(item.time.getFullYear(), item.time.getMonth(), item.time.getDate() - item.time.getDay() + (item.time.getDay() == 0 ? (-6) : (+1)))
            var difWeek = (setDate - currentDate) / per_week_sec
            console.info(item.name, difWeek)
            return difWeek
        },
        //获取字符串的xx:xx时间
        GetTimeString: function (item) {
            var str = ''
            str += item.time.getHours()
            str += ' : '
            if (item.time.getMinutes() < 10)
                str += '0'
            str += item.time.getMinutes()
            return str
        }

    },
    computed: {
        UndoneInfoList: function () {
            return this.ToDoList.InfoList.filter(function (item) {
                var currentTime = new Date()
                return !item.isDone && (item.time < currentTime.getTime())
            })
        },

        TobedoneInfoList: function () {
            return this.ToDoList.InfoList.filter(function (item) {
                var currentTime = new Date()
                return !item.isDone && (item.time > currentTime.getTime())
            })
        },

        DoneInfoList: function () {
            return this.ToDoList.InfoList.filter(function (item) {
                return item.isDone
            })
        }
    },

    //设置常量
    created() {
        this.ADJACENT_DAY_NAME = AdjacentDayName
        this.WEEK_RELATION = WeekRelation
        this.WEEK_DAY_NAME = WeekDayName
        this.PRIORITY = Priority
    },
}
</script>
  
<style scoped>
.todolist-main {
    flex: 0 0 30%;
    padding-left: 20px;
    padding-right: 20px;
}

.todolist-detail-right {
    flex: 1 1 auto;
    padding-top: 10px;
    padding-left: 13px;
    padding-right: 13px;
    background: #e2e2fe;
}

.todolist-filter {
    flex: 0 0 10%;
    padding-top: 10px;
    background: #fefeff;
    border-right: #7a7afa4d solid 1px;
}

.todolist-main-item-icon {
    margin-top: 13.5px;
    margin-right: 10px;
    float: left;
    margin-bottom: 0;
    height: 15px;
    cursor: pointer;
}

.todolist-main-menu {
    font-weight: bold;
    padding-top: 5px;
    padding-bottom: 5px;
}

.todolist-main-item {
    height: 40px;
    line-height: 40px;
    font-weight: 200;
    text-align: left;
    padding-left: 10px;
    border-bottom: #7a7af922 1px solid;
    cursor: default;
}

.todolist-main-item:hover {
    background-color: #efeffb6e;
}

.todolist-top-headline {
    padding-top: 3px;
    padding-bottom: 15px;
    padding-bottom: 12px;
    font-weight: bold;
    margin: 0;
}

.todolist-top-itemadder-input {
    height: 40px;
    border: none;
    outline: none;
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 5px;
    width: 100%;
    caret-color: #7a7af9;
    background-color: #f6f6ff;
}

.todolist-top-itemadder {
    width: calc(100% - 30px);
    padding-top: 15px;
    height: 100px;
    background-color: #ffffff;
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

.todolist-filter-alternative-box-chosen {
    padding-left: 10px;
    padding-right: 10px;
    height: 40px;
    margin-top: 5px;
    margin-bottom: 5px;
    line-height: 40px;
    border-radius: 25px;
    cursor: pointer;
    background-color: #f2f2ff;
    background-clip: content-box;
    display: flex;
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
</style>
  