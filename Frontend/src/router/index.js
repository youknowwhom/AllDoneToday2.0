//index.js
import {
    createRouter,
    createWebHistory
} from 'vue-router'


const routes = [
    {
        path: '/',
        component: () => import('../components/main.vue'),
        children: [
            {
                path: 'app',
                component: () => import('../components/app.vue'),
                children: [
                    {
                        path: 'ToDoList',
                        component: () => import('../components/todolist.vue'),
                    },
                    {
                        path: 'Concentration',
                        component: () => import('../components/concentration.vue'),
                    }
                ],
                redirect: '/app/ToDoList'
            },
            {
                path: 'welcome',
                component: () => import('../components/welcome.vue')
            }
        ],
        redirect: '/app'
    },
    {
        path: '/signin',
        name: 'signin',
        component: () => import('../components/signin.vue')
    },
    {
        path: '/signup',
        name: 'signup',
        component: () => import('../components/signup.vue')
    },
    {
        path: '/forgetpassword',
        name: 'forgetPassword',
        component: () => import('../components/forgetpassword.vue')
    },
    {
        path: '/personalinfo',
        name: 'personalInfo',
        component: () => import('../components/personalinfo.vue')
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router
