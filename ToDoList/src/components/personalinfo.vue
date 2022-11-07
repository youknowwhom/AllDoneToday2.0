<template>
    <div class="body">
        <div class="header">
            <img src="../assets/image/logo.png" class="logo" />
        </div>       
        <div class="box-left">
            <img src="../assets/image/photo.jpg" class="circle"/>
            <div v-if="IsBasicInfo" class="rectangle-1"> </div>
            <button v-if="IsBasicInfo" class="basic-click" @click="IsBasicInfo=true">基本信息</button>
            <button v-else class="basic" @click="IsBasicInfo=true">基本信息</button>
            <div v-if="!IsBasicInfo" class="rectangle-2"> </div>
            <button v-if="!IsBasicInfo" class="safety-click" @click="IsBasicInfo=false">安全信息</button>
            <button v-else class="safety" @click="IsBasicInfo=false">安全信息</button>
        </div>
        <div class="box-right">            
            <img src="../assets/image/photo.jpg" class="photo"/>
            <div v-text="UserName" class="username"></div>
            <img v-if="UserGender=='女'" src="../assets/image/female.png" class="gender" />
            <img v-else src="../assets/image/male.png" class="gender"/>
            <div v-if="IsBasicInfo">
                <button @click="IsBasicEditEnabled=true" class="edit-button">编辑个人信息</button>
                <div class="small-blank-1"></div>               
                <div class="username-input">用户名:    
                  <input :disabled="!IsBasicEditEnabled" v-model="UserNameTemp" class="input-border"/>
                </div>
                <div class="gender-input">性别:
                    <select v-model="UserGenderTemp" class="label-control" :disabled="!IsBasicEditEnabled">
                        <option selected>男</option>
                        <option >女</option>
                    </select>
                </div>
                <div class="signature-input">个性签名: 
                    <input :disabled="!IsBasicEditEnabled" v-model="SignatureTemp" class="input-border"/>
                </div>
                <div class="birthday-input">生日: 
                    <input type="date" :disabled="!IsBasicEditEnabled" v-model="BirthdayTemp" class="input-border"/>
                </div>
                <div class="major-input">专业: 
                    <input :disabled="!IsBasicEditEnabled" v-model="MajorTemp" class="input-border"/>
                </div>
                <div class="grade-input">年级: 
                    <input :disabled="!IsBasicEditEnabled" v-model="GradeTemp" class="input-border"/>
                </div>
                <button v-if="IsBasicEditEnabled" @click="BasicEnsure" class="ensure-button">确定</button>          
                <button v-if="IsBasicEditEnabled" @click="BasicCancel" class="cancel-button">取消</button>        
            </div>
            <div v-else>
                <div class="small-blank-2"></div>
                <button @click="IsSecureEditEnabled=true" class="edit-button">编辑安全信息</button>

            </div>
        </div>       
    </div>
</template>
  
<script>

export default {
    name: 'personalInfo',
    data() {
        return {
            selected:'C',
            token: 'haojin',
            IsBasicInfo: true,
            IsBasicEditEnabled: false,
            UserName: 'haojin',
            UserNameTemp: 'haojin',
            UserGender: '女',  
            UserGenderTemp: '女',  //做成下拉式
            Signature: 'haojinhaojin',
            SignatureTemp: 'haojinhaojin',
            Birthday: '2003-01-07',  
            BirthdayTemp:'2003-01-07',
            Major: 'Computer Science',
            MajorTemp: 'Computer Science',
            Grade: '大二',   
            GradeTemp: '大二',
            PhotoUrl: 'D:/ToDoList/ToDoList/src/assets/image/photo.jpg',

            IsSecureEditEnabled: false,
            EmailAddress: 'haojin@00.com',
            EmailAddressTemp: 'haojin@00.com',
            Password: 'haojinis00',
            PasswordTemp: 'haojinis00',
        }
    },
    methods: {
        BasicEnsure(){
            this.IsBasicEditEnabled=false
            this.UserName = this.UserNameTemp
            this.Birthday = this.BirthdayTemp
            this.UserGender = this.UserGenderTemp
            this.Signature = this.SignatureTemp
            this.Major = this.MajorTemp
            this.Grade = this.GradeTemp
        },
        BasicCancel(){
            this.IsBasicEnabled=false
            this,this.UserNameTemp=this.UserName
            this.BirthdayTemp=this.Birthday
            this.UserGenderTemp=this.UserGender
            this.SignatureTemp=this.Signature
            this.MajorTemp = this.Major
            this.GradeTemp = this.Grade
        }

    },
}
</script>
  
