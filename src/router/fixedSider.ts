
// main fixed route
// 不会显示在 左侧菜单里
export default [
    {
        name: 'userCenter',
        path: 'userCenter',
        component: () => import(/* webpackChunkName: "UserCenter" */'@/views/UserCenter'),
        meta: { title: 'userCenter' },
    },
    
    {
        name: 'atForm',
        path: 'atForm',
        component: () => import(/* webpackChunkName: "atForm" */'@/views/Test/AtForm.vue'),
        meta: { title: 'atForm' },
    },
    {
        name: 'atTable',
        path: 'atTable',
        component: () => import(/* webpackChunkName: "atTable" */'@/views/Test/AtTable.vue'),
        meta: { title: 'atTable' },
    },
    {
        name: 'testReq',
        path: 'testReq',
        component: () => import(/* webpackChunkName: "TestReq" */'@/views/Test/TestReq.vue'),
        meta: { title: 'testReq' },
    },

]
