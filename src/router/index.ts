
import { createRouter, createWebHistory } from 'vue-router'
import frameRoute from "./frameRoute"
const routes = [
    { path: '/', redirect: '/login' },

    {
        name: 'login',
        path: '/login',
        component: () => import(/* webpackChunkName: "login" */'@/views/LoginFrame/index.vue'),
        meta: { title: 'login' },
    },
    {
        name: 'notAuthed',
        path: '/notAuthed',
        component: () => import(/* webpackChunkName: "notAuthed" */'@/views/NotAuthed/index.vue'),
        meta: { title: 'notAuthed' },
    },
    frameRoute, // TODO 临时固定路由 1

]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior (to, from, savedPosition) {
        if (to.meta.scTo) {
            const dom = document.querySelector(<string>to.meta.scTo)
            if (dom) {
                dom.scrollTop = 0
            }
        } else {
            return { left: 0, top: 0 }
        }
    },
})

export default router
