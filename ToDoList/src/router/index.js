//index.js
import {
    createRouter,
    createWebHistory
} from 'vue-router'


const routes = [{
    path: '/',
    name: 'main',
    component: () => import('../components/main.vue')
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
    path: '/app',
    name: 'app',
    component: () => import('../components/app.vue')
},
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router
