<template>
  <div class="body">
    <div class="box">
      <img src="../assets/image/logo.png" class="logo" />      
      <input
        type="text"
        placeholder="用户名"
        class="input"
        v-model="UserName"
      /><br />
      <div v-if="!IsUsernameTrue" class="username-error">用户名重复</div>
      <div v-if="IsUsernameEmpty" class="username-error">用户名不能为空</div>
      <input
        type="email"
        placeholder="邮箱"
        class="input"
        v-model="EmailAddress"
      />
      <button class="send-message" @click="SendEmail">发送验证码</button>
      <div v-if="IsEmailAddressEmpty" class="email-error">邮箱地址不能为空</div>
      <br />
      <input
        type="security-code"
        placeholder="验证码"
        class="input"
        v-model="SecurityCodeInput"
      />
      <div v-if="IsSecurityCodeEmpty" class="securitycode-error">验证码不能为空</div>
      <div v-else>
        <div v-if="!IsSecurityCodeTrue" class="securitycode-error">验证码错误</div>
      </div>      
      <div v-if="!IsPasswordAgainClear">
        <div v-if="!IsPasswordTrue" class="password-again-error">密码不一致</div>
        <div v-else class="password-true">正确</div>
      </div>
      <input
        type="password"
        placeholder="新密码"
        class="input"
        v-on:input="JudgeThePassword"
        v-model="PasswordHash"
      />
      <div v-if="IsPasswordHashEmpty" class="password-error">密码不能为空</div>
      <br />
      <input
        type="password"
        placeholder="确认密码"
        class="input-again"
        v-on:input="JudgeThePasswordAgain"
        v-model="PasswordAgainHash"
      /><br />
      <div v-if="!IsPasswordAgainClear">
        <div v-if="!IsPasswordTrue" class="password-again-error">密码不一致</div>
        <div v-else class="password-true">正确</div>
      </div>
      <input type="submit" value="注册" class="signup-button" @click="SignUp" />
    </div>
  </div>
</template>
  
<script>
export default {
    name: 'signUp',
    data() {
        return {
            EmailAddress: '',
            PasswordAgainHash: '',
            SecurityCodeInput: '',
            PasswordHash: '',
            UserName: '',
            IsPasswordTrue: false,
            IsPasswordAgainClear: true,
            IsSecurityCodeTrue: true,
            IsUsernameTrue: true,
            IsFormValid: true,
            IsUsernameEmpty: false,
            IsEmailAddressEmpty: false,
            IsSecurityCodeEmpty: false,
            IsPasswordHashEmpty: false,
        }
    },
    methods: {
        SendEmail() {
            alert('已发送')
            
        //将邮箱地址发送给后端
        },    
        JudgeThePassword() {
            if (this.PasswordAgainHash === this.PasswordHash) {
                this.IsPasswordTrue = true
            } else {
                this.IsPasswordTrue = false
            }
        },
        JudgeThePasswordAgain() {
            if (this.PasswordAgainHash === '') {
                this.IsPasswordAgainClear = true
            } else {
                this.IsPasswordAgainClear = false
            }
            if (this.PasswordAgainHash === this.PasswordHash) {
                this.IsPasswordTrue = true
            } else {
                this.IsPasswordTrue = false
            }
        },
        SignUp(){
            if(this.IsPasswordTrue){
                //发送用户名，密码，邮箱，验证码
                //由后端返回两个布尔值，一个检测用户名是否正确（不重复），一个检测验证码是否正确
                //如果全部正确就返回main页面
                //错误就在该行下有红色的报错
                let url = 'http://127.0.0.1:8000/api/register'
                let signupRequest = new XMLHttpRequest()
                let body = {
                    UserName: this.UserName,
                    EmailAddress: this.EmailAddress,
                    PasswordHash: this.PasswordHash,
                    SecurityCode: this.SecurityCodeInput
                }
                signupRequest.open('POST', url)
                signupRequest.setRequestHeader('Content-Type', 'application/json')
                signupRequest.responseType = 'json'
                signupRequest.onload = () => {
                    alert(JSON.stringify(signupRequest.response))
                    this.IsFormValid = signupRequest.response.IsFormValid
                    if(!this.IsFormValid){
                        this.IsUsernameEmpty = signupRequest.response.IsUserNameEmpty
                        this.IsEmailAddressEmpty = signupRequest.response.IsEmailAddressEmpty
                        this.IsPasswordHashEmpty = signupRequest.response.IsPasswordEmpty
                        this.IsSecurityCodeEmpty = signupRequest.response.IsSecurityCodeEmpty
                    }
                    else{
                        this.IsSecurityCodeTrue = signupRequest.response.IsSecurityCodeTrue
                        this.IsUsernameTrue = signupRequest.response.IsUsernameTrue
                        if(this.IsSecurityCodeTrue === true && this.IsUsernameTrue === true){
                            this.$router.push('/')
                            //跳转主页面
                        }
                    }                    
                }
                signupRequest.send(JSON.stringify(body))               
            }

        }
    },
}
</script>
  
<style scoped>
.body {
  position: fixed;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  left: 0px;
  top: 0px;
  background-image: url(../assets/image/background.jpg);
  caret-color: transparent;
}

.box {
  position: relative;
  top: 11%;
  border-radius: 25px;
  background-color: white;
  padding: 20px;
  width: 450px;
  height: 550px;
  margin: 0 auto;
}

