
import { defineStore } from 'pinia'
import { loginAPI, getMenuByTokenAPI, getUserSelfAPI } from "@/api/userAPI"
import { getSysMenusListAPI } from "@/api/systemAPI"
import { isNotEmpty, generateMenuRoutes, setFixedRoute } from "@/utils/tool"
import type { IFontMenu, IObjAny } from "@/utils/types"
import { SUPER_ADMIN } from "@/utils/constant"

export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: {
            username: '',
            platformId: '',
            platformName: '',
        } as IObjAny,

        allMenus: [] as Array<IObjAny>,  // 所有菜单 的原始未加工数据
        uAllMenus: [] as Array<IFontMenu>,
        uSiderMenu: undefined as undefined|Array<IFontMenu>,
        operPermissions: [] as []|Array<string>,
        
        loadType: '',
    }),
    // 可以缓存
    getters: {
        usernameGT(state): string {
            return state.userInfo.username
        },
        userInfoGT(state): IObjAny {
            return state.userInfo
        },
        isSuperAdmin(state):boolean {
            // state.userInfo  this 相互调用
            const username = this.userInfo.username || localStorage.getItem('username')
            return username === SUPER_ADMIN
        },
    },
    actions: {
        SET_lOAD_TYPE (data:string) {
            this.loadType = data
        },
        SET_ALL_MENUS (state, data) {
            this.allMenus = data
        },
        SET_U_ALL_MENUS (data?: Array<IFontMenu>) {
            if (data) {
                this.uAllMenus = data
            } else {
                this.uAllMenus = []
            }
            
        },
        SET_SIDER_MENUS (data?:Array<IFontMenu>) {
            if (data) {
                this.uSiderMenu = data
            } else {
                this.uSiderMenu = undefined
            }
        },
        SET_OPER_PERMS (data?:Array<string>) {
            if (data) {
                this.operPermissions = data
            } else {
                this.operPermissions = []
            }
            
        },
        SET_USER_INFO (userData?:IObjAny) {
            if (userData && isNotEmpty(userData)) {
                this.userInfo = userData
                if (userData.username) {
                    localStorage.setItem('username', userData.username)
                }
                if (userData.Authorization) {
                    localStorage.setItem('TOKEN', userData.Authorization)
                }
            } else {
                this.loadType = ''
                this.userInfo = {}
                this.uAllMenus = []
                this.uSiderMenu = undefined
                this.operPermissions = []
                
                localStorage.clear()
            }
        },

        async LoginACT (data:IObjAny) {
            const res = await loginAPI(data)
            if (res.isOk) {
                this.SET_USER_INFO(res.retData)
                return res.retData
            } else {
                this.SET_USER_INFO()
                return ''
            }
        },
        async refreshUserInfoACT (data:IObjAny) {
            const res = await getUserSelfAPI({})
            if (res.isOk) {
                this.SET_USER_INFO(res.retData)
                return res.retData
            } else {
                this.SET_USER_INFO()
                return ''
            }
        },
        async GetUserMenusACT (data:IObjAny) {
            let sucFlag:number|'' = ''
            const { isOk: isOk0, retData: retData0 } = await getMenuByTokenAPI()
            const { isOk: isOk1, retData: retData1 } = await getUserSelfAPI({})
            if (isOk0 && isOk1) {
                const isSuperAdmin = retData0.username === SUPER_ADMIN
                this.SET_USER_INFO(retData1)
                if (isSuperAdmin) {
                    const res1 = await getSysMenusListAPI({})
                    const { userMenus, siderMenus, oPermissions } = generateMenuRoutes(res1.retData, true)
                    this.SET_ALL_MENUS(res1.retData)
                    this.SET_U_ALL_MENUS(userMenus)
                    this.SET_SIDER_MENUS(siderMenus)
                    this.SET_OPER_PERMS(oPermissions)
                    sucFlag = 1
                } else {
                    if (retData0 && isNotEmpty(retData0.urlMap) && isNotEmpty(retData0.urlMap[-1])) {
                        const uAuthArr = retData0.urlMap[-1]
                        const { userMenus, siderMenus, oPermissions } = generateMenuRoutes(uAuthArr, false)
                        this.SET_ALL_MENUS(uAuthArr)
                        this.SET_U_ALL_MENUS(userMenus)
                        this.SET_SIDER_MENUS(siderMenus)
                        this.SET_OPER_PERMS(oPermissions)
                        sucFlag = 1
                    } else {
                        setFixedRoute()
                        this.SET_ALL_MENUS([])
                        this.SET_U_ALL_MENUS([])
                        this.SET_SIDER_MENUS([])
                        this.SET_OPER_PERMS([])
                        sucFlag = 1
                    }
                }
            }

            return sucFlag
        },
    },

    // // 开启数据缓存
    // persist: {
    //     enabled: true,
    //     /**
    //      * 默认按照模块名字去定义缓存的 key
    //      * 默认存储整个 state
    //      * 默认存储在 sessionStorage
    //      * 
    //      * 可以定义 strategies 去覆盖默认行为
    //      * paths 定义 state里需要存储的字段，其他字段不会存储
    //      */
    //     strategies: [
    //         { key: 'xxx', paths: ['bb'], storage: localStorage },
    //     ],
    // },
    
})