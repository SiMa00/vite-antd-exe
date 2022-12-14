
import http from "@/http"
import { transformResponse } from "@/utils"


export function getMealListAPI (data) {
    return http({
        url: '/portal/backGround/setMeal/list',
        method: 'post',
        data,
        transformResponse,
    })
}

// 新增
export function addMealAPI (data) {
    return http({
        url: '/portal/backGround/setMeal/save',
        method: 'post',
        data,
    })
}
// 修改
export function updateMealAPI (data) {
    return http({
        url: '/portal/backGround/setMeal/update',
        method: 'post',
        data,
    })
}
// 查看
export function getMealInfoAPI (data) {
    return http({
        url: '/portal/backGround/setMeal/getInfo',
        method: 'post',
        data,
        transformResponse,
    })
}
// 删除
export function deleteMealAPI (data) {
    return http({
        url: '/portal/backGround/setMeal/remove',
        method: 'post',
        data,
    })
}

// 导出
export function exportMealsAPI (params) {
    return http({
        url: `/portal/backGround/setMeal/file/download`,
        method: 'get',
        params,
        responseType: 'blob',
    })
}
