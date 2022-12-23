

import type { IFormListItem, IObjAny, IObj } from "@/components/form-type"
import dayjs from "dayjs";


export const myFormList:Array<IFormListItem > = [
    {
        modelKey: 'name1',
        modelType: 'a-input',
        label: '名称1',
        defaultVal: '333333111111111111333111111111111333111111111111333111111111111333111111111111333111111111111111111111111',
        orgCfg: {},
        // txtTips: [
        //     '不要随便给人起别名哟',
        //     '焦点好听的名字',
        // ],
    },
    {
        modelKey: 'name2',
        modelType: 'a-input',
        label: '名称2',
        orgCfg: {},
        ifShow: (formState:IObj) => formState.name === '222',
    },
    {
        modelKey: 'entityNo',
        modelType: 'a-input',
        label: '管111333111111111111111111111理号',
        // labelWidth: 90, // 自定义 label width
        defaultVal: '1112',
        orgCfg: {
            prefix: "￥",
            suffix: "RMB",
        },
    },
    // item 文字过长，建议用单选，radio不具备 title
    {
        modelKey: 'category',
        modelType: 'a-radio-group',
        label: '分类',
        defaultVal: 'm',
        // labelIcon: <appstore-outlined />,
        options: [
            { label: '美少女战士', value: 'm' },
            { label: 'Saber', value: 'sb' },
        ],
        orgCfg: {},
    },
    {
        modelKey: 'iptNo',
        modelType: 'a-input-number',
        label: '数字输入框',
        defaultVal: 0,
        orgCfg: {
            addonAfter: "$",
            addonBefore: "#",
        },
    },
    {
        modelKey: 'fruits',
        modelType: 'a-checkbox-group',
        label: '复选水果',
        defaultVal: ['apple', 'smt'],
        options: [
            { label: '苹果11111111111111122233345', value: 'apple' },
            { label: '水蜜桃111111111111111', value: 'smt' },
            { label: '梨子', value: 'pear' },
            { label: '橙子', value: 'orange' },
        ],
        orgCfg: {},
    },
    // {
    //     modelKey: 'remoteCategory',
    //     modelType: 'a-select',
    //     label: '远程分类',
    //     placeholder: '请输入搜索关键字',
    //     options: [],
    //     search: searchData,
    //     // fetchLoading: false,
    //     orgCfg: {
    //         notFoundContent: null, // 是 undefined 的话，初次点击 select 会出现 空白面板
    //         showSearch: true,
    //         filterOption: false,
    //     },
    // },
    // 小技巧: 如果复选、多选项目文本过长，可以把过长的选择项目放在末尾，让更多展示
    {
        modelKey: 'multiChose',
        modelType: 'a-select',
        label: '多选美女',
        defaultVal: ['q1', 'q3', 'q6', 'q8', 'q9'],
        options: [
            { label: '美女', value: 'q1' },
            { label: '少年', value: 'q2' },
            { label: '私奔', value: 'q3' },
            { label: '手办', value: 'q4' },
            { label: '御姐', value: 'q5' },
            { label: '萝莉', value: 'q6' },
            { label: '洛丽塔', value: 'q7' },
            { label: '连衣裙', value: 'q8' },
            { label: '大长腿连衣裙大长腿连衣裙大长腿连衣裙大长腿连衣裙大长腿连衣裙大长腿连衣裙大长腿连衣裙', value: 'q9' },
        ],
        orgCfg: {
            mode: "multiple",
            maxTagCount: 1,
            maxTagTextLength: 11,
        },
    },
    {
        modelKey: 'webPath',
        modelType: 'a-input',
        label: '两边选择',

        addonSBefore: 'on',
        addonSBCfg: {},
        beforeModelKey: 'hType',
        defaultSBVal: 'h1',
        beforeOptions: [
            { label: 'http1://', value: 'h1' },
            { label: 'http2://', value: 'h2' },
        ],

        addonSAfter: 'on',
        addonSACfg: {},
        afterModelKey: 'comType',
        defaultSAVal: 'com',
        afterOptions:[
            { label: '.com', value: 'com' },
            { label: '.cn', value: 'cn' },
            { label: '.net', value: 'net' },
        ],
        // txtTips: ['中间是文本框','两边是选择'],
        
    },
    {
        modelKey: 'status',
        modelType: 'a-select',
        label: '单选状态',
        defaultVal: 'q3',
        options: [
            { label: '在群', value: 'q1' },
            { label: '离群', value: 'q2' },
            { label: '私1奔1111111111111111111111111111111111111111111111111111111111111111', value: 'q3' },
        ],
        // txtTips: ['我喜欢美少女战士2'],
        orgCfg: {},
    },
    // {
    //     modelKey: 'dayTime1',
    //     modelType: 'a-date-picker',
    //     label: '某天日期1',
    //     // defaultVal: '2022-05-06 10:54:25',
    //     defaultVal: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    //     orgCfg: {
    //         showTime: true,
    //         disabledDate: disabledDate1,
    //         disabledTime: disabledDateTime1,
    //         valueFormat: "YYYY-MM-DD HH:mm:ss",
    //     },
    // }
    {
        modelKey: 'dayTime2',
        modelType: 'a-date-picker',
        label: '某天日期2',
        // defaultVal: '2022-05-12 12:33:44',
        orgCfg: {
            showTime: true,
            // disabledDate: disabledDate,
            // disabledTime: disabledTime,
            valueFormat: "YYYY-MM-DD HH:mm:ss",
        },
    },
    {
        modelKey: 'timePeriod',
        modelType: 'a-range-picker',
        label: '日期段',
        defaultVal: [
            dayjs().format('YYYY-MM-DD HH:mm:ss'),
            dayjs(Date.now() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD HH:mm:ss'),
            // '2022-05-06 10:54:25',
            // '2022-06-06 12:34:44',
        ],
        orgCfg: {
            showTime: true,
            valueFormat: "YYYY-MM-DD HH:mm:ss",
            // "disabled-date": disabledDate,
        },
    },
    {
        modelKey: 'desc',
        modelType: 'a-textarea',
        label: '简介',
        defaultVal: '你是谁，我是谁，你是我的宝贝。我想娶老婆，谁愿意借给我啊啊啊啊啊，嗷嗷嗷嗷嗷~你是谁，我是谁，你是我的宝贝。我想娶老婆，谁愿意借给我啊啊啊啊啊，嗷嗷嗷嗷嗷~你是谁，我是谁，你是我的宝贝。我想娶老婆，谁愿意借给我啊啊啊啊啊，嗷嗷嗷嗷嗷~你是谁，我是谁，你是我的宝贝。我想娶老婆，谁愿意借给我啊啊啊啊啊，嗷嗷嗷嗷嗷~',
        orgCfg: {
            rows: 4,
            showCount: true,
            maxlength: 200,
        },
    },
]