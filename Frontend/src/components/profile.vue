<template>
    <el-container class="profile-background"> 
        <div class="profile-header">
            <h2 class="header-title">个人设置</h2>
            <el-button class="header-button" type="primary">
                保存设置
            </el-button>
        </div>
        <div class="profile-container">
            <el-aside class = "profile-aside">
                <el-menu default-active="1" class="el-menu-vertical-demo profile-menu" >
                    <el-menu-item index="1" @click="filter='personal-info'" class="profile-menu-item">
                        <span slot="title">个人信息</span>
                    </el-menu-item>
                    <el-menu-item index="2" @click="filter='safety-setting'" class="profile-menu-item">
                        <span slot="title">安全设置</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main v-if="filter=='personal-info'" class="profile-main">
                <div class="avatar-username">
                    <el-avatar :size="50"> {{username}} </el-avatar>
                    <h2> {{username}} </h2>
                </div>
                <div class="info-item">
                    <el-col :span="6"><p class="info-item-title"> 个性签名 </p></el-col>
                    <el-col :span="12"><p> {{signature}} </p></el-col>                   
                </div>
                <div class="info-item">
                    <el-col :span="6"><p class="info-item-title"> 性别 </p></el-col>
                    <el-col :span="12"><p> {{gender}} </p></el-col>                   
                </div>
                <div class="info-item">
                    <el-col :span="6"><p class="info-item-title"> 生日 </p></el-col>
                    <el-col :span="12"><p> {{gender}} </p></el-col>                   
                </div>
                <div class="info-item">
                    <el-col :span="6"><p class="info-item-title"> 邮箱 </p></el-col>
                    <el-col :span="12"><p> {{email}} </p></el-col>                   
                </div>
                
            </el-main>
        </div>
        
    </el-container>
</template>
  
<script>

import axios from 'axios'

export default {
    name: 'Profile',
    data() {
        return {
            //"personal-info" 或 "safety-setting"
            filter : "personal-info",
            username: '今日毕',
            gender: '男',
            birthday:'',
            signature: 'All done today',
            email: 'alldonetoday@163.com'
        }
    },
    async created() {
        let response
        try {
            response = await axios.post('/api/user/getInfo', {
                token: localStorage.getItem('token')
            })
        } catch (err) {
            console.error(err)
            return
        }
        console.debug(response)
    },
    methods: {

    },
}
</script>

<style scoped>

.info-item{
    display: flex;
    width: 50%;
    align-items: center;
    justify-content: flex-start;
}

.info-item-title{
    font-weight: bold;
    color: #7a7af9;
}
.el-col{
    display: flex;
    justify-content: flex-start;
}
.el-avatar{
    margin-right: 15px;
}
.avatar-username{
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-start;
}
.profile-main{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding-left: 30px;
    padding-right: 30px;
    width : 100%;
    height: 100%;
    user-select: none;
}
.profile-menu-item{
    display: flex;
    margin: 0;
    align-items: center;
    justify-content: space-around;
    user-select: none;
}
.profile-menu{
    width: 100%;
    height: 95%;
}
.profile-aside{
    display: flex;
    align-items: center;
    border-radius: 10px;
    width: 20%;
    height: 100%;
}
.header-title {
    font-size: 30px;
    margin: 0;
    color: #7a7af9;
    user-select: none;
}

.header-button {
    height: 45px;
    width: 120px;
}

.profile-background {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #efefff;
    height: 100%;
    width: 100%;
}

.profile-header {
    width: 65%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.profile-container {
    display: flex;
    flex-direction: row;
    border-radius: 10px;
    height: 85%;
    width: 65%;
    background-color: white;
    box-shadow: 0px 0px 20px rgba(50, 50, 50, 0.043);
}
</style>