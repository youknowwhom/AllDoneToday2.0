import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

import router from './router'

app.use(router)

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'dayjs/locale/zh-cn'

app.use(ElementPlus, {
    locale: zhCn,
})

app.mount('#app')