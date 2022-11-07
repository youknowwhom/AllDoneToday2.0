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
            <div class="right-top">            
              <img src="../assets/image/photo.jpg" class="photo"/>
              <div class="nameandsex">
                <div class="username">{{UserName}}
                  <img v-if="UserGender=='女'" src="../assets/image/female.png" class="gender" />
                  <img v-else src="../assets/image/male.png" class="gender"/>
                </div>
              </div>               
              <input :disabled="!IsBasicEditEnabled" v-model="SignatureTemp" class="signature-input"/>              
            </div>
            <div v-if="IsBasicInfo" class="right-bottom">                                        
                <div class="username-input">用户名:    
                  <input :disabled="!IsBasicEditEnabled" v-model="UserNameTemp" class="input-border"/>
                </div>
                <div class="gender-input">性别:
                  <div v-if="!IsBasicEditEnabled" class="input-border">{{UserGenderTemp}}</div>
                  <select v-if="IsBasicEditEnabled" v-model="UserGenderTemp" class="input-border" :disabled="!IsBasicEditEnabled">
                      <option selected>男</option>
                      <option >女</option>
                  </select>
                    
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
                <button @click="IsBasicEditEnabled=true" class="edit-button">编辑个人信息</button>    
                <button v-if="IsBasicEditEnabled" @click="BasicEnsure" class="ensure-button">确定</button>          
                <button v-if="IsBasicEditEnabled" @click="BasicCancel" class="cancel-button">取消</button>        
            </div>
            <div v-else class="right-bottom">                
                <div class="email-input">邮箱:    
                  <input :disabled="!IsSecureEditEnabled" v-model="EmailAddressTemp" class="input-border"/>
                </div>
                <div class="password-input">用户名:    
                  <input :disabled="!IsSecureEditEnabled" v-model="PasswordTemp" class="input-border"/>
                </div>
                <button @click="IsSecureEditEnabled=true" class="edit-button">编辑安全信息</button>
                <button v-if="IsSecureEditEnabled" @click="SecureEnsure" class="ensure-button">确定</button>          
                <button v-if="IsSecureEditEnabled" @click="SecureCancel" class="cancel-button">取消</button> 
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
    created(){
        let url = 'http://127.0.0.1:8000/api/personalinfo'
        let infoRequest = new XMLHttpRequest
        infoRequest.open('GET',url)
        infoRequest.onload = () =>{
            this.UserName = infoRequest.response
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
            this.IsBasicEditEnabled=false
            this,this.UserNameTemp=this.UserName
            this.BirthdayTemp=this.Birthday
            this.UserGenderTemp=this.UserGender
            this.SignatureTemp=this.Signature
            this.MajorTemp = this.Major
            this.GradeTemp = this.Grade
        },
        SecureEnsure(){
            this.IsSecureEditEnabled=false
            this.Password=this.PasswordTemp
            this.EmailAddress=this.EmailAddressTemp
        },
        SecureCancel(){
            this.IsSecureEditEnabled=false
            this.PasswordTemp=this.Password
            this.EmailAddressTemp=this.EmailAddress
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

.right-top{
  position: relative;
  top:0%;
  left:5%;
  width: 800px;
  height:50px;
}

.edit-button{  
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: medium;
  position: relative;
  top: 70%;
  left: 80%;
}

.photo{
  float: left;
  width: 120px;
  height: 120px;
  border-radius: 100%; 
}

.nameandsex{
  position: relative;
  top: 50%;
  left: 5%;
}

.signature-input{
  position: relative;
  top:200%;
  left:-18%;
  font-size:large; 
}

.signature-input:disabled{
  background: white;
  border: none;
}
.username{
  position:fixed;
  top: 200px;
  left: 700px;
  font-size:xx-large;
}

.gender{
  float:right;
  width:50px;
  height:50px;
}

.right-bottom{
  text-align:left;
  position: relative;
  top:20%;
  left:0%;
  height: 300px;
}
.input-border{
  font-size:large;
  width: 150px;
  height: 25px;
  font-family:'Times New Roman', Times, serif;
}

.input-border:disabled{
  background: white;
  border: none;
}

.username-input{
  position: relative;
  top: 10%;
  left: 12%;
  font-size:large;
  
}
.gender-input{
  position: relative;
  top: 19%;
  left: 12%;
  font-size:large;
 
}

.birthday-input{
  position: relative;
  top: 30%;
  left: 12%;
  font-size:large;
  
}

.major-input{
  position: relative;
  top: 40%;
  left: 27%;
  font-size:large;
  
}

.grade-input{
  position: relative;
  top: 50%;
  left: 27%;
  font-size:large;
 
}

.ensure-button{
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size:medium;
  position: relative;
  top: 70%;
  left: 13%;
}

.cancel-button{
  position: relative;
  top: 70%;
  left: 28%;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size:medium;
  
}

.email-input{
  font-size: large;
  position: relative;
  top: 20%;
  left: 0%;
}

.password-input{
  font-size: large;
  position: relative;
  top: 50%;
  left: 0%;
}
</style>
  