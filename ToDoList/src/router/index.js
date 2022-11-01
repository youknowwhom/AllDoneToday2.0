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
        path: "/logIn",
        name: "logIn",
        component: () => import("../components/logIn.vue")
    },
    {
        path: "/signUp",
        name: "signUp",
        component: () => import("../components/signUp.vue")
    },
    {
        path: "/toDoList",
        name: "toDoList",
        component: () => import("../components/toDoList.vue")
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router
