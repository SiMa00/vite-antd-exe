

import dayjs from 'dayjs'
// import * as dayjs from 'dayjs'
import { Modal } from 'ant-design-vue'
// import store from "@/store"
import router from "@/router"
import type { FormInstance } from "ant-design-vue"
import myFrameRoute from "@/router/frameRoute"
import { nanoid } from 'nanoid'
import JSONBIG from './parse.js'
import { cloneDeep } from "lodash"
import type { 
    IBackMenu, 
    IFontMenu, 
    IObjAny, 
    IObj, 
    TFormSize,
} from "./types"
import type { ModalProps, ModalFuncProps } from "ant-design-vue";

export function showModal(content:string, type:ModalFuncProps['type'] = 'warning', title = '温馨提示', orgOpts?:ModalProps) {
    Modal[type]({
        title,
        content,
        closable: false,
        okText: '确定',
        wrapClassName: 'my-show-modal',
        ...orgOpts,
    })
}

// 对比数据是否发生过改变;
export function hasChangeData(data1:IObj, data2:IObj):boolean {
    return JSON.stringify(data1) !== JSON.stringify(data2)
}

export function getFormSize():TFormSize {
    let fsize:TFormSize
    const screenwidth = document.body.clientWidth

    if (screenwidth >= 2000) {
        fsize = 'large'
    } else if (screenwidth >= 1600) {
        fsize = 'large'
    } else if (screenwidth >= 1200) {
        fsize = 'middle'
    } else if (screenwidth >= 992) {
        fsize = 'middle'
    } else if (screenwidth >= 768) {
        fsize = 'small'
    } else if (screenwidth >= 576) {
        fsize = 'small'
    } else {
        fsize = 'small'
    }

    return fsize
}

export function getClientId():string {
    return import.meta.env.VITE_APP_PLATFORM_ID + '_' + new Date().getTime() + '_' + nanoid()
}

// export function getByteLen(val = '') {
//     let len = 0
//     for (let i = 0; i < val.length; i++) {
//         const length = val.charCodeAt(i)
//         if (length >= 0 && length <= 128) {
//             len += 1
//         } else {
//             len += 2
//         }
//     }
//     return len
// }
// export function inByteRange(val, min = 0, max) {
//     const len = getByteLen(val)
//     return len >= min && len <= max
// }
// export function validateByByteRange(min = 0, max, outterRegExp) {
//     return (rule, value, callback) => {
//         const reg = new RegExp(`^${outterRegExp || '[\\u4E00-\\u9FA5A-Za-z0-9()]'}{${min / 2},${max}}$`)
//         if (reg.test(value) && inByteRange(value, min, max)) {
//             return Promise.resolve()
//         } else {
//             return Promise.reject(new Error(`仅支持${min}-${max}位字符，格式为数字、字母、汉字或组合`))
//         }
//     }
// }
// export function validateByByteRange2(min = 0, max, outterRegExp) {
//     return (rule, value, callback) => {
//         const reg = new RegExp(`^${outterRegExp || '[\\u4E00-\\u9FA5A-Za-z0-9()_-]'}{${min / 2},${max}}$`)
//         if (reg.test(value) && inByteRange(value, min, max)) {
//             return Promise.resolve()
//         } else {
//             return Promise.reject(new Error(`仅支持${min}-${max}位字符，格式为数字、字母、汉字、英文下划线_、英文中间线-、或组合`))
//         }
//     }
// }

