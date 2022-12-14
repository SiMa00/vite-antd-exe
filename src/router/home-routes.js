
export const homeRoutes = [
    // 登录 区
    {
        name: 'login',
        path: '/login',
        component: () => import(/* webpackChunkName: "login" */'@/views/LoginFrame'),
        meta: { title: 'login' },
    },
    {
        name: 'notAuthed',
        path: '/notAuthed',
        component: () => import(/* webpackChunkName: "notAuthed" */'@/views/NotAuthed'),
        meta: { title: 'notAuthed' },
    },
]
