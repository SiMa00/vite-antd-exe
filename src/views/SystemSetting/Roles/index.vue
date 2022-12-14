<template>
    <AutoForm
        name="roleListForm"
        :oneLine="true"
        :fixedCol="true"
        :queryButSpan="0"
        :allPerms="allPerms"
        :isSuperAdmin="isSuperAdmin"
        :formButtonList="formButtonList"
        v-model:pageCfg="pageCfg"
        v-model:formModel="formModel"
        v-model:formModelList="formModelList"
        @query-act="queryAct"
    />
    <AutoTable
        ref="myTable"
        :allPerms="allPerms"
        :isSuperAdmin="isSuperAdmin"
        :fetchData="fetchData"
        :tableColumns="tableColumns"
        :tableActions="tableActions"
        :cellEmptyFields="['remarks']"
        v-model:pageCfg="pageCfg"
    />
    <AutoModal
        :autoHeight="false"
        :modalCfg="modalCfg"
        :diagActType="diagActType"
        :diagChangedModel="diaFormModel"
        :diagInitFormModel="diagInitFormModel"
        v-bind="diaOrgCfg"
        v-model:visible="diaVisible"
    >
        <MenuDetails ref="myMenuFormRef" :act="diagActType" v-model:formModel="diaFormModel" />
    </AutoModal>
</template>
<script setup lang="ts">
import {
    isEmpty,
    downloadFile,
    sortRelationship,
} from "@/utils/tool"
import { roleTypeList, roleStatusList } from "@/utils/constant"
import {
    getSysMenusListAPI,
    getRoleListAPI,
    getRoleInfoAPI,
    deleteRoleAPI,
    modifyRoleAPI,
    exportRoleAPI,
    addRoleAPI,
} from "@/api/systemAPI"
import { message } from 'ant-design-vue'
import MenuDetails from "./MenuDetails.vue"
import { PlusOutlined, ExportOutlined } from '@ant-design/icons-vue'
import { useUserStore } from "@/stores/user"

const myMenuFormRef = ref()
const userStore = useUserStore()
const myTable = ref()

const formState = reactive({
    formModel: {},
    formModelList: [
        { modelKey: 'name', type: 'a-input', label: '角色名称', colSpan: 5, labelWidth: 70 },
        {
            modelKey: 'status',
            type: 'a-select',
            label: '角色状态',
            labelWidth: 70,
            colSpan: 5,
            options: roleStatusList,
        },
        {
            modelKey: 'type',
            type: 'a-select',
            label: '角色类型',
            labelWidth: 70,
            colSpan: 5,
            options: roleTypeList,
        },
        {
            modelKey: 'timeRange',
            type: 'a-range-picker',
            label: '创建时间',
            colSpan: 9,
            labelWidth: 70,
            orgCfg: {
                showTime: true,
                valueFormat: "YYYY-MM-DD HH:mm:ss",
            },
        },
    ],
})
const tableState = reactive({
    tableColumns: [
        { key: 'name', dataIndex: 'name', title: '角色名称', width: 200, ellipsis: true, fixed: 'left' },
        { key: 'code', dataIndex: 'code', title: '权限字符', width: 180, ellipsis: true },
        {
            key: 'statusStr',
            dataIndex: 'statusStr',
            title: '状态',
            width: 100,
        },
        {
            key: 'type',
            dataIndex: 'type',
            title: '角色类型',
            width: 130,
            options: roleTypeList,
        },
        { key: 'index', dataIndex: 'index', title: '排序', width: 200, ellipsis: true },
        { key: 'remarks', dataIndex: 'remarks', title: '备注', width: 200, ellipsis: true },
        { key: 'updaterName', dataIndex: 'updaterName', title: '操作人', width: 160, ellipsis: true },
        { key: 'createTime', dataIndex: 'createTime', title: '创建时间', width: 180 },
        { key: 'updateTime', dataIndex: 'updateTime', title: '更新时间', width: 180 },
        {
            key: "action",
            title: "操作",
            width: 120,
            fixed: 'right',
        },
    ],
    pageCfg: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
    },
})
const diaState = reactive({
    diaVisible: false,
    diaFormModel: {
        name: '',
        code: '',
        type: undefined,
        index: undefined,
        status: 0,
        menuIds: [],
        remarks: '',
    },
    diaOrgCfg: {
        title: '新增角色',
        width: 550,
    },
})