<style scoped>
.body {
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
    position:relative;
    left:-42%;
    margin-left: 20px;
    height: 50px;
}

.header {
    width: 100%;
    margin: 0;
    padding: 10px 0;
    background: #f6f6ff;
    box-shadow: 0px 0px 5px 5px #e9e9ff;
}

.box-left{
  position: relative;
  top: 8%;
  left:-30%;
  background: #f6f6ff;
  box-shadow: 0px 0px 5px 5px #e9e9ff;
  padding: 20px;
  width: 240px;
  height: 550px;
  margin: 0 auto;
}

.circle{
  width: 80px;
  height: 80px;
  border-radius: 100%;
}

.rectangle-1{
  position: relative;
  top: 10.3%;
  left: -8%;
  background:white;
  width: 290px;
  height: 40px;
}

.rectangle-2{
  position: relative;
  top:24.3%;
  left:-8%;
  background:white;
  width: 290px;
  height: 40px;
}

.basic{
  background:url("../assets/image/basic.png") no-repeat 0% 30%;
  background-size: 30px 30px;
  color: #bfbfbf;
  position: relative;
  top: 11%;
  left: 5%;
  font-size:medium;
  width: 180px;
  height: 40px;
  border: none;
}

.basic-click{
  background:url("../assets/image/basic-click.png") no-repeat 0% 30%;
  background-size: 30px 30px;
  color: #7a7af9;
  position: relative;
  top: 3.7%;
  left: 5%;
  font-size:medium;
  width: 180px;
  height: 40px;
  border: none;
}

.basic:hover{
    background:url("../assets/image/basic-click.png") no-repeat 0% 30%;
    background-size: 30px 30px;
    color: #7a7af9;
}

.safety{
    background:url("../assets/image/safety.png") no-repeat 0% 30%;
    background-size: 30px 30px;
    color: #bfbfbf;
    position: relative;
    top: 17%;
    left: 5%;
    font-size:medium;
    width: 180px;
    height: 40px;
    border: none;
}

.safety-click{
    background:url("../assets/image/safety-click.png") no-repeat 0% 30%;
    background-size: 30px 30px;
    color: #7a7af9;
    position: relative;
    top: 17%;
    left: 5%;
    font-size:medium;
    width: 180px;
    height: 40px;
    border: none;
}

.safety:hover{
    background:url("../assets/image/safety-click.png") no-repeat 0% 30%;
    background-size: 30px 30px;
    color: #7a7af9;
}

.box-right{
  position: relative;
  top: -66.8%;
  left: 9.5%;
  background: white;
  box-shadow: 0px 0px 5px 5px #e9e9ff;
  padding: 20px;
  width: 800px;
  height: 550px;
  margin: 0 auto;
}

.small-blank-1{
  position: fixed;
  top: 298px;
  left: 400px;
  width: 100px;
  height: 40px;
  background: white;
}

.small-blank-2{
  position: fixed;
  top: 415px;
  left: 400px;
  width: 100px;
  height: 40px;
  background: white;
}

.edit-button{
  position: fixed;
  top: 225px;
  left: 1100px;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: medium;
}

.photo{
  width: 120px;
  height: 120px;
  border-radius: 100%;
  position: fixed;
  top: 180px;
  left:530px;
}

.username{
  position:fixed;
  top: 220px;
  left: 760px;
  font-size:xx-large;
}

.gender{
  position:relative;
  top: 10%;
  left: -15%;
  width:50px;
  height:50px;
}
.input-border{
  font-size:large;
}

.input-border:disabled{
  background: white;
  border: none;
}

.username-input{
  font-size:large;
  position: fixed;
  top:330px;
  left:720px;
}
.gender-input{
  font-size:large;
  position: fixed;
  top:380px;
  left:720px;
}

.label-control{
  position: fixed;
  top: 385px;
  left: 775px;
}
.signature-input{
  font-size:large;
  position: fixed;
  top:430px;
  left:720px;
}

.birthday-input{
  font-size:large;
  position: fixed;
  top:480px;
  left:720px;
}

.major-input{
  font-size:large;
  position: fixed;
  top:530px;
  left:720px;
}

.grade-input{
  font-size:large;
  position: fixed;
  top:580px;
  left:720px;
}

.ensure-button{
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size:medium;
  position:fixed;
  top: 650px;
  left: 700px;
}

.cancel-button{
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size:medium;
  position:fixed;
  top: 650px;
  left:980px;
}
</style>
  