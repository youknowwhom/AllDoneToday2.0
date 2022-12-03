<template>
    <el-container class="profile-container">
        profile
    </el-container>
</template>
  
<script>

import axios from 'axios'

export default {
    name: 'Profile',
    data() {
        return {
            
        }
    },
    async created() {
        let response
        try {
            response = await axios.post('/api/user/getInfo', {
                token: localStorage.getItem('token')
            })
        } catch (err) {
            console.error(err)
            return
        }
        console.debug(response)
    },
    methods: {
        
    },
}
</script>

<style scoped>

.profile-container {
    height: 100%;
    width: 100%;
}

</style>