import ATAxios from "@/http/index"
import { transformResponse } from "@/utils/tool"
import type { IObjAny } from "@/utils/types"

// **************************************** 菜单管理  ****************************************
// 查询平台信息
export function getPlatformListAPI (params?:IObjAny) {
    return ATAxios.http({
        url: `/portal/common/dict/platform`,
        method: 'get',
        params,
        transformResponse,
    })
}
export function getAddressListAPI () {
    return ATAxios.http({
        url: `/portal/common/dict/address`,
        method: 'get',
        transformResponse,
    })
}
// 查询菜单列表
export function getSysMenusListAPI (params:IObjAny) {
    return ATAxios.http({
        url: '/portal/backGround/menu/list',
        method: 'get',
        params,
        transformResponse,
    })
}
// 查询 权限菜单
export function getAuthedMenusListAPI (params:IObjAny) {
    return ATAxios.http({
        url: '/portal/backGround/menu',
        method: 'get',
        params,
        transformResponse,
    })
}

// 新增菜单
export function addMenuAPI (data:IObjAny) {
    return ATAxios.http({
        url: '/portal/backGround/menu',
        method: 'post',
        data,
        transformResponse,
    })
}
// 获取指定菜单
export function getMenuInfoAPI (id:string) {
    return ATAxios.http({
        url: `/portal/backGround/menu/${id}`,
        method: 'get',
        transformResponse,
    })
}
// 修改指定菜单
export function modifyMenuAPI (data:IObjAny) {
    return ATAxios.http({
        url: `/portal/backGround/menu/${data.id}`,
        method: 'put',
        data,
        headers: { ifNull2Empty: true },
        transformResponse,
    })
}
// 删除指定菜单
export function deleteMenuAPI (id:string) {
    return ATAxios.http({
        url: `/portal/backGround/menu/${id}`,
        method: 'DELETE',
        transformResponse,
    })
}

// **************************************** 角色管理  ****************************************
// 查询角色列表
export function getRoleListAPI (data:IObjAny) {
    return ATAxios.http({
        url: '/portal/backGround/role',
        method: 'get',
        params: data,
        transformResponse,
    })
}
// 查询角色 详情
export function getRoleInfoAPI (id:string) {
    return ATAxios.http({
        url: `/portal/backGround/role/${id}`,
        method: 'get',
        transformResponse,
    })
}
// 新增角色
export function addRoleAPI (data:IObjAny) {
    return ATAxios.http({
        url: '/portal/backGround/role',
        method: 'post',
        data,
    })
}
export function modifyRoleAPI (data:IObjAny) {
    return ATAxios.http({
        url: `/portal/backGround/role/${data.id}`,
        method: 'put',
        data,
        transformResponse,
    })
}
// 删除角色
export function deleteRoleAPI (id:string) {
    return ATAxios.http({
        url: `/portal/backGround/role/${id}`,
        method: 'DELETE',
        transformResponse,
    })
}

// **************************************** 用户管理  ****************************************
// 查询用户列表
export function getUserListAPI (params:IObjAny) {
    return ATAxios.http({
        url: '/portal/backGround/user',
        method: 'get',
        params,
        transformResponse,
    })
}

// 添加 用户
export function addUserAPI (data:IObjAny) {
    return ATAxios.http({
        url: '/portal/backGround/user',
        method: 'post',
        data,
        transformResponse,
    })
}
// 修改 用户
export function modifyUserAPI (data:IObjAny) {
    return ATAxios.http({
        url: `/portal/backGround/user/${data.id}`,
        method: 'put',
        data,
        transformResponse,
    })
}
export function deleteUserAPI (id:string) {
    return ATAxios.http({
        url: `/portal/backGround/user/${id}`,
        method: 'DELETE',
        transformResponse,
    })
}
// 获取用户信息
export function getUserInfoAPI (id:string) {
    return ATAxios.http({
        url: `/portal/backGround/user/${id}`,
        method: 'get',
        transformResponse,
    })
}
// 绑定用户角色
export function bindUserRolesAPI (data:IObjAny) {
    return ATAxios.http({
        url: `/portal/backGround/user/role`,
        method: 'post',
        data,
        transformResponse,
    })
}
// 重置密码
export function resetPwdAPI (data:IObjAny) {
    return ATAxios.http({
        url: `/portal/backGround/user/${data.id}/password/reset`,
        method: 'put',
        data,
        transformResponse,
    })
}

// 导出 菜单
export function exportMenuAPI (params:IObjAny) {
    return ATAxios.http({
        url: `/portal/backGround/menu/file/download`,
        method: 'get',
        params,
        responseType: 'blob',
    })
}
// 导出 角色
export function exportRoleAPI (params:IObjAny) {
    return ATAxios.http({
        url: `/portal/backGround/role/file/download`,
        method: 'get',
        params,
        responseType: 'blob',
    })
}
// 导出 用户
export function exportUserAPI (params:IObjAny) {
    return ATAxios.http({
        url: `/portal/backGround/user/file/download`,
        method: 'get',
        params,
        responseType: 'blob',
    })
}
