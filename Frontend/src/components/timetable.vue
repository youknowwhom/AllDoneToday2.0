<template>

    <div class="TimeTable-container">
        <p>{{this.timeTableLocationEncoded}}</p>
        <p>{{this.timeTableLocationEncoded}}</p>
        <p>{{this.timeTableLocationEncoded}}</p>
        <p>{{this.timeTableLocationEncoded}}</p>
        <iframe src="https://1.tongji.edu.cn/GraduateStudentTimeTable"></iframe>
    </div>

</template>
  
<script>

export default {
    name: 'TimeTable',
    data() {
        return {
            timeTableLocation: 'https://1.tongji.edu.cn/GraduateStudentTimeTable'
        }
    },
    methods: {

    },
    computed: {
        timeTableLocationEncoded() {
            return encodeURIComponent(this.timeTableLocation)
        }
    }
}
</script>
  
<style scoped>

.TimeTable-container {
    /* display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start; */
    height: 100%;
    width: 100%;
    background-color: rgb(255, 255, 255);
    font-size: medium;
}
</style>
  