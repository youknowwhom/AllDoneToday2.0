import {
    createRouter,
    createWebHistory,
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
                    },
                    {
                        path: 'Curriculum',
                        component: () =>import('../components/curriculum.vue')
                    }
                ],
                redirect: '/app/ToDoList'
            },
            {
                path: 'welcome',
                component: () => import('../components/welcome.vue')
            },
            {
                path: '/profile',
                component: () => import('../components/profile.vue')
            },
        ],
        redirect: '/app'
    },
    {
        path: '/signin',
        component: () => import('../components/signin.vue')
    },
    {
        path: '/signup',
        component: () => import('../components/signup.vue')
    },
    {
        path: '/resetPassword',
        component: () => import('../components/resetPassword.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
