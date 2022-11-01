<template>
    <h1 class="list-name">清单</h1>
    <router-link :to="{ name: 'signin' }" class="button">登录/注册</router-link>
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

.button {
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
