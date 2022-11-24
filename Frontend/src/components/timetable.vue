<template>

    <div class="TimeTable-container">
        <p>{{ this.timeTableLocationEncoded }}</p>
        <iframe :src="this.timeTableLocation" id="OneSystemProxy-container" ref="OneProxy"
            @loadstart="this.registerProxy()"></iframe>
    </div>

</template>
  
<script>

export default {
    name: 'TimeTable',
    data() {
        return {
            timeTableLocation: 'https://1.tongji.edu.cn'
        }
    },
    methods: {
        async registerProxy() {
            console.error(document.getElementById('OneSystemProxy-container'))
            let reg = await document.getElementById('OneSystemProxy-container').navigator.serviceWorker.register('/sw.js')
            await reg.update()
        }
    },
    computed: {
        timeTableLocationEncoded() {
            return encodeURIComponent(this.timeTableLocation)
        }
    },
    async created() {
        // let reg = await navigator.serviceWorker.register('/sw.js')
        // await reg.update()
    }
}
</script>
  
<style scoped>
.TimeTable-container {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    height: 100%;
    width: 100%;
    background-color: rgb(255, 255, 255);
    font-size: medium;
}

#OneSystemProxy-container {
    height: 100%;
    width: 100%;
}
</style>
  