export const testRoutes = [
    {
        name: 'testTemp',
        path: '/testTemp',
        component: () => import(/* webpackChunkName: "testTemp" */'@/Test/TemplateExp.vue'),
        meta: { title: 'testTemp' },
    },
]
