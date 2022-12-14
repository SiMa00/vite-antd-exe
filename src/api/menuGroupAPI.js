
import http from "@/http"
import { transformResponse } from "@/utils"

export function getMenuGroupListAPI (data) {
    return http({
        url: `/portal/backGround/menuGroup/list`,
        method: 'post',
        data,
        transformResponse,
    })
}

// 新增
export function addMenuGroupAPI (data) {
    return http({
        url: '/portal/backGround/menuGroup/save',
        method: 'post',
        data,
    })
}
// 修改
export function updateMenuGroupAPI (data) {
    return http({
        url: '/portal/backGround/menuGroup/update',
        method: 'post',
        data,
    })
}
// 查看
export function getMenuGroupInfoAPI (data) {
    return http({
        url: '/portal/backGround/menuGroup/getInfo',
        method: 'post',
        data,
        transformResponse,
    })
}

export function getMGContextAPI (data) {
    return http({
        url: '/portal/backGround/menuGroup/contextMenu',
        method: 'post',
        data,
        transformResponse,
    })
}
// 删除
export function deleteMenuGroupAPI (data) {
    return http({
        url: '/portal/backGround/menuGroup/remove',
        method: 'post',
        data,
    })
}

// 导出 菜单组
export function exportMenuGroupAPI (params) {
    return http({
        url: `/portal/backGround/menuGroup/file/download`,
        method: 'get',
        params,
        responseType: 'blob',
    })
}
