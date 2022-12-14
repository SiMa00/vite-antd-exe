import ATAxios from "@/http/index"
import { transformResponse } from "@/utils/tool"
import type { IObjAny } from "@/utils/types"

// 用户登录
export function loginAPI(data:IObjAny) {
    return ATAxios.http({
        url: `/portal/common/user/login`,
        method: 'post',
        data,
    })
}
// 征召用户
export function recruitUserAPI(data:IObjAny) {
    return ATAxios.http({
        url: `/portal/backGround/user/recruit`,
        method: 'post',
        data,
    })
}
//
export function getUserPlatAPI(params:IObjAny) {
    return ATAxios.http({
        url: `/portal/common/user/platform`,
        method: 'get',
        params,
        transformResponse,
    })
}
//
export function getUserSelfAPI(params?:IObjAny) {
    return ATAxios.http({
        url: `/portal/common/user/self`,
        method: 'get',
        params,
        transformResponse,
    })
}

// 绑定手机号
export function bdPhone(data:IObjAny, phone:string) {
    return ATAxios.http({
        url: `/portal/common/user/phone/${phone}`,
        method: 'put',
        data,
    })
}
// 绑定邮箱
export function bdEmail(data:IObjAny, email:string) {
    return ATAxios.http({
        url: `/portal/common/user/email/${email}`,
        method: 'put',
        data,
    })
}
// 解绑 邮箱
export function unbindEmail(data:IObjAny, email:string) {
    return ATAxios.http({
        url: `/portal/common/user/unbind/email/${email}`,
        method: 'post',
        data,
    })
}
// 解绑 手机号
export function unbindPhone(data:IObjAny, phn:string) {
    return ATAxios.http({
        url: `/portal/common/user/unbind/phone/${phn}`,
        method: 'post',
        data,
    })
}
// 绑定 用户名
export function bdUsername(data:IObjAny) {
    return ATAxios.http({
        url: `/portal/common/user/bind/name`,
        method: 'post',
        data,
    })
}
// 解绑 用户名
export function unbdUsername(data:IObjAny) {
    return ATAxios.http({
        url: `/portal/common/user/destory`,
        method: 'DELETE',
        data,
    })
}

export function modifyPwd(data:IObjAny) {
    return ATAxios.http({
        url: `/portal/common/user/password`,
        method: 'put',
        data,
    })
}
// 邮箱 强制修改密码
export function modifyPwdByEm(data:IObjAny, email:string) {
    return ATAxios.http({
        url: `/portal/common/user/forceUpdatePassword/email/${email}`,
        method: 'post',
        data,
    })
}
// 手机号 强制修改密码
export function modifyPwdByPh(data:IObjAny, phone:string) {
    return ATAxios.http({
        url: `/portal/common/user/forceUpdatePassword/phone/${phone}`,
        method: 'post',
        data,
    })
}

// 获取验证码
export function getImgVerifyCodeAPI (cId:string) {
    return ATAxios.http({
        url: `/portal/common/validate/image/${cId}`,
        responseType: 'blob',
        method: 'get',
    })
}
// 获取 邮箱 验证码
export function getEmVerifyCodeAPI (email:string) {
    return ATAxios.http({
        url: `/portal/common/validate/email/${email}`,
        method: 'get',
    })
}
// 获取 手机号 验证码
export function getPhVerifyCodeAPI (phone:string) {
    return ATAxios.http({
        url: `/portal/common/validate/phone/${phone}`,
        method: 'get',
    })
}

// 获取用户菜单
export function getMenuByTokenAPI () {
    return ATAxios.http({
        url: `/portal/common/user/token`,
        method: 'get',
        transformResponse,
    })
}
// 检查用户名称，手机号，邮箱信息
export function checkUserNPEAPI (data:IObjAny) {
    return ATAxios.http({
        url: `/portal/common/user/check`,
        method: 'post',
        data,
        headers: { globalErrorMsgSwitch: 0 },
    })
}
