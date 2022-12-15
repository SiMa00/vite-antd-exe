
import { useUserStore } from "@/stores/user"
// import type { IAutoRequestCfg } from "auto-axios"
import type { IAutoRequestCfg } from "../packages/reqTypes"
import { isNotEmpty, isEmpty, showModal } from "@/utils/tool";

const router = useRouter()
let userStore:any = null

export const AutoReqCfg:IAutoRequestCfg = {
    REQ_CONST: {
        BaseUrl: import.meta.env.VITE_APP_BASE_API,
        LoginExpiredCode: [600], // 会话超时
        RetSucCode: [0], // 返回成功
        LoginUrl: '/portal/routing/uaa/login', // login请求的 path部分, 目的：登录请求不带 token过去
        // AuthOperationUrl?: '', // 获取 csrftoken值的请求url

        // Timeout?: number, // s; window.systemCfg.reqTimeout, // m * s
        // DefaultLang?: string,
    },
    REQ_SWITCH: {
        GetErrMsgWay: "byRes",
        GlobalErrMsgSwitch: '1', // 全局错误消息 提示开关; 1 开启; 0 关闭
        GlobalLoadingSwitch: '1', // 全局等待层 开关; 1 开启; 0 关闭
        IfCancelDupReq: '1', // 是否取消重复请求; 1 取消重复请求; 0 不取消
    },
    RET_FIELDS_CFG: {
        RetCode: 'code',
        RetMsg: 'msg',
        RetData: 'data',
        RetCount: 'count', // 列表查询条数 统计字段
        TokenStorageKey: 'TOKEN',
        TokenHttpKey: 'Authorization',

        LangStorageKey: 'currentLang', // 存储 里的 语言字段 key
        LangHttpKey: 'i18n', // 发送给后台的 语言字段
    },
    // REQ_WAYS_CFG?: {
    //     DefaultWay?: 'post' | 'get' | 'delete' | 'put',
    //     DefaultHeader?: objAny, // { 'x-tenant-header': 'electronic-commerce' },
    // },
    showTipBox(
        retMsg?: string,
        retCode?: string | number,
        statusCode?: string | number,
        response?: any,
    ) {
        if (retMsg) {
            showModal(retMsg)
        }
        
        // if (userStore === null) {
        //     userStore = useUserStore()
        // }
        // const loadType = userStore.loadType
        // const isIframe = loadType === 'iframe'

        // if (statusCode === 401 || statusCode === 403) {
        //     if (isIframe) {
        //         window.parent.postMessage({ type: 'no_auth', data: '' }, '*')
        //     } else {
        //         userStore.SET_USER_INFO({})
        //         router.push({ name: 'login' })
        //     }
        // } else {
        //     if (
        //         retMsg === 'token无效，请重新登录' ||
        //         isEmpty(retCode) ||
        //         (retCode === 2 && retMsg === 'fail') ||
        //         (retCode === 1 && retMsg === 'Insufficient_permissions')
        //     ) {
        //         if (isIframe) {
        //             window.parent.postMessage({ type: 'no_auth', data: '' }, '*')
        //             userStore.SET_USER_INFO({})
        //         } else {
        //             userStore.SET_USER_INFO({})
        //             router.push({ name: 'login' })
        //         }
        //     } else {
        //         let msgfinal = ''
        //         if (response && isNotEmpty(response.data) && isNotEmpty(response.data.errors)) {
        //             const errorStrArr:Array<string> = response.data.errors.map(item => item.defaultMessage)
        //             msgfinal = errorStrArr.join(', ')
        //         } else {
        //             msgfinal = retMsg ? retMsg : ''
        //         }

        //         showModal(msgfinal)
        //     }
        // }
    },
    // 返回 loadService 对象需要提供 closeLoadMask() + showLoadMask() 方法
    // getLoadService?: () => ILoad;
    // beforeReq?: (config:AxiosRequestConfig) => void;
    beforeReq(config) {
        const isIframe = window.localStorage.getItem('isIframe')
        if (config.headers) {
            if (isIframe === '1') {
                const pid = window.localStorage.getItem('uims-ptid')
                config.headers['x-platform-header'] = pid
            } else {
                if (config.url !== '/portal/common/user/login') {
                    config.headers['x-platform-header'] = import.meta.env.VITE_APP_PLATFORM_ID
                }
            }
        }
    },
}