const modalCfgState = reactive({
    diagActType: 'add',
    diagInitFormModel: {},
})
const modalCfg = computed(() => ({
    formRef: myMenuFormRef.value && myMenuFormRef.value.myFormRef,
    tableRef: myTable,
    addMsg: '新增成功',
    modifyMsg: '修改成功',
    closeModal() {
        closeDia()
    },
    addOkHttp: async () => {
        return addRoleAPI(diaState.diaFormModel)
    },
    modifyOkHttp: async () => {
        return modifyRoleAPI(diaState.diaFormModel)
    },
}))

const allPerms = computed(() => userStore.operPermissions)
const isSuperAdmin = computed(() => userStore.isSuperAdmin)
const queryModel = computed(() => {
    const { name, status, timeRange, type } = formState.formModel
    const newObj = { name, status, type }
    if (timeRange && timeRange.length === 2) {
        newObj.startTime = timeRange[0]
        newObj.endTime = timeRange[1]
    }
    return newObj
})

const formButtonList = reactive([
    { key: 'add', label: '新增', clickEvt: addDiagClick, icon: PlusOutlined, orgCfg: { ghost: false }, ifShow: ['sys:role:add'] },
    {
        key: 'exp',
        label: '导出',
        clickEvt: exportClick,
        icon: ExportOutlined,
        ifShow: ['sys:role:exp'],
        orgCfg: { loading: false },
    },
])
const tableActions = [
    { key: 'modify', label: '修改', clickEvt: tableActClick, ifShow: ['sys:role:edit', 'sys:role:details'] },
    {
        key: 'delete-cud',
        label: '删除',
        cudTitle: '您确认要删除该角色吗?',
        clickEvt: tableActClick,
        ifShow: ['sys:role:del'],
    },
]

function addDiagClick() {
    modalCfgState.diagActType = 'add'
    diaState.diaOrgCfg.title = '新增角色'
    diaState.diaVisible = true
}
function queryAct() {
    myTable.value.queryTableData()
}
function closeDia() {
    diaState.diaVisible = false
    diaState.diaFormModel = {
        name: '',
        code: '',
        type: undefined,
        index: undefined,
        status: 0,
        menuIds: [],
        remarks: '',
    }
    diaState.diaOrgCfg.title = '新增角色'

    modalCfgState.diagActType = 'add'
    modalCfgState.diagInitFormModel = {}
}

async function exportClick() {
    formButtonList[1].orgCfg.loading = true

    const { name, status, type, timeRange } = formState.formModel
    const obj = { name, status, type }
    if (timeRange && timeRange.length === 2) {
        obj.startTime = timeRange[0]
        obj.endTime = timeRange[1]
    }

    const res = await exportRoleAPI(obj)
    formButtonList[1].orgCfg.loading = false
    if (res.isOk) {
        downloadFile(res.retData, `角色管理_${new Date().getTime()}`)
    }
}
async function fetchData() {
    const tm = tableState.pageCfg.pageNo - 1
    const page = tm >= 0 ? tm : 0

    const pms = {
        ...queryModel.value,
        page,
        size: tableState.pageCfg.pageSize,
    }
    const res = await getRoleListAPI(pms)
    const newRes = { isOk: false }
    if (res.isOk) {
        newRes.isOk = true
        newRes.retData = res.retData.content
        newRes.total = res.retData.totalElements
    }
    return newRes
}
async function tableActClick(act, row) {
    if (act === 'modify') {
        modalCfgState.diagActType = 'modify'
        const res = await getRoleInfoAPI(row.id)
        if (res.isOk) {
            diaState.diaFormModel = res.retData
            diaState.diaOrgCfg.title = '修改角色信息'
            diaState.diaVisible = true

            if (isEmpty(modalCfgState.diagInitFormModel)) {
                modalCfgState.diagInitFormModel = JSON.parse(JSON.stringify(res.retData))
            }
        }
    } else { // 删除
        const res = await deleteRoleAPI(row.id)
        if (res.isOk) {
            message.success('删除成功')
            myTable.value.queryTableData()
        }
    }
}
</script>
