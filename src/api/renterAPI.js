
import http from "@/http"
import { transformResponse } from "@/utils"

export function getRenterListAPI (params) {
    return http({
        url: `/portal/backGround/org`,
        method: 'get',
        params,
        transformResponse,
    })
}
export function getRenterInfoListAPI (id) {
    return http({
        url: `/portal/backGround/org/${id}`,
        method: 'get',
        transformResponse,
    })
}

// 新增
export function addRenterAPI (data) {
    return http({
        url: '/portal/backGround/org',
        method: 'post',
        data,
    })
}
// 修改
export function modifyRenterAPI (data) {
    return http({
        url: `/portal/backGround/org/${data.id}`,
        method: 'put',
        data,
    })
}
// 删除
export function deleteRenterAPI (ids) {
    return http({
        url: `/portal/backGround/org/${ids}`,
        method: 'DELETE',
    })
}

// 新增 分配套餐
export function addMealsAPI (data) {
    return http({
        url: '/portal/backGround/org/setMeal',
        method: 'post',
        data,
    })
}
// 修改 分配套餐
export function modifyMealsAPI (data) {
    return http({
        url: '/portal/backGround/org/setMeal',
        method: 'put',
        data,
    })
}

// 绑定代理
export function bdAgentAPI (data) {
    return http({
        url: '/portal/backGround/org/agent',
        method: 'post',
        data,
    })
}

// 导出
export function exportRenterAPI (params) {
    return http({
        url: `/portal/backGround/org/file/download`,
        method: 'get',
        params,
        responseType: 'blob',
    })
}