.logo {
  height: 80px;
  padding-top: 10px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.input[type="text"] {
  background: url(../assets/image/user.png) no-repeat 0.5% 50%;
  background-size: 30px 30px;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  margin: 0 auto;
  padding: 10px;
  padding-left: 50px;
  height: 40px;
  font-size: 20px;
  border: 0;
  outline: none;
  border-bottom: #c5c5fd solid;
}

.input::-webkit-input-placeholder {
  color: #cfcfcf;
}

.input[type="text"]:focus {
  background: url(../assets/image/user-focus.png) no-repeat 0.5% 50%;
  background-size: 30px 30px;
  border-bottom: #7a7af9 solid;
  animation: mymove 100ms 1 linear;
  caret-color: #7a7af9;
}

.input[type="email"] {
  background: url(../assets/image/email.png) no-repeat 0.5% 50%;
  background-size: 30px 30px;
  position: absolute;
  top: 37%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  margin: 0 auto;
  padding: 10px;
  padding-left: 50px;
  height: 40px;
  font-size: 20px;
  border: 0;
  outline: none;
  border-bottom: #c5c5fd solid;
}

.input[type="email"]:focus {
  background: url(../assets/image/email-focus.png) no-repeat 0.5% 50%;
  background-size: 30px 30px;
  border-bottom: #7a7af9 solid;
  animation: mymove 100ms 1 linear;
  caret-color: #7a7af9;
}

.send-message {
  position: absolute;
  top: 36%;
  left: 74%;
  border: none;
  background-color: white;
  color: #7a7af9;
  font-size: medium;
}

.input[type="security-code"] {
  background: url(../assets/image/security-code.png) no-repeat 1% 48%;
  background-size: 25px 25px;
  position: absolute;
  top: 44%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 40px;
  padding: 10px;
  padding-left: 50px;
  margin-top: 30px;
  font-size: 20px;
  border: 0;
  outline: none;
  border-bottom: #c5c5fd solid;
}

.input[type="security-code"]:focus {
  background: url(../assets/image/security-code-focus.png) no-repeat 1% 48%;
  background-size: 25px 25px;
  border-bottom: #7a7af9 solid;
  animation: mymove 100ms 1 linear;
  caret-color: #7a7af9;
}

.input[type="password"] {
  background: url(../assets/image/password.png) no-repeat 1% 45%;
  background-size: 25px 25px;
  position: absolute;
  top: 56%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 40px;
  padding: 10px;
  padding-left: 50px;
  margin-top: 30px;
  font-size: 20px;
  border: 0;
  outline: none;
  border-bottom: #c5c5fd solid;
}

.input[type="password"]:focus {
  background: url(../assets/image/password-focus.png) no-repeat 1% 45%;
  background-size: 25px 25px;
  border-bottom: #7a7af9 solid;
  animation: mymove 100ms 1 linear;
  caret-color: #7a7af9;
}

.input-again {
  background: url(../assets/image/password.png) no-repeat 1% 45%;
  background-size: 25px 25px;
  position: absolute;
  top: 68%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 40px;
  padding: 10px;
  padding-left: 50px;
  margin-top: 30px;
  font-size: 20px;
  border: 0;
  outline: none;
  border-bottom: #c5c5fd solid;
}
.input-again::-webkit-input-placeholder {
  color: #cfcfcf;
}

.input-again:focus {
  background: url(../assets/image/password-focus.png) no-repeat 1% 45%;
  background-size: 25px 25px;
  border-bottom: #7a7af9 solid;
  animation: mymove 100ms 1 linear;
  caret-color: #7a7af9;
}

@keyframes mymove {
  0% {
    border-bottom-color: #c5c5fd;
  }

  33% {
    border-bottom-color: #a4a4f2;
  }

  66% {
    border-bottom-color: #8989d8;
  }

  100% {
    border-bottom-color: #7a7af9;
  }
}

.password-again-error {
  position: absolute;
  top: 80%;
  left: 8%;
  background: url(../assets/image/error.png) no-repeat 0% 53%;
  padding-left: 20px;
  background-size: 16px 16px;
  background-position: left;
  color: #d81e06;
  font-size: small;
}

.password-true {
  position: absolute;
  top: 80%;
  left: 8%;
  background: url(../assets/image/true.png) no-repeat 0% 53%;
  padding-left: 20px;
  background-size: 16px 16px;
  background-position: left;
  color: #78cd7d;
  font-size: small;
}

.username-error{
  position: absolute;
  top: 30%;
  left: 8%;
  background: url(../assets/image/error.png) no-repeat 0% 53%;
  padding-left: 20px;
  background-size: 16px 16px;
  background-position: left;
  color: #d81e06;
  font-size: small;
}

.email-error{
  position: absolute;
  top: 42%;
  left: 8%;
  background: url(../assets/image/error.png) no-repeat 0% 53%;
  padding-left: 20px;
  background-size: 16px 16px;
  background-position: left;
  color: #d81e06;
  font-size: small;
}

.password-error{
  position: absolute;
  top: 66%;
  left: 8%;
  background: url(../assets/image/error.png) no-repeat 0% 53%;
  padding-left: 20px;
  background-size: 16px 16px;
  background-position: left;
  color: #d81e06;
  font-size: small;
}

.securitycode-error{
  position: absolute;
  top: 55%;
  left: 8%;
  background: url(../assets/image/error.png) no-repeat 0% 53%;
  padding-left: 20px;
  background-size: 16px 16px;
  background-position: left;
  color: #d81e06;
  font-size: small;
}

.signup-button {
  background-color: #7a7af9;
  color: white;
  position: absolute;
  top: 85%;
  left: 8%;
  width: 410px;
  height: 45px;
  border: none;
  font-size: large;
  border-radius: 4px;
  cursor: pointer;
}

.signup-button:hover {
  background-color: #c5c5fd;
}
</style>
  