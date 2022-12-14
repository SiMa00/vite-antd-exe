
import type { IReqDefaultVal } from "./reqTypes"

export const DEFAULT_VAL:IReqDefaultVal = {
    Timeout: 1 * 60 * 1000, // ms; 默认 1分钟
    DefaultLang: 'zh', // TODO 根据系统浏览器

    GetErrMsgWay: 'byRes',
    GlobalErrMsgSwitch: '1', // 1 开启; 0 关闭
    GlobalLoadingSwitch: '0', // 1 开启; 0 关闭
    IfCancelDupReq: '0', // 是否取消重复请求; 1 取消重复请求; 0 不取消

    LangHttpKey: 'accept-language',
    DefaultReqWay: 'post',
    Post: {},
    Get: {},
    XssProtection: {
        "X-XSS-Protection": "1; mode=block",
        "X-Content-Type-Options": "nosniff",
    },
    // nocache: {
    //     Pragma: "no-cache",
    //     "Cache-Control": "no-cache",
    //     Expires: 0,
    // },
}
