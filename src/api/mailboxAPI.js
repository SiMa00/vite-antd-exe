
import http from '@/http'
import { transformResponse } from "@/utils"

// 列表查询
export function getMailboxListAPI (params) {
    return http({
        url: `v1/mail-account/list`,
        method: 'get',
        params,
        transformResponse,
    })
}
export function getMailboxAPI (params) {
    return http({
        url: `v1/mail-account/get`,
        method: 'get',
        params,
        transformResponse,
    })
}

export function getMailServersAPI (params) {
    return http({
        url: `v1/mail-account/listMailServers`,
        method: 'get',
        params,
    })
}

export function addMailboxApi (data) {
    return http({
        url: `v1/mail-account/insert`,
        method: 'post',
        data,
    })
}
export function modifyMailboxAPI (data) {
    return http({
        url: `v1/mail-account/update`,
        method: 'post',
        data,
    })
}
export function delMailboxAPI (data) {
    return http({
        url: `v1/mail-account/delete`,
        method: 'post',
        data,
    })
}


// 查询组管理列表
export function getMailGroupListAPI (params) {
    return http({
        url: `v1/mail-group/list`,
        method: 'get',
        params,
        transformResponse,
    })
}

export function addMailGroupAPI (data) {
    return http({
        url: `v1/mail-group/insert`,
        method: 'post',
        data,
    })
}
export function delMailGroupAPI (data) {
    return http({
        url: `v1/mail-group/delete`,
        method: 'post',
        data,
    })
}
