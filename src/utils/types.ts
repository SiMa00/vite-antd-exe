
export interface IObjAny { [propName: string|number]: any }
export interface IObjStrNo { [propName: string|number]: string|number|Array<string|number>|Array<IObjStrNo>|IObjStrNo }
export type TFormSize = 'large'|'middle'|'small'
export type IModalType = 'info'|'success'|'error'|'warning'|'confirm'
export interface ImenuType {}
export type IReqMth = 'GET'|'POST'|'DELETE'|'PUT'

// 菜单模型
export interface IBackMenu {
    // 后台 model
    component?: any;
    creatName: string;
    createTime: string|number;
    creatorId: string|number;
    frameFlag?: 0|1;
    icon: string;
    id: string|number;
    index: number;
    menuName: string;
    menuType: string;
    parentId: string|number;
    path: string;
    perms: string;
    platform: string;
    platformId: string|number;
    requestMethod?: IReqMth;
    updateTime: string|number;
    updaterName: string;
    status?: 0|1;
    visible?: 0|1;
    visibleStr?: string;
}
// 前台 菜单模型 页面构建需要的
export interface IFontMenu extends IBackMenu {
    name?: string;
    title?: string;
    routeKey?: string|number;
    children?: Array<IBackMenu>;
}
