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
        <div class="box-right">hi
            <div v-if="IsBasicInfo">
                <div class="small-blank-1">hi</div>
                
            </div>
            <div v-else>
                hello
            </div>
        </div>     
        
            
       
    </div>
</template>
  
<script>

export default {
    name: 'personalInfo',
    data() {
        return {
            IsBasicInfo: true,
            IsEditEnabled: false,
        }
    },
    methods: {
        
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
  width: 100px;
  height: 40px;
  background: #e9e9ff;
  position: relative;
  top: 100%;
  left: -10%;
}

</style>
  