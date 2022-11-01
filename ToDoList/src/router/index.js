//index.js
import {
    createRouter,
    createWebHistory
} from 'vue-router'

const routes = [{
        path: "/",
        name: "main",
        component: () => import("../components/main.vue")
    },
    {
        path: "/RegisterAndLogin",
        name: "RegisterAndLogin",
        component: () => import("../components/RegisterAndLogin.vue")
    },
    
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router
