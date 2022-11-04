<template>
    <div class="body">
        <div class="header">
            <img src="../assets/image/logo.png" class="logo" />
        </div>       
        <div class="box-left">
            <img src="../assets/image/photo.jpg" class="circle"/>
            <button class="basic">基本信息</button>
            <button class="safety">安全信息</button>
        </div>     
        
            
       
    </div>
</template>
  
<script>

export default {
    name: 'personalInfo',
    data() {
        return {
            IsBasicInfo: true,
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
  height: 460px;
  margin: 0 auto;
}

.circle{
  width: 80px;
  height: 80px;
  border-radius: 100%;
}

.basic{
    background:url("../assets/image/basic.png") no-repeat 0% 30%;
    background-size: 30px 30px;
    color: #bfbfbf;
    position: relative;
    top: 10%;
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
    top: 20%;
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

</style>
  