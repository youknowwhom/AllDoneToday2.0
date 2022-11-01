<template>
  <div class="body">
    <div class="box">
      <img src="../assets/image/logo.png" class="logo" />
      <form action="demo_form.php">
        <input
          type="text"
          placeholder="用户名"
          class="input"
          v-model="NameAndPassword.username"
        /><br />
        <input
          type="password"
          placeholder="密码"
          class="input"
          v-model="NameAndPassword.password"
        /><br />
        <input
          type="password-again"
          placeholder="再次确认密码"
          class="input"
          v-model="NameAndPassword.password"
        /><br />
        <input type="submit" value="注册" class="signup-button" @click="Login"/>
      </form>
    </div>
  </div>
</template>
  
  <script>
import { logicalExpression } from '@babel/types';

export default {
  name: "logIn",
  data(){
    return{
      NameAndPassword: {
        username: "",
        password: "",
      }
    }
  },
  methods: {
    Login() {
      let url="http://127.0.0.1:80/login";
      let login = new XMLHttpRequest();
      let result;
      login.open("POST", url);
      login.onload = function(res){
        result = res;
        alert(result);
      }
      login.send(this.NameAndPassword);
    },

    toSignup(){
      this.$router.push('/signUp');
    }

  },
};
</script>
  
  <style scoped>
.body {
  position: fixed;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  left: 0px;
  top: 0px;
  background-image: url(../image/background.jpg);
}

.box {
  position: relative;
  top: 15%;
  border-radius: 25px;
  background-color: white;
  padding: 20px;
  width: 450px;
  height: 450px;
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
  background: url(../image/user.png) no-repeat 0% 50%;
  background-size: 30px 30px;
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  margin: 0 auto;
  padding: 10px;
  padding-left: 50px;
  height: 50px;
  font-size: 20px;
  border: 0;
  outline: none;
  border-bottom: #c5c5fd solid;
}

.input::-webkit-input-placeholder {
  color: #cfcfcf;
}

.input[type="text"]:focus {
  background: url(../image/user-focus.png) no-repeat 0% 50%;
  background-size: 30px 30px;
  border-bottom: #7a7af9 solid;
  animation: mymove 2s 1 linear;
}

.input[type="password"] {
  background: url(../image/password.png) no-repeat 1% 53%;
  background-size: 25px 25px;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 50px;
  padding: 10px;
  padding-left: 50px;
  margin-top: 30px;
  font-size: 20px;
  border: 0;
  outline: none;
  border-bottom: #c5c5fd solid;
}

.input[type="password"]:focus {
  background: url(../image/password-focus.png) no-repeat 1% 53%;
  background-size: 25px 25px;
  border-bottom: #2e2ed9 solid;
  animation: mymove 100ms 1 linear;
}


.input[type="password-again"] {
  background: url(../image/password.png) no-repeat 1% 53%;
  background-size: 25px 25px;
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 50px;
  padding: 10px;
  padding-left: 50px;
  margin-top: 30px;
  font-size: 20px;
  border: 0;
  outline: none;
  border-bottom: #c5c5fd solid;
}

.input[type="password-again"]:focus {
  background: url(../image/password-focus.png) no-repeat 1% 53%;
  background-size: 25px 25px;
  border-bottom: #2e2ed9 solid;
  animation: mymove 100ms 1 linear;
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

.signup-button {
  background-color: #7a7af9;
  color: white;
  position: absolute;
  top: 72%;
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
  