export function generateMenuRoutes(list:Array<IBackMenu>, isSuperAdmin:boolean) {
    let userMenus = [] // 用户权限内的 可见 + 不可见 所有菜单(目录 页面 按钮等); 但不一定是全部的
    let siderMenus = [] // 用户 左侧展示 可见的菜单
    const oPermissions = [] // 用户 按钮 级别权限字符

    for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const isC = item.menuType === 'C' || item.menuType === '菜单'
        const isM = item.menuType === 'M' || item.menuType === '目录'
        const hasPath = isNotEmpty(item.path)
        const hasCom = isNotEmpty(item.component)

        // 嵌套子路由，父路由也可能有 component 和 path
        if (isC || isM) { // 菜单
            const mcObj: IFontMenu = { // 适用于 路由 的菜单item
                ...item,
                title: item.menuName, // sider 使用
                routeKey: item.id, // sider 使用
            }

            if (hasPath) { // path 不能重复
                const pathArr = item.path.split('/')
                mcObj.name = pathArr[pathArr.length - 1] // path 最后一个/后面的 字符串

                let fpath = item.path
                const url1 = 'http://uims-test.fjdac.cn'
                const url2 = 'http://uims.fjdac.cn'

                if (fpath.includes(url1)) {
                    const fpArr = fpath.split(url1)
                    fpath = fpArr[1]
                } else if (fpath.includes(url2)) {
                    const fpArr = fpath.split(url2)
                    fpath = fpArr[1]
                }

                mcObj.routeKey = fpath
                mcObj.path = fpath
            }
            if (hasCom) {
                mcObj.component = () => import(/* webpackChunkName: "main-route-component" */`@/views/${item.component}`)
            }

            // 可变部分
            const vFlag = isSuperAdmin || (item.visible === 0 || item.status === 0)
            if (hasPath && hasCom && vFlag) { // visible status 0 显示
                myFrameRoute.children.push(mcObj)
            }
            if (vFlag) { // 显示
                siderMenus.push(mcObj)
            }
        }

        if (!isSuperAdmin && isNotEmpty(item.perms)) {
            oPermissions.push(item.perms)
        }

        const showItem = { // 适用于 展示项目 的菜单item
            ...item,
            key: item.id + '',
            title: item.menuName,
        }


        userMenus.push(showItem)
    }

    userMenus = sortRelationship(userMenus, 'all')
    siderMenus = sortRelationship(siderMenus)

    // 开启默认走 sider第一个的路由的话，可能存在的情况：第一个路由被人配置错误，导致展示页面出问题
    // if (isNotEmpty(siderMenus)) {
    //     myFrameRoute.children.push({
    //         path: '/frame',
    //         redirect: getDefaultRoute(siderMenus),
    //     })
    // }
    router.addRoute(myFrameRoute)

    return { userMenus, siderMenus, oPermissions }
}

function getDefaultRoute(arr: Array<IFontMenu>) {
    let rStr = ''
    if (isNotEmpty(arr)) {
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i]
            const mType = element.menuType

            if ((mType === '菜单' || mType === 'C') && element.frameFlag === 1) { // frameFlag = 1 不是外链
                if (isNotEmpty(element.path)) {
                    rStr = element.path
                    break
                }
            } else if (mType === '目录' || mType === 'M') {
                if (isNotEmpty(element.children)) {
                    rStr = getDefaultRoute(element.children!)
                    if (isNotEmpty(rStr)) {
                        break
                    }
                }
            }
        }

    }

    return rStr

}
// 根据 index 和 createTime进行排序
// rArr1.sort((a, b) => sortOrder(a, b))
function sortOrder(a:IObjAny, b:IObjAny) {
    if ((a.index - b.index === 0) && a.createTime) {
        return new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
    } else {
        return a.index - b.index
    }
}
export function setFixedRoute() {
    router.addRoute(myFrameRoute)
}
// 获取 对象数组的 keys values
// [{ id, name }] 如 获取数组里 所有对象的 id 的集合 + name集合; needStr 要不要把 value 转成 string形式
export function getArrObjKVs(arr:Array<IObjAny>, label = 'val', value = 'key', needStr = true) {
    const labelsArr:Array<string> = []
    const valuesArr:Array<string|number> = []

    for (let index = 0; index < arr.length; index++) {
        const ele = arr[index]
        labelsArr.push(ele[label])
        let kV = ele[value]
        if (needStr) {
            kV += ''
        }
        valuesArr.push(kV)
    }
    return { labelsArr, valuesArr }
}

