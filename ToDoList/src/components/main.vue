<template>
    <h1 class="list-name">今日毕</h1>
    <router-link :to="{ name: 'signin' }" class="button-1">登录/注册</router-link>
    <router-link :to="{ name: 'app' }" class="button-2">主页面</router-link>
    <router-link :to="{ name: 'personalInfo' }" class="button-3">个人信息</router-link>

</template>

<script>
export default {
    name: 'MainProject',
    data() {
        
    },
    methods: {

    },
}
</script>

<style scoped>
.list-name {
    position: fixed;
    top: 25px;
    left: 50px;
    color: blue;
    font-size: 40px;
}

.button-1 {
    position: fixed;
    top: 50px;
    left: 1100px;
    text-decoration: none;
    width: 100px;
    height: 40px;
    line-height: 40px;
    background-color: lightsalmon;
    color: darkblue;
    border-radius: 20px;
    cursor: pointer;
}
.button-2 {
    position: fixed;
    top: 50px;
    left: 1200px;
    text-decoration: none;
    width: 100px;
    height: 40px;
    line-height: 40px;
    background-color: lightsalmon;
    color: darkblue;
    border-radius: 20px;
    cursor: pointer;
}
.button-3 {
    position: fixed;
    top: 50px;
    left: 1300px;
    text-decoration: none;
    width: 100px;
    height: 40px;
    line-height: 40px;
    background-color: lightsalmon;
    color: darkblue;
    border-radius: 20px;
    cursor: pointer;
}
</style>
