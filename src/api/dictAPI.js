
import http from "@/http"
import { transformResponse } from "@/utils"

export function getDictListAPI (data) {
    return http({
        url: `/portal/common/dict/list`,
        method: 'post',
        data,
        transformResponse,
    })
}
// 字典详情
export function getDictInfoAPI (data) {
    return http({
        url: `/portal/common/dict/getInfo`,
        method: 'post',
        data,
        transformResponse,
    })
}

// 新增
export function addDictAPI (data) {
    return http({
        url: '/portal/common/dict/save',
        method: 'post',
        data,
    })
}
// 修改
export function modifyDictAPI (data) {
    return http({
        url: `/portal/common/dict/update`,
        method: 'post',
        data,
    })
}
// 删除
export function deleteDictAPI (data) {
    return http({
        url: `/portal/common/dict/remove`,
        method: 'post',
        data,
    })
}

// 导出
export function exportDictAPI (params) {
    return http({
        url: `/portal/common/dict/file/download`,
        method: 'get',
        params,
        responseType: 'blob',
    })
}