export function sortRelationship(rArr:Array<IFontMenu>, act = 'notAll') {
    const allMenuData = rArr.filter(father => {
        const branchArr = rArr.filter(child => father.id === child.parentId)

        if (isNotEmpty(branchArr)) {
            branchArr.sort((a, b) => a.index - b.index)
            if (act === 'all') {
                father.children = branchArr
            } else {
                if (father.menuType === 'M' || father.menuType === '目录') {
                    father.children = branchArr
                }
            }
        }

        return father.parentId === 0
    })
    allMenuData.sort((a, b) => a.index - b.index)

    return allMenuData || []
}
// 推荐使用
export function sortTreeRelation(rArr:Array<IFontMenu>) {
    const rArr0 = cloneDeep(rArr)
    for (let i = 0; i < rArr0.length; i++) {
        const element = rArr0[i]
        const branchArr = rArr0.filter(child => element.id === child.parentId)
        if (isNotEmpty(branchArr)) {
            branchArr.sort((a, b) => a.index - b.index)
            element.children = branchArr
        }
    }

    const rArr1 = cloneDeep(rArr0)
    for (let y = 0; y < rArr0.length; y++) {
        const element = rArr0[y]
        if (element.children && isNotEmpty(element.children)) {
            for (let k = 0; k < element.children.length; k++) {
                const ele = element.children[k]
                const idx = rArr1.findIndex(item => item.id === ele.id)
                if (idx > -1) {
                    rArr1.splice(idx, 1)
                }
            }
        }
    }

    rArr1.sort((a, b) => a.index - b.index)
    return rArr1
}

/**
 *
 * @param { Array } array
 * @param { Object } obj;
 * @param { * } key
 * @returns { Object }
 * @example
 *  Arr1
 * [
 *  { key: 'name', defaultVal: 'ff' },
 *  { key: 'age', },
 * ]
 *
 *  =>> { name: 'ff', age: '', }
 * 注意：obj若是一个空对象，可以返回一个新对象，斩断引用关系,若不是则会保持对源对象;
 *      '' 可能有特殊含义，所以不能轻易使用 ''
 */
export function list2ObjAttr(array:Array<IObjAny>, obj:IObjAny, key = 'key') {
    for (let i = 0; i < array.length; i++) {
        const at = array[i][key]
        const dftVal = array[i].defaultVal
        obj[at] = isNotEmpty(dftVal) ? dftVal : undefined
    }

    return obj
}
/**
 * 特殊的(input前后带select定制化的) list2ObjAttr 
 * defaultSBVal input前 select默认值 
 * defaultSAVal input后 select默认值 
 */
export function list2ObjAttr2(array:Array<IObjAny>, obj:IObjAny, key = 'key') {
    for (let i = 0; i < array.length; i++) {
        const at = array[i][key]
        const dftVal = array[i].defaultVal
        obj[at] = isNotEmpty(dftVal) ? dftVal : undefined


        const bModelKey = array[i].beforeModelKey
        const aModelKey = array[i].afterModelKey
        if (isNotEmpty(bModelKey)) {
            const bModelDftVal = array[i].defaultSBVal
            obj[bModelKey] = isNotEmpty(bModelDftVal) ? bModelDftVal : undefined
        }
        if (isNotEmpty(aModelKey)) {
            const aModelDftVal = array[i].defaultSAVal
            obj[aModelKey] = isNotEmpty(aModelDftVal) ? aModelDftVal : undefined
        }
    }

    return obj
}

export const transformResponse = (data:IObjAny) => {
    const myJson = JSONBIG({ storeAsString: true })
    return myJson.parse(data)
}

// 添加 前缀 +86
export function handlePhnoPlus(phn:string, prefix = '+86') {
    if (isNotEmpty(phn)) {
        return phn.startsWith(prefix) ? phn : prefix + phn
    } else {
        return ''
    }
}

// 去除 前缀 +86
export function handlePhnoSub(phn:string, prefix = '+86') {
    if (isNotEmpty(phn)) {
        return phn.startsWith(prefix) ? phn.substring(prefix.length) : phn
    } else {
        return ''
    }
}
// 日期 格式化; 显示当前 时间的特定格式
export function parseTime(time:number|'now', pattern?:string) {
    const _pattern = pattern || 'YYYY-MM-DD HH:mm:ss'

    if (time === 'now') {
        return dayjs().format(_pattern)
    } else {
        if (isNotEmpty(time)) {
            return dayjs(time).format(_pattern)
        } else {
            return ''
        }
    }
}

/**
 * 获取指定时间戳
 * @param time
 * @returns TimeStamp
 */
export function getTimeStamp(time:string|dayjs.Dayjs) {
    if (isNotEmpty(time)) {
        if (time instanceof dayjs) {
            return time.valueOf()
        } else if (time instanceof Date) {
            return time.getTime()
        } else if (isString(time)) {
            return new Date(<string>time).getTime()
        } else {
            return ''
        }
    } else {
        return ''
    }
}


