
import router from "@/router/index"
import { useUserStore } from "@/stores/user"
import { isEmpty, isNotEmpty } from "@/utils/tool"


// 前置导航守卫;
router.beforeEach(async (to, from, next) => {
    const TOKEN = localStorage.getItem('TOKEN')
    const toPath = to.path
    var userStore:any = null
    if (userStore === null) {
        userStore = useUserStore()
    } 

    if (to.query && to.query.token && to.query.platformId) {
        const outTk = <string>to.query.token
        const outPtid = <string>to.query.platformId
        const loadType = <string>to.query.loadType
        if (loadType === 'iframe') {
            window.localStorage.setItem('isIframe', '1')
            userStore.SET_lOAD_TYPE('iframe')
        }
        window.localStorage.setItem('TOKEN', outTk)
        window.localStorage.setItem('uims-ptid', outPtid)
        const res = await userStore.GetUserMenusACT({
            headers: { 'x-platform-header': outPtid },
        })
        next(to.path)
    } else {
        if (toPath !== '/login' && toPath !== '/') {
            const userSMenus = userStore.uSiderMenu
            if (isEmpty(TOKEN)) {
                userStore.SET_USER_INFO()
                next('/login')
            } else if (userSMenus === undefined) {
                // const res = await userStore.GetUserMenusACT()
                // if (isNotEmpty(res)) {
                //     next({ ...to, replace: true })
                // } else {
                //     // 直接 next() 时，当处于 空菜单时，刷新页面 页面空白;直接 next({ ...to, replace: true }) 初始页面报错，一直死循环的报错提示
                //     if (from.path === '/') {
                //         next()
                //     } else {
                //         next({ ...to, replace: true })
                //     }
                // }
                next() // TODO 临时固定路由 2
            } else {
                next()
            }
        } else {
            next()
        }
    }
})


// const uimsFrameType = localStorage.getItem('uims-frame') // isIframe
// if (uimsFrameType === '1') { // '1' 代表是 iframe
    
// } else {
    
// }