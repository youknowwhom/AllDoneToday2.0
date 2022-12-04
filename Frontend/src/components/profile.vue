<template>
    <el-container class="profile-background"> 
        <div class="profile-header">
            <h2 class="header-title">个人设置</h2>
            <el-button class="header-button" @click="(modify = !modify)" :disabled="filter=='safety-setting'" :type="modify?'primary':'basic'">
                <p v-if="modify==true">保存设置</p>
                <p v-else>修改信息</p>
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
                    <el-col :span="12">
                        <p v-if="!modify"> {{signature}} </p>
                        <el-input v-else v-model="signature" placeholder="在此输入你的个性签名"></el-input>
                    </el-col>                  
                </div>
                <div class="info-item">
                    <el-col :span="6"><p class="info-item-title"> 性别 </p></el-col>
                    <el-col :span="12">
                        <p v-if="!modify"> {{gender}} </p>
                        <el-select v-else v-model="gender" placeholder="在此选择性别">
                            <el-option
                            v-for="item in ['男', '女']"
                            :key="item"
                            :value="item">
                            </el-option>
                        </el-select>
                    </el-col>                    
                </div>
                <div class="info-item">
                    <el-col :span="6"><p class="info-item-title"> 生日 </p></el-col>
                    <el-col :span="12">
                        <p v-if="!modify"> {{getBirthday}} </p>
                        <el-date-picker v-else
                            v-model="birthday"
                            type="date"
                            placeholder="在此选择生日">
                        </el-date-picker>
                    </el-col>                       
                </div>
                <div class="info-item">
                    <el-col :span="6"><p class="info-item-title"> 邮箱 </p></el-col>
                    <el-col :span="12">
                        <p v-if="!modify"> {{email}} </p>
                        <el-tag v-else type="primary">请在安全设置中重置邮箱</el-tag>
                    </el-col>                
                </div>
            </el-main>
            <el-main v-else-if="filter=='safety-setting'" class="profile-main">
                <div class="avatar-username">
                    <el-avatar :size="50"> {{username}} </el-avatar>
                    <h2> {{username}} </h2>
                </div>
                <div class="info-item">
                    <el-col :span="6"><p class="info-item-title"> 邮箱 </p></el-col>
                    <el-col :span="12">
                        <p> {{email}} </p>
                    </el-col>       
                </div>
                <div class="info-item">
                    <el-col :span="6"><p class="info-item-title"> 密码 </p></el-col>
                    <el-col :span="12">
                        <p>已设置</p>
                    </el-col>
                    <el-col :span="6">
                    <el-button :type="primary" @click="this.$router.push('/resetPassword')">修改</el-button>     
                    </el-col>      
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
            //是否是修改模式
            modify: false,
            username: '',
            gender: '',
            birthday: new Date(2000,0,1),
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
        if(response.data['UserName'])
            this.username = response.data['UserName'];
        if(response.data['EmailAddress'])
            this.email = response.data['EmailAddress'];
        if(response.data['UserGender'])
            this.gender = response.data['UserGender'];
        if(response.data['Signature'])
            this.signature = response.data['Signature'];
        
    },
    methods: {

    },
    computed: {
        getBirthday(){
            return this.birthday.getFullYear() + '年' + (this.birthday.getMonth() + 1) + '月' + this.birthday.getDate() + '日';
        }
    }
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
    margin-bottom: 15px;
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
    background-image: url("../assets/image/icon-bg.png");
    background-position: 90% 90%;
    background-size: 40%;
    background-repeat: no-repeat;
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