/**
 * @param {*} by
 * @param {*} val
 * @param {Array} array
 * @returns {Number} 找到的索引
 * @example 在 formModelList 里，找到 modelKey = remoteCategory 的对象的索引
 * const i = findIdxByKey('modelKey', 'remoteCategory', formModelList)
 * formModelList = [
 *  { modelKey, },
 *  { modelKey, },
 * ]
 */
export function findIdxByKey(by:string, val:string|number, arr:Array<IObjAny>) {
    return arr.findIndex(ite => ite[by] === val)
}

/**
 * @des 根据开始 结束 返回 数组
 * @param {Number} start
 * @param {Number} end
 * @returns {Array}
 * @example
 *  start 0
 *  end   24
 *
 *  => [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
 */
export const setRangeNumArr = (start:number, end:number) => {
    const result = []

    for (let i = start; i < end; i++) {
        result.push(i)
    }

    return result
}
export async function validateMyForm(formRef:FormInstance) {
    try {
        const res = await formRef.validateFields()
        if (res) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

export function getCurrentLang() {
    return 'zhCN'
}
/**
 * 一个url能否触发浏览器自动下载:
 * 主要看该请求响应头response header是否满足，一般是看Content-Disposition和Content-Type这两个消息头：
    response header中指定了Content-Disposition为attachment，它表示让浏览器把消息体以附件的形式下载并保存到本地
    (一般还会指定filename, 下载的文件名默认就是filename)

    response header中指定了Content-Type 为 application/octet-stream(无类型) 或 application/zip(zip包时)等等。
    (
        其中 application/octet-stream表示http response为二进制流(没指定明确的type), 用在未知的应用程序文件，
        浏览器一般不会自动执行或询问执行。浏览器会像对待 设置了HTTP头Content-Disposition 值为 attachment 的文件一样来对待这类文件
    )
 */
export function downloadFile (file:Blob|string, fileName:string = Date.now()+'') {
    if (isString(file)) {
        window.open(<string>file, '_blank')
    } else {
        // 后端返回 content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        const link = document.createElement('a')
        link.download = fileName + Date.now()
        link.href = window.URL.createObjectURL(<Blob>file)
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()

        URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
    }
}
/** url 批量下载1：
 * urlArr.forEach(url => {
        window.open(url, '_blank')
    })
 */
function batchDownload(urlArr:Array<string>, clearSecond = 5000) {
    // 批量下载 方式 1
    // urlArr.forEach(url => {
    //     window.open(url, '_blank')
    // })

    if (isNotEmpty(urlArr)) {
        const iframeFather = document.createElement('div')
        iframeFather.id = 'iframe_down_dom'
        iframeFather.style.display = 'none'
        document.body.appendChild(iframeFather)

        urlArr.forEach(url => {
            if (isNotEmpty(url)) {
                const iframe = document.createElement("iframe")
                iframe.style.display = "none" // 防止影响页面设置不可见
                iframe.style.height = "0" // 防止影响页面高度设置为0
                iframe.src = url
                iframeFather.appendChild(iframe) // 这一行必须，iframe挂在到dom树上才会发请求

                const timer2 = setTimeout(function() {
                    const iDom = document.getElementById("iframe_down_dom")
                    if (iDom) {
                        document.body.removeChild(iDom)
                    }

                    clearTimeout(timer2)
                }, clearSecond)
            }
        })
    }
}


// 导出 excle
// 后端返回列表数据(只能下载返回的数据)
export const ExportExlFile = (data:Blob, fileName=Date.now()+'') => {
    const blob = new Blob([data], { type: "application/vnd.ms-excel" }) // 转成blob格式

    const link = document.createElement("a")
    link.download = fileName
    link.href = URL.createObjectURL(blob)
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()

    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
}

/**
 * @description 验证是否为 '' null undefined {} []
 * @return {boolean}
 * @example
 *  isEmpty(0)      false   注意 数字 0 在这里不为空;
 *  isEmpty(1)      false
 *  isEmpty(false)  false
 *
 *  isEmpty('   ')  true
 *  isEmpty({})     true
 *  isEmpty([])     true
 *  isEmpty(null),     true
 *  isEmpty(undefined) true
 */
export function isEmpty<T>(b:T) {
    if (b == null) {
        return true
    }
    if (typeof (b) === 'string') {
        if (b.trim() === 'undefined' || b.trim() === '') {
            return true
        }
    } else if (typeof (b) === 'object') {
        for (const name in b) {
            if (Object.hasOwnProperty.call(b, name)) {
                return false
            }
        }
        return true
    }
    return false
}
export function isNotEmpty<T>(b:T) {
    return !isEmpty(b)
}

export function deleteNull(obj:IObjAny, trans2EmptyChar:boolean = false, trim:boolean = true) {
    if (obj && isObject(obj)) {
        const temObj:IObjAny = {}
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const val = obj[key]
                const nFlag = isNumber(val) // isNumber(NaN) true; isNaN(NaN) true

                if ((nFlag && !isNaN(val)) || (!nFlag)) {
                    if (isEmpty(val) && trans2EmptyChar) {
                        temObj[key] = ''
                    } else {
                        if (isNotEmpty(val)) {
                            let rStr = val
                            if (trim === true && isString(val)) {
                                rStr = val.trim()
                            }
                            temObj[key] = rStr
                        }
                    }
                }
            }
        }

        return temObj
    } else {
        return obj
    }
}

/**
 * @description 判断是否是 数组类型 []
 * @param arr 数组
 */
export function isArray<T>(arr:T) {
    return Object.prototype.toString.call(arr) === "[object Array]"
}
export function isFunc<T>(fn:T) {
    return Object.prototype.toString.call(fn) === "[object Function]"
}
export function isAsyncFunc<T>(fn:T) {
    return Object.prototype.toString.call(fn) === "[object AsyncFunction]"
}
export function isObject<T>(obj:T) {
    return Object.prototype.toString.call(obj) === "[object Object]"
}
export function isString<T>(str:T) {
    return Object.prototype.toString.call(str) === "[object String]"
}
export function isBool<T>(b:T) {
    return Object.prototype.toString.call(b) === '[object Boolean]'
}
export function isPromise<T>(p:T) {
    return Object.prototype.toString.call(p) === "[object Promise]"
}
export function isNumber<T>(n:T) {
    return Object.prototype.toString.call(n) === '[object Number]'
}

/**
 * @return 颜色值
 * @description 获取随机色; 随机数取整，并转换成16进制
 */
export function getRandomColor() {
    let random = '#'
    for (let i = 0; i < 6; i++) {
        random += parseInt((Math.random() * 15)+'').toString(16)
    }
    return random
}


export function tranlateTime10(t:number|string) {
    return t < 10 ? '0' + t : t
}
export function getUTCtime() {
    const dateObj = new Date()
    const year = dateObj.getUTCFullYear() +''

    const month = tranlateTime10(dateObj.getUTCMonth() + 1)
    const day = tranlateTime10(dateObj.getUTCDate())
    const hh = tranlateTime10(dateObj.getUTCHours())
    const mm = tranlateTime10(dateObj.getUTCMinutes())
    const ss = tranlateTime10(dateObj.getUTCSeconds())

    return year + month + day + hh + mm + ss
}

/**
 * @description 数组去重
 * @param  list 待去重数组 ; key:根据什么去重
 * @return arr
 * @example
 */
export function delRepeat(list:Array<IObjAny>, key = 'id') {
    const obj:IObjAny = {}
    const result = []
    for (let i = 0; i < list.length; i++) {
        if (!obj[list[i][key]]) {
            result.push(list[i])
            obj[list[i][key]] = true
        }
    }
    return result
}

/**
 * @description 数组取交集; 在 arrA 里取和 ArrB 相同的元素元素,可能会重复;
 * @param  arrA, ArrB 待取交集数组 ; complex:复杂数组,即数组对象,false,即为简单数组;
 * @return arr
 * @example let a = [1,2,3,3,4,5];
            let b = [1,3,4,55,6];
            getCrossArray(a,b) => [1, 3, 3, 4]
 */
export function getCrossArray(arrA:Array<string|number>, ArrB:Array<string|number>, complex = false) {
    let crossArray:Array<string|number> = []
    if (complex) { // 复杂数组 TODO

    } else {
        crossArray = arrA.filter(item => (ArrB.includes(item)))
    }
    return crossArray
}
/**
 * @description 数组取并集; 可能会重复;
 * @param  arrA, ArrB 待取并集数组 ; complex:复杂数组,即数组对象,false,即为简单数组;
 * @return arr
 * @example let a = [1,2,3,3,4,5];
            let b = [1,3,4,55,6];
            getUnionArray(a,b) => [1, 2, 3, 3, 4, 5, 1, 3, 4, 55, 6]
 */
