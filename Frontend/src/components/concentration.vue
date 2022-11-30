<template>

    <div class="Concentration-container">
        <el-container class = "CenterContainer" direction = "vertical">

            <el-progress type="circle" :percentage="getPercentage" color="var(--el-color-primary-light-3)" stroke-width="20"
                width="400">
                <img :src="displayPic" class="DemonPic" />
            </el-progress>

            <p class="TimeDisplay">{{demoPrompt}}</p>

            <el-slider v-if="curState == 'empty'" v-model="timeSpanSet"  show-stops :max="maxTime" :show-tooltip="false" :step="maxTime / 4" class="Slider" />

            <el-button type="primary" class = "Button" @click="buttonClick">{{buttonPrompt[curState]}}</el-button>
        
        </el-container>
    </div>

</template>
  
<script>

import lavender_dead from "../assets/image/lavender-dead.png"
import lavender_1 from "../assets/image/lavender-1.png"
import lavender_2 from "../assets/image/lavender-2.png"
import lavender_3 from "../assets/image/lavender-3.png"
import lavender_done from "../assets/image/lavender-done.png"
import screenfull from "screenfull"
import { ElMessageBox } from "element-plus"

export default {
    name: 'Concentration',
    data() {
        return {
            picture: {
                'dead' : lavender_dead,
                '1' : lavender_1,
                '2' : lavender_2,
                '3' : lavender_3,
                'done' : lavender_done,
            },
            buttonPrompt:{
                'empty' : '开始专注',
                'growing' : '放弃专注',
                'dead' : '再次尝试',
                'done' : '再接再厉'
            },
            //设置的专注时长
            timeSpanSet: 0,
            //当前的薰衣草状态 ["empty", "growing", "dead", "done"]
            curState: "empty",
            //开始时间
            startTime: undefined,
            //当前时间
            curTime: undefined,
            //目标时间
            goalTime: undefined,
            //剩余时间分钟数
            timeLeftMin: 0,
            //剩余时间秒数
            timeLeftSec: 0,
            //是否是全屏
            isFullScreen: false,
            //专注的最长时间
            maxTime:0.1
        }
    },
    methods: {
        buttonClick(){
            //开始专注
            if(this.curState == 'empty'){
                if(this.timeSpanSet == 0){
                    ElMessageBox.alert('请设置有效的专注时间!');
                    return;
                }
                screenfull.request();
                this.isFullScreen = true;
                //记录起始时间
                this.startTime = new Date();
                //设置目标时间
                this.goalTime = new Date(this.startTime.valueOf() + this.timeSpanSet * 60 * 1000);
                //设置初始值 避免时间跳动
                this.timeLeftMin = Math.floor(this.timeSpanSet);
                this.timeLeftSec = Math.round((this.timeSpanSet-Math.floor(this.timeSpanSet))*60);
                this.curState = 'growing';
            }
            else if(this.curState == 'growing'){
                this.curState = 'dead';
                this.isFullScreen = false;
                screenfull.exit();
            }
            else if(this.curState == 'dead'){
                this.curState = 'empty';
            }
            else if(this.curState == 'done'){
                this.curState = 'empty';
            }
        },
        //补数字前导0
        addZero(num){
            if(num >= 10)
                return String(num);
            else
                return '0' + String(num);
        },
    },
    computed: {
        //圆形进度条percentage
        getPercentage() {
            if(this.curState == 'growing')
                return (this.timeLeftMin*60 + this.timeLeftSec) / (this.timeSpanSet * 60) * 100;
            else
                return 100;
        },
        //选择展示图片
        displayPic(){
            if(this.curState == 'empty'){
                if(this.timeSpanSet == 0)
                    return lavender_1;
                else if(this.timeSpanSet <= this.maxTime * 0.5)
                    return lavender_2;
                else
                    return lavender_3;
            }
            else if(this.curState == 'dead')
                return lavender_dead;
            else if(this.curState == 'done')
                return lavender_done;
            else if(this.curState == 'growing'){
                var pass = this.timeSpanSet - (this.timeLeftMin*60 + this.timeLeftSec) / 60;
                if(pass <= this.maxTime * 0.25)
                    return lavender_1;
                else if(pass <= this.maxTime * 0.75)
                    return lavender_2;
                else
                    return lavender_3;
            }
        },
        demoPrompt(){
            if(this.curState == 'empty')
                return this.addZero(Math.floor(this.timeSpanSet)) + ':' + this.addZero(Math.round((this.timeSpanSet-Math.floor(this.timeSpanSet))*60));
            else if(this.curState == 'growing')
                return this.addZero(this.timeLeftMin) + ':' + this.addZero(this.timeLeftSec);
            else if(this.curState == 'dead')
                return "专注失败";
            else if(this.curState == 'done')
                return "专注成功";
        },
        checkDone(){
            if(this.curState == 'growing' && String(this.curTime) == String(this.goalTime))
                this.curState = 'done';
        }
    },
    created() {
        setInterval(() => {
            this.curTime = new Date();
            var timeLeft = Math.floor((this.goalTime - this.curTime)/1000);
            this.timeLeftMin = Math.floor(timeLeft / 60);
            this.timeLeftSec = timeLeft - this.timeLeftMin*60;
            this.checkDone();
        }, 1000)

        screenfull.on('change', ()=>{
            if(!screenfull.isFullscreen && this.isFullScreen && this.curState == 'growing'){
                this.curState = 'dead';
                this.isFullScreen = false;
                this.$message.error('由于您退出了全屏专注，薰衣草已经死亡');
            }
        })
    }
}
</script>
  
<style scoped>
.Concentration-container {
    display: flex;
    height: 100%;
    width: 100%;
    background-color: #e5e5ff;
    font-size: medium;
    user-select: none;
}

.CenterContainer{
    justify-content: center;
    align-items: center;
}
.Slider{
    width: 30%;
    margin-bottom: 20px;
}
.TimeDisplay{
    font-size: 100px;
    font-weight: bold;
    letter-spacing: 2px;
    color: #9a9afd;
    margin-top: 5px;
    margin-bottom: 5px;
}

.Button{
    height: 60px;
    width: 220px;
    font-size: 22px;
    letter-spacing: 5px;
    margin-top: 10px;
    border-radius: 30px;
}
.DemonPic {
    margin-top: 7px;
    height: 355px;
    width: 355px;
}
</style>
  