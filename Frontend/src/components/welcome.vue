<script>

import todolist_demo1 from "/assets/image/todolist-demopic1.png"
import todolist_demo2 from "/assets/image/todolist-demopic2.png"
import concentration_demo1 from "/assets/image/concentration-demopic1.png"
import concentration_demo2 from "/assets/image/concentration-demopic2.png"

export default {
    name: 'Welcome',
    data() {
        return {
            todolistDemo: [
                {
                    'pic': todolist_demo1,
                    'headline': "待办清单一目了然",
                    'prompt1': '待办事项程依次罗列，按照时间顺序分组。',
                    'prompt2': '无论是工作计划还是备忘提醒，你都能在今日毕中便捷记录并有序规划。'
                },
                {
                    'pic': todolist_demo2,
                    'headline': "日程设置轻而易举",
                    'prompt1': '轻松选择日程起止时间，设置日程重要紧急程度。',
                    'prompt2': '添加日程详细信息，不遗漏任何要点。'
                },
            ],
            concentrationDemo: [
                {
                    'pic': concentration_demo1,
                    'headline': "高效学习，心无旁骛",
                    'prompt1': '蓬勃生长的薰衣草助力你提高专注力。',
                    'prompt2': '快速设置专注时间，进入高效模式。'
                },
                {
                    'pic': concentration_demo2,
                    'headline': "专注本就如此简单",
                    'prompt1': '专注期间全程保持全屏，阻隔其它纷扰。',
                    'prompt2': '坚持下去，薰衣草花开之时即是胜利。'
                },
            ]
        }
    },
    async created() {

    }
}

</script>

<template>
    <el-container class="welcome-content">
        <el-container class="intro-div">
            <el-container class="text-div">
                <el-container direction="vertical">
                    <h2 class="welcome-intro-headline">今日事，</h2>
                    <h2 class="welcome-intro-headline">今日毕。</h2>
                </el-container>
                <el-container direction="vertical" class="maintext">
                    <p class="welcome-text">在今日毕，你能够一站式管理待办清单，让日程井井有条。</p>
                    <p class="welcome-text">快速安排日程，专注管理时间，从即刻开始。</p>
                </el-container>
                <el-container>
                    <el-button type="primary" @click="this.$router.push('/signup')">注册新用户</el-button>
                    <el-button @click="this.$router.push('/signin')">进入今日毕 </el-button>
                </el-container>
            </el-container>
            <img src="/assets/image/homepage-demonstration.jpg" class="demon-pic" />
        </el-container>

        <el-container class="function-div">
            <el-carousel :interval="4000" height="760px">
                <el-carousel-item v-for="item in todolistDemo" :key="item" class="item">
                    <img :src="item['pic']" class="demon-pic2" />
                    <div>
                        <el-container class="text-div">
                            <el-container direction="vertical">
                                <h2 class="welcome-function-headline">{{ item['headline'] }}</h2>
                            </el-container>
                            <el-container direction="vertical" class="maintext">
                                <p class="welcome-text">{{ item['prompt1'] }}</p>
                                <p class="welcome-text">{{ item['prompt2'] }}</p>
                            </el-container>
                        </el-container>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </el-container>

        <el-container class="function-div2">
            <el-carousel :interval="4000" height="760px">
                <el-carousel-item v-for="item in concentrationDemo" :key="item" class="item2">
                    <div>
                        <el-container class="text-div">
                            <el-container direction="vertical">
                                <h2 class="welcome-function-headline">{{ item['headline'] }}</h2>
                            </el-container>
                            <el-container direction="vertical" class="maintext">
                                <p class="welcome-text">{{ item['prompt1'] }}</p>
                                <p class="welcome-text">{{ item['prompt2'] }}</p>
                            </el-container>
                        </el-container>
                    </div>
                    <img :src="item['pic']" class="demon-pic2" />
                </el-carousel-item>
            </el-carousel>
        </el-container>

        <el-footer class="bottom-div">
            <el-container class="text-div-bottom" direction="vertical">
                <el-container direction="vertical">
                    <h2 class="welcome-function-headline">今日毕贡献者</h2>
                </el-container>
                <el-container direction="vertical" class="maintext">
                    <p class="welcome-text"><span class="bottom-text-bold">蔡一锴</span> 环境搭建 后端 清单模式 个人信息界面 </p>
                    <p class="welcome-text"><span class="bottom-text-bold">郭桉齐</span> 注册界面 个人信息界面 </p>
                    <p class="welcome-text"><span class="bottom-text-bold">王颢瑾</span> 登录界面 后端 邮箱验证码 </p>
                    <p class="welcome-text"><span class="bottom-text-bold">郑博远</span> UI设计 专注模式 清单模式 欢迎页 </p>
                    <div>
                        <el-link href="https://github.com/VVsxmja/ToDoList" type="primary" class="welcome-link" :underline="false">
                            <el-icon size="35" style="margin: 5px;">
                                <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="1.2em"
                                    height="1.2em" data-v-6c8d2bba="">
                                    <path fill="currentColor"
                                        d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z">
                                    </path>
                                </svg>
                            </el-icon>
                            &nbsp;
                            <p>在 GitHub 上查看源代码</p>
                        </el-link>
                    </div>
                </el-container>
            </el-container>
        </el-footer>
    </el-container>
</template>


<style scoped>
.bottom-text-bold {
    font-weight: bold;
    color: #7a7af9;
    margin-right: 10px;
}

.el-carousel {
    width: 100%;
    max-width: 1280px;
    background-color: #efefff;
}

.item {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #efefff;
}

.item2 {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #ffffff;
}

.welcome-content {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: rgb(255, 255, 255);
    overflow-x: hidden;
}

.intro-div {
    display: flex;
    align-items: center;
    min-height: 760px;
    width: 90%;
    max-width: 1280px;
    background-color: rgb(255, 255, 255);
}

.function-div {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 760px;
    width: 100%;
    background-color: #efefff;
    user-select: none;
}

.function-div2 {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 760px;
    width: 100%;
    background-color: #ffffff;
}

.bottom-div {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 360px;
    width: 100%;
    margin-bottom: 10px;
    background-color: #efefff;
}

.text-div {
    display: flex-start;
    flex-direction: column;
}

.text-div-bottom {
    width: 100%;
    max-width: 1280px;
    display: flex-start;
    flex-direction: column;
    margin-top: 100px;
}

.welcome-intro-headline {
    color: #7a7af9;
    font-size: 60px;
    margin: 0px;
    text-align: left;
}

.welcome-function-headline {
    color: #7a7af9;
    font-size: 40px;
    margin: 0px;
    text-align: left;
}

.maintext {
    margin-top: 20px;
    font-size: 17px;
    color: #7f7f88;
    margin-bottom: 70px;
}

.welcome-text {
    margin: 3px;
    text-align: left;
}

.demon-pic {
    height: 90%;
    margin-right: -80px;
    user-select: none;
}

.demon-pic2 {
    height: 70%;
    box-shadow: 0px 0px 20px rgba(50, 50, 50, 0.169);
    user-select: none;
}

.el-button {
    height: 50px;
    width: 200px;
    border-radius: 6px;
    font-size: 20px;
    font-weight: bold;
    margin-right: 20px;
}

.welcome-link {
    margin-top: 30px;
}
</style>
  