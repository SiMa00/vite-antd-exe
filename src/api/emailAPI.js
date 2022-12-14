
import http from '@/http'
import { transformResponse } from "@/utils"

// 列表查询
export function getEmailListAPI (params) {
    return http({
        url: `v1/push-setting/list`,
        method: 'get',
        params,
        transformResponse,
    })
}
export function getEmailAPI (params) {
    return http({
        url: `v1/push-setting/get`,
        method: 'get',
        params,
        transformResponse,
    })
}

export function addEmailAPI (data) {
    return http({
        url: `v1/push-setting/insert`,
        method: 'post',
        data,
    })
}
export function modifyEmailAPI (data) {
    return http({
        url: `v1/push-setting/update`,
        method: 'post',
        data,
    })
}
export function delEmailAPI (data) {
    return http({
        url: `v1/push-setting/delete`,
        method: 'post',
        data,
    })
}
