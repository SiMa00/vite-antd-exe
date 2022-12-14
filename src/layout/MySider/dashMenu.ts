
import { SettingOutlined, DollarOutlined, AppstoreAddOutlined } from '@ant-design/icons-vue'

// 跟路由 对应
// routeKey: 路由 name, 要保证唯一性(即使不是路由组件)
export const dashMenuList = [
    {
        title: '请求测试',
        routeKey: 'testReq',
        icon: 'iconfont20 icon-sp',
    },
    {
        title: 'AutoForm测试',
        routeKey: 'atForm',
        icon: 'icon-category',
    },
    {
        title: 'AutoTable测试',
        routeKey: 'atTable',
        icon: 'icon-dingdan',
    },
    {
        title: '激活码管理',
        routeKey: 'activeCode',
        icon: 'iconfont19 icon-jihuo',
    },
    {
        title: '试用商品管理',
        routeKey: 'freeTry',
        icon: 'iconfont22 icon-trial',
    },
    {
        title: '激活码(免费试用)',
        routeKey: 'freeActiveCode',
        icon: 'iconfont22 icon-free',
    },
    {
        title: '支付中心',
        routeKey: 'zfCenter',
        icon: DollarOutlined,
        children: [
            {
                title: '支付管理',
                routeKey: 'payment',
            },
            // {
            //     title: '账单管理',
            //     routeKey: 'bills',
            // },
            // {
            //     title: '资金对账',
            //     routeKey: 'reconciliation',
            // },
        ],
    },
    {
        title: '设置',
        routeKey: 'settings',
        icon: SettingOutlined,
    },
    {
        title: '系统管理',
        routeKey: 'systemSettings',
        icon: AppstoreAddOutlined,
        children: [
            {
                title: '用户管理',
                routeKey: 'users',
            },
            {
                title: '角色管理',
                routeKey: 'roles',
            },
            {
                title: '菜单管理',
                routeKey: 'menus',
            },
        ],
    },
]


export const rootSubmenuKeys = dashMenuList
    .filter(item => item.children && item.children.length > 0)
    .map(it => it.routeKey)
