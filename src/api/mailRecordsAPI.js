import http from '@/http'
import { transformResponse } from "@/utils"

// 邮件触发记录
export function getMailRecordListAPI (params) {
    return http({
        url: `v1/trigger/listPlat`,
        method: 'get',
        params,
        transformResponse,
    })
}
// 触发明细 => 数据统计
export function getERecordTJAPI (params) {
    return http({
        url: `v1/trigger/listPlatAndSetting`,
        method: 'get',
        params,
    })
}
// 触发明细 => 邮件明细
export function getERecordYouJAPI (params) {
    return http({
        url: `v1/trigger/listPlatRecords`,
        method: 'get',
        params,
    })
}