export function getUnionArray(arrA:Array<string|number>, ArrB:Array<string|number>, complex = false) {
    let crossArray:Array<string|number> = []
    if (complex) { // 复杂数组

    } else {
        crossArray = [...arrA, ...ArrB]
    }
    return crossArray
}

/**
 * @description 数组排序
 * @param  arr 待排序数组 ; id:根据什么排序
 * @return result
 * @example
 */
export function sortArrById(arr:Array<IObjAny>, id = 'pid') {
    const a = arr
    a.sort((a, b) => {
        const aId = parseInt(a[id])
        const bId = parseInt(b[id])
        if (!(aId && bId) && aId !== 0 && bId !== 0) {
            console.log('sortArrById 排序异常!', a, aId, '-----', b, bId)
            throw new Error('sortArrById error')
        }
        return aId - bId
    })
    return a
}

/**
 * @description 数组对象 转换成 tree 结构; 注意: children 属性必须具备且是数组;
 * @param  arr 待排序数组 ; id:根据什么排序
 * @return result
 * @example
 * let c1 = [
      {id: '021', name: 'n021', pid: '02', children:[]},
      {id: '032', name: 'n032', pid: '03', children:[]},
      {id: '01', name: 'n01', pid: '0', children:[]},
      {id: '02', name: 'n01', pid: '0', children:[]},
    ]

    ===>
    let c1 = [
      {id: '01', name: 'n01', pid: '0', children:[]},
      {id: '02', name: 'n02', pid: '0', children:[
        {id: '021', name: 'n021', pid: '02', children:[]},
      ]},
    ]
 */
// export function arr2Tree(arr:Array<IObjAny>, id = 'id', pid = 'pid') {
//     const a = sortArrById(arr)
//     const aMap = list2Map(a)
//     const b = []

//     for (let index = 0, al = a.length; index < al; index++) {
//         const element = a[index]
//         if (element[pid] === '0') {
//             b.push(element)
//         } else {
//             const a = element[pid]
//             const obj = aMap[element[pid]]
//             if (obj.children) {
//                 obj.children.push(element)
//             } else {
//                 throw new Error('arr2Tree error: 数组对象无 children属性!')
//             }
//         }
//     }
//     return b
// }

/**
 * @description tree 平铺展开 成数组对象, 包括 1级、2级等 所有级别, 不重复！
 * @param  tree 树结构
 * @return []
 * @example
 */
// export function tree2Arr(treeData) {
//     const arr = []
//     const spreadTree = trees => {
//         if (trees && trees.length > 0) {
//             trees.forEach(e => {
//                 arr.push(e)
//                 spreadTree(e.children)
//             })
//         }
//     }
//     spreadTree(treeData)
//     return arr
// }

/**
 * @description list--> map
 * @param  list 数组；key:String; 默认是 'id'
 * @return {}
 * @example
 */
export function list2Map(list:Array<IObjAny>, key = 'value') {
    const map:IObjAny = {}
    if (isNotEmpty(list)) {
        for (let index = 0; index < list.length; index++) {
            const val = list[index][key]
            map[val] = list[index]
        }
    }
    return map
}

/**
 * @description 获取对象属性重复数目
 * @param {string}
 * @return {boolean}
 * @example let arr = [{name:'apple'},{name:'apple'},{name:'orange'},{name:'apple'},{name:'pear'}]
 *          {"apple":3,"orange":1,"pear":1}
 */
export function getRepeatProNum(arr:Array<IObjAny>) {
    const obj:IObjAny = {}
    // let arrLsit = []
    for (let i = 0, l = arr.length; i < l; i++) {
        const item = arr[i].TX
        obj[item] = (obj[item] + 1) || 1
    }
    return obj
}


// /**
//  * @example getEleStyle(textNode, 'marginTop')
//  *
//  */
// export function getEleStyle(ele, attr) {
//     if (ele.currentStyle) {
//         return ele.currentStyle[attr]
//     } else {
//         return document.defaultView.getComputedStyle(ele, null)[attr]
//     }
// }
// export function getEleAllHeight(ele) {
//     if (ele) {
//         return ele.offsetHeight + parseInt(getEleStyle(ele, "marginTop")) + parseInt(getEleStyle(ele, "marginBottom"))
//     } else {
//         return 0
//     }
// }
