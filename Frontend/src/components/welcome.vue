<script>

export default {
    name: 'Welcome',
    data() {
        return {
            
        }
    },
    async created() {
        
    },
    async setup() {
        // await new Promise(r => setTimeout(r, 2000)) // sleep
    }
}

</script>

<template>
    <el-container class="welcome-content">
        welcome
    </el-container>
</template>


<style scoped>

.welcome-content {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    height: 100%;
    background-color: rgb(255, 255, 255);
}

</style>
  