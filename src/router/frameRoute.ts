
import fixedSider from "./fixedSider"

export default {
    name: 'frame',
    path: '/frame',
    component: () => import(/* webpackChunkName: "layout" */'@/layout/index.vue'),
    children: [
        ...fixedSider,
    ],
}
