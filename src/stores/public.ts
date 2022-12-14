
import { defineStore } from 'pinia'
import { getCurrentLang } from "@/utils/tool"

export const usePublicStore = defineStore('public', {
    state: () => ({
        collapsed: false, // 默认 不关闭 sider 菜单
        isLessBkPoint: false, // 小于断点 标识
        currentLang: getCurrentLang(),
        contentAreaHt: 0,
        themeColor: '#1890FF',
        showFrame: false,
        showLoadingLogo: false,
    }),
    // 可以缓存
    getters: {},
    actions: {
        SET_SHOW_FRAME (data:boolean) {
            this.showFrame = data
        },
        SET_LOADING_LOGO (data:boolean) {
            this.showLoadingLogo = data
        },
        SET_THEME_COLOR (data:string) {
            this.themeColor = data
        },
        SET_COLLAPSED (data:boolean) {
            this.collapsed = data
        },
        SET_IS_LESS_BKPOINT (data:boolean) {
            this.isLessBkPoint = data
        },
        SET_CURRENT_LANG (data:string) {
            this.currentLang = data
        },
        SET_CONTENT_AREA_HT (data:number) {
            this.contentAreaHt = data
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