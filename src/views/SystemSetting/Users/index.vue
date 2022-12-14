<template>
    <AutoForm
        name="userListForm"
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
        class="auto-table"
        :allPerms="allPerms"
        :fetchData="fetchData"
        :queryModel="formModel"
        :formatResult="formatResult"
        :tableColumns="tableColumns"
        :tableActions="tableActions"
        :isSuperAdmin="isSuperAdmin"
        :cellEmptyFields="['phoneNo', 'email', 'remarks', 'creatorName']"
        v-model:pageCfg="pageCfg"
    />

    <!-- 新增 修改 用户  -->
    <AutoModal
        :autoHeight="true"
        :modalCfg="modalCfg"
        :diagMode="diagMode"
        :diagActType="diagActType"
        :diagChangedModel="modifyModel"
        :diagInitFormModel="diagInitFormModel"
        v-bind="diaOrgCfg"
        v-model:visible="diaVisible"
        @diagOk="modDiaOk"
    >
        <AutoForm
            ref="myAutoFormRef"
            name="useraddForm"
            v-model:formMode="diaFormMode"
            v-model:formModel="diaFormModel"
            v-model:formModelList="diaFormModelList"
            :alwaysNoButton="true"
            :rules="diaRules"
            :fItemFlexCfg="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
        />
    </AutoModal>

    <AutoModal
        diagMode="view"
        diagActType="view"
        :autoHeight="true"
        :modalCfg="modalCfgDT"
        v-bind="diaOrgCfgDT"
        v-model:visible="diaVisibleDT"
    >
        <div>
            <div class="view-p1">
                <span class="tit1">基本信息</span>
                <div class="view-but">
                    <a-button @click="butClick(0)" v-show="infoEdit" type="primary" ghost class="but-item">修改</a-button>
                    <a-button @click="butClick(1)" v-show="infoReset" type="primary" ghost class="but-item" danger>重置密码</a-button>
                </div>
            </div>

            <AutoForm
                name="userDTForm"
                formMode="formRead"
                readTitleMode="simple"
                :alwaysNoButton="true"
                :fItemFlexCfg="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8, xxxl: 8 }"
                v-model:formModel="diaFormModelDT"
                v-model:formModelList="diaFormModelListDT"
            />
            <div class="tit1 p2-tit">角色信息</div>
            <AutoTable
                :scrollCfg="{ y: 300 }"
                :tableData="roleVosData"
                :tableColumns="diaTableColCfgDT"
                :orgCfg="{ pagination: false }"
            />
        </div>
    </AutoModal>

    <MyModal
        v-model:visible="diaVisibleBD"
        v-bind="diaBDOrgCfg"
        @ok="handleDiaOkBD"
        @cancel="closeDiaBD"
    >
        <AutoForm
            name="userBdForm"
            v-model:formModel="diaFormModelBD"
            v-model:formModelList="diaFormModelListBD"
            :alwaysNoButton="true"
            :rules="diaRulesBD"
            :fItemFlexCfg="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
            ref="myBDFormRef"
        />
    </MyModal>

    <MyModal
        v-model:visible="diaVisibleRT"
        v-bind="diaRTOrgCfg"
        @ok="handleDiaOkRT"
        @cancel="closeDiaRT"
    >
        <AutoForm
            name="userRTForm"
            v-model:formModel="diaFormModelRT"
            v-model:formModelList="diaFormModelListRT"
            :alwaysNoButton="true"
            :rules="diaRulesRT"
            :fItemFlexCfg="{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }"
            ref="myRTFormRef"
        />
    </MyModal>
</template>
<script>
import {
    defineComponent,
    reactive,
    computed,
    nextTick,
    toRefs,
    watch,
    ref,
} from "vue"
import { useStore } from "vuex"
import {
    isEmpty,
    showModal,
    isNotEmpty,
    getArrObjKVs,
    downloadFile,
    handlePhnoSub,
    handlePhnoPlus,
    validateMyForm,
} from "@/utils"
import { roleStatusList, SUPER_ADMIN, certStatusList } from "@/utils/constant"
import { isPhoneCn, checkUserInfo, checkEmail } from "@/utils/validator"
import {
    addUserAPI,
    resetPwdAPI,
    exportUserAPI,
    deleteUserAPI,
    modifyUserAPI,
    getUserListAPI,
    getRoleListAPI,
    getUserInfoAPI,
    bindUserRolesAPI,
    getPlatformListAPI,
} from "@/api/systemAPI"
import { checkUserNPEAPI, recruitUserAPI } from "@/api/userAPI"
import { message } from 'ant-design-vue'
import { PlusOutlined, ExportOutlined } from '@ant-design/icons-vue'

export default defineComponent({
    name: "Users",
    props: [],
    emits: [],
    components: { PlusOutlined, ExportOutlined },
    setup() {
        const store = useStore()
        const myTable = ref()
        const myRTFormRef = ref()
        const myBDFormRef = ref()
        const myAutoFormRef = ref()

        const formState = reactive({
            formModel: {},
            formModelList: [
                { modelKey: 'platformId', type: 'a-select', label: '所属平台', options: [], colSpan: 7, labelWidth: 70 },
                { modelKey: 'username', type: 'a-input', label: '用户名称', colSpan: 6, labelWidth: 70 },
                {
                    modelKey: 'status',
                    type: 'a-select',
                    label: '用户状态',
                    labelWidth: 70,
                    colSpan: 5,
                    options: roleStatusList,
                },
                { modelKey: 'phoneNo', type: 'a-input', label: '手机号', colSpan: 6, labelWidth: 70 },
            ],
        })
        const tableState = reactive({
            tableColumns: [
                { key: 'username', dataIndex: 'username', title: '用户名称', width: 200, ellipsis: true, fixed: 'left' },
                { key: 'platformStrIn', dataIndex: 'platformStrIn', title: '所属平台', width: 240 },
                { key: 'status', dataIndex: 'status', title: '用户状态', width: 100, options: roleStatusList },
                { key: 'phoneNo', dataIndex: 'phoneNo', title: '手机号', width: 160, ellipsis: true },
                { key: 'email', dataIndex: 'email', title: '邮箱', width: 230, ellipsis: true },
                { key: 'certificationStatus', dataIndex: 'certificationStatus', options: certStatusList, title: '认证状态', width: 100 },
                { key: 'remarks', dataIndex: 'remarks', title: '备注', width: 200, ellipsis: true },
                { key: 'createTime', dataIndex: 'createTime', title: '创建时间', width: 180 },
                { key: 'updateTime', dataIndex: 'updateTime', title: '操作时间', width: 180 },
                { key: 'creatorName', dataIndex: 'creatorName', title: '操作人', width: 160, ellipsis: true },
                {
                    key: "action",
                    title: "操作",
                    width: 200,
                    fixed: 'right',
                },
            ],
            pageCfg: {
                pageNo: 1,
                pageSize: 10,
                total: 0,
            },
        })
        const modalCfgState = reactive({
            diagActType: 'add',
            diagMode: 'edit',
            diagInitFormModel: {},
        })
        const diaState = reactive({
            diaVisible: false,
            existedUserFlag: false,
            diaFormMode: 'edit',
            diaFormModel: {},
            diaOrgCfg: {
                title: '新增用户',
                cancelText: '取消',
                // centered: true,
            },
        })
        const diaBDState = reactive({
            diaVisibleBD: false,
            diaFormModelBD: {},
            diaFormModelListBD: [
                { modelKey: 'username', type: 'a-input', label: '用户名称', orgCfg: { disabled: true } },
                {
                    modelKey: 'roleIds',
                    type: 'a-select',
                    label: '角色',
                    options: [],
                    orgCfg: {
                        mode: "multiple",
                    },
                },
            ],
            diaRulesBD: {
                username: [{ required: true, message: '输入用户名称', trigger: 'change' }],
            },
            diaBDOrgCfg: { title: '绑定用户角色' },
        })
        const diaRTState = reactive({
            diaVisibleRT: false,
            diaFormModelRT: {},
            diaFormModelListRT: [
                { modelKey: 'username', type: 'a-input', label: '用户名称', orgCfg: { disabled: true } },
                { modelKey: 'password', type: 'a-input-password', label: '用户密码' },
                { modelKey: 'passwordCfr', type: 'a-input-password', label: '确认密码' },
            ],
            diaRulesRT: {
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'change' },
                    { pattern: /^[a-zA-Z0-9_.]{6,22}$/, message: '格式错误，支持6-22位数字、字母、下划线或组合', trigger: 'change' },
                ],
                passwordCfr: [
                    { required: true, message: '请输入确认密码', trigger: 'change' },
                    { validator: validatePass2, trigger: 'change' },
                ],
            },
            diaRTOrgCfg: { title: '重置用户密码' },
        })
        const diaDTState = reactive({
            diaVisibleDT: false,
            diaFormModelDT: {},
            diaFormModelListDT: [
                { modelKey: 'username', type: 'a-input', label: '用户名称' },
                { modelKey: 'platformStrIn', type: 'a-input', label: '所属平台' },
                { modelKey: 'phoneNo', type: 'a-input', label: '手机号' },
                { modelKey: 'email', type: 'a-input', label: '用户邮箱' },
                { modelKey: 'certificationStatus', options: certStatusList, type: 'a-select', label: '认证状态' },
                { modelKey: 'creatorName', type: 'a-input', label: '操作人' },
                { modelKey: 'updateTime', type: 'a-input', label: '操作时间' },
                { modelKey: 'remarks', type: 'a-input', label: '用户备注' },
            ],
            roleVosData: [],
            diaTableColCfgDT: [
                { key: 'name', dataIndex: 'name', title: '角色名称', width: 200 },
                { key: 'code', dataIndex: 'code', title: '权限字符', width: 160 },
                { key: 'statusStr', dataIndex: 'statusStr', title: '角色状态', width: 140 },
                { key: 'platformName', dataIndex: 'platformName', title: '所属平台', width: 200 },
            ],
            diaOrgCfgDT: {
                title: '用户详情',
                cancelText: ' ',
                width: 1000,
            },
            diaSelectRowDT: {},
        })
        let clkUser = reactive(store.state.user.userInfo)

        const allUserInfo = computed(() => store.state.user.userInfo)
        const modifyModel = computed(() => ({
            username: diaState.diaFormModel.username,
            status: diaState.diaFormModel.status,
            phoneNo: diaState.diaFormModel.phoneNo,
            email: diaState.diaFormModel.email,
            remarks: diaState.diaFormModel.remarks,
            id: diaState.diaFormModel.id,
        }))
        const modalCfg = computed(() => ({
            formRef: myAutoFormRef.value && myAutoFormRef.value.myFormRef,
            tableRef: myTable,
            addMsg: '新增成功',
            modifyMsg: '修改成功',
            closeModal() {
                closeDia()
            },
            addOkHttp: async () => {
                if (diaState.existedUserFlag) { // 用户名 存在
                    const { username, password } = diaState.diaFormModel
                    return recruitUserAPI({ username, password })
                } else {
                    const m = { ...diaState.diaFormModel }
                    if (isNotEmpty(m.phoneNo)) {
                        m.phoneNo = handlePhnoPlus(m.phoneNo)
                    }

                    return addUserAPI(m)
                }
            },
            modifyOkHttp: async () => {
                const m = { ...modifyModel.value }
                if (isNotEmpty(m.phoneNo)) {
                    m.phoneNo = handlePhnoPlus(m.phoneNo)
                }
                return modifyUserAPI(m)
            },
        }))
        const modalCfgDT = computed(() => ({
            closeModal() {
                closeDiaDT()
            },
        }))
        const diaRules = computed(() => {
            const rules0 = {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'change' },
                    { max: 100, message: '长度最大为100个字符', trigger: 'change' },
                    // { pattern: /^[a-zA-Z0-9_.]{4,15}$/, message: '格式错误，支持4-15位数字、字母、下划线或组合', trigger: 'change' },
                    // { validator: (rule, value) => (checkUserInfo(rule, value, clkUser, 'no')), trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'change' },
                    { pattern: /^[a-zA-Z0-9_]{6,22}$/, message: '格式错误，支持6-22位数字、字母、下划线或组合', trigger: 'change' },
                ],
                phoneNo: [
                    // { required: true, message: '请输入手机号', trigger: 'change' },
                    // { pattern: isPhoneCn, message: '请输入有效的电话号', trigger: 'change' },
                    { max: 20, message: '长度最大为20个字符', trigger: 'change' },
                    { validator: (rule, value) => (checkUserInfo(rule, value, clkUser, 'no')), trigger: 'blur' },
                ],
                email: [
                    // { required: true, message: '请输入邮箱', trigger: 'change' },
                    { validator: checkEmail, trigger: 'blur' },
                    { validator: (rule, value) => (checkUserInfo(rule, value, clkUser, 'no')), trigger: 'blur' },
                ],
                status: [
                    { required: true, message: '请选择用户状态', trigger: 'change' },
                ],
            }
            if (modalCfgState.diagActType === 'view') {
                return {}
            } else if (modalCfgState.diagActType === 'add') {
                return rules0
            } else if (modalCfgState.diagActType === 'modify') {
                rules0.password = {}
                rules0.username[2] = {}
                rules0.phoneNo[1] = { validator: (rule, value) => (checkUserInfo(rule, value, clkUser, 'yes')), trigger: 'blur' }
                rules0.email[1] = { validator: (rule, value) => (checkUserInfo(rule, value, clkUser, 'yes')), trigger: 'blur' }
                return rules0
            } else {
                return {}
            }
        })
        const diaFormModelList = computed(() => ([
            { modelKey: 'username', type: 'a-input', label: '用户名称', orgCfg: {} },
            {
                modelKey: 'password',
                type: 'a-input-password',
                label: '用户密码',
                ifShow: () => (modalCfgState.diagActType !== 'view' && modalCfgState.diagActType !== 'modify'),
            },
            { modelKey: 'phoneNo', type: 'a-input', label: '手机号', orgCfg: { prefix: '+86' }, ifShow: !diaState.existedUserFlag },
            { modelKey: 'email', type: 'a-input', label: '邮箱', orgCfg: {}, ifShow: !diaState.existedUserFlag },
            {
                modelKey: 'status',
                type: 'a-select',
                label: '用户状态',
                options: roleStatusList,
            },
            {
                modelKey: 'remarks',
                type: 'a-textarea',
                label: '备注',
                orgCfg: {
                    rows: 2,
                    showCount: true,
                    maxlength: 500,
                },
            },
        ]))


        const allPerms = computed(() => store.state.user.operPermissions)
        const isSuperAdmin = computed(() => store.getters['user/isSuperAdmin'])
        const infoEdit = computed(() => (getButShowFlag(diaDTState.diaSelectRowDT, 'sys:user:edit')))
        const infoReset = computed(() => (getButShowFlag(diaDTState.diaSelectRowDT, 'sys:user:resetpwd')))
        const tableActions = computed(() => ([
            {
                key: 'view',
                label: '详情',
                clickEvt: tableActClick,
                ifShow: ['sys:user:view'],
            },
            {
                key: 'modify',
                label: '修改',
                clickEvt: tableActClick,
                ifShow: (act, row) => (getButShowFlag(row, 'sys:user:edit')),
            },
            {
                key: 'bdRole',
                label: '绑定角色',
                clickEvt: tableActClick,
                ifShow: (act, row) => (getButShowFlag(row, 'sys:user:bdRole')),
            },
            {
                key: 'reset',
                label: '重置',
                clickEvt: tableActClick,
                ifShow: (act, row) => (getButShowFlag(row, 'sys:user:resetpwd')),
            },
            {
                key: 'delete-cud',
                label: '删除',
                cudTitle: '您确认要删除该用户吗?',
                clickEvt: tableActClick,
                ifShow: (act, row) => (getButShowFlag(row, 'sys:user:del')),
            },
        ]))
        const formButtonList = reactive([
            {
                key: 'add',
                label: '新增',
                clickEvt: addClick,
                icon: PlusOutlined,
                orgCfg: { ghost: false },
                ifShow: ['sys:user:add'],
            },
            {
                key: 'exp',
                label: '导出',
                clickEvt: exportClick,
                icon: ExportOutlined,
                ifShow: ['sys:user:exp'],
                orgCfg: { loading: false },
            },
        ])

        function getButShowFlag(row, codeStr) {
            if (isNotEmpty(row)) {
                return (
                    (
                        isSuperAdmin.value &&
                        row.platformKeysIn.includes(allUserInfo.value.platformId + '')
                    ) ||
                    (
                        !isSuperAdmin.value &&
                        allPerms.value.includes(codeStr) &&
                        (row.platformKeysIn.includes(allUserInfo.value.platformId + ''))
                    )
                )
            } else {
                return false
            }
        }
        function addClick() {
            clkUser = allUserInfo.value
            diaFormModelList.value[0].orgCfg.disabled = false
            diaState.diaFormMode = 'edit'
            diaState.diaOrgCfg.title = '新增用户'
            diaState.diaOrgCfg.cancelText = '取消'
            diaState.diaVisible = true

            modalCfgState.diagMode = 'edit'
            modalCfgState.diagActType = 'add'
            modalCfgState.diagInitFormModel = {}
        }
        function queryAct() {
            myTable.value.queryTableData()
        }
        // 新增 修改 用户 关闭弹框
        function closeDia() {
            diaState.existedUserFlag = false
            diaState.diaVisible = false
            diaState.diaFormModel = {}
            diaState.diaOrgCfg.title = '新增用户'

            modalCfgState.diagMode = 'edit'
            modalCfgState.diagActType = 'add'
            modalCfgState.diagInitFormModel = {}
        }
        function closeDiaBD() {
            diaBDState.diaVisibleBD = false
            diaBDState.diaFormModelBD = {}
        }
        function closeDiaDT() {
            diaDTState.diaVisibleDT = false
            diaDTState.diaFormModelDT = {}
            diaDTState.diaSelectRowDT = {}
        }
        function closeDiaRT() {
            diaRTState.diaVisibleRT = false
            diaRTState.diaFormModelRT = {}
        }
        function formatResult(arr0) {
            if (isNotEmpty(arr0)) {
                return arr0.map(item => ({
                    ...item,
                    platformStrIn: (
                        isNotEmpty(item.platforms) &&
                        (getArrObjKVs(item.platforms).labelsArr.join(', '))
                    ) || '--',
                    platformKeysIn: (isNotEmpty(item.platforms) && (getArrObjKVs(item.platforms).valuesArr)),
                }))
            } else {
                return []
            }
        }
        function butClick(act) {
            if (act === 0) {
                modifyAct(diaDTState.diaSelectRowDT)
            } else if (act > 0) {
                resetAct(diaDTState.diaSelectRowDT)
            } else {
                diaDTState.diaVisibleDT = false
            }
        }
        function modifyAct(row) {
            modalCfgState.diagMode = 'edit'
            modalCfgState.diagActType = 'modify'

            diaState.diaFormMode = 'edit'
            diaState.diaOrgCfg.title = '修改用户信息'
            diaState.diaOrgCfg.cancelText = '取消'
            diaState.diaVisible = true
            nextTick(() => {
                diaFormModelList.value[0].orgCfg.disabled = true
                const tmpObj = {
                    username: row.username,
                    status: row.status,
                    phoneNo: row.phoneNo === '--' ? '' : handlePhnoSub(row.phoneNo),
                    email: row.email === '--' ? '' : row.email,
                    remarks: row.remarks === '--' ? '' : row.remarks,
                    id: row.id,
                }
                diaState.diaFormModel = tmpObj

                if (isEmpty(modalCfgState.diagInitFormModel)) {
                    modalCfgState.diagInitFormModel = JSON.parse(JSON.stringify(tmpObj))
                }
            })
        }
        function resetAct(row) {
            diaRTState.diaVisibleRT = true
            nextTick(() => {
                diaRTState.diaFormModelRT = { id: row.id, username: row.username, password: '' }
            })
        }

        watch(() => diaState.diaFormModel.username, (newV) => {
            if (isNotEmpty(newV) && modalCfgState.diagActType === 'add') {
                setTimeout(async () => {
                    const res = await checkUserNPEAPI({ username: newV })
                    if (!res.isOk) {
                        diaState.existedUserFlag = true
                        diaState.diaFormModel.phoneNo = ''
                        diaState.diaFormModel.email = ''
                        showModal('用户已存在，请输入用户名密码添加用户')
                    } else {
                        diaState.existedUserFlag = false
                    }
                }, 500)
            } else {
                diaState.existedUserFlag = false
            }
        })

        async function validatePass2(rule, value) {
            if (value === '') {
                return Promise.reject(new Error('请输入确认密码'))
            } else if (value !== diaRTState.diaFormModelRT.password) {
                return Promise.reject(new Error('两次密码输入不一致!'))
            } else {
                return Promise.resolve()
            }
        }
        async function exportClick() {
            formButtonList[1].orgCfg.loading = true
            const res = await exportUserAPI(formState.formModel)
            formButtonList[1].orgCfg.loading = false
            if (res.isOk) {
                downloadFile(res.retData, `用户管理_${new Date().getTime()}`)
            }
        }
        async function modDiaOk(act) {
            if (act === 'modify' && diaDTState.diaVisibleDT) {
                const vRes = await getUserInfoAPI(diaDTState.diaSelectRowDT.id)
                if (vRes.isOk && isNotEmpty(vRes)) {
                    nextTick(() => {
                        const { certificationStatus, platformStrIn } = diaDTState.diaSelectRowDT
                        diaDTState.diaFormModelDT = { certificationStatus, platformStrIn, ...vRes.retData }
                    })
                }
            }
        }
        async function tableActClick(act, row) {
            if (act === 'view') {
                diaDTState.diaSelectRowDT = row
                clkUser = row
                diaDTState.diaOrgCfgDT.cancelText = ' '
                diaDTState.diaVisibleDT = true
                const vRes = await getUserInfoAPI(row.id)
                if (vRes.isOk && isNotEmpty(vRes)) {
                    nextTick(() => {
                        diaDTState.diaFormModelDT = { ...row, ...vRes.retData }
                        diaDTState.roleVosData = vRes.retData.roleVos
                    })
                }
            } else if (act === 'modify') {
                clkUser = row
                modifyAct(row)
            } else if (act === 'bdRole') {
                diaBDState.diaVisibleBD = true
                const uRes = await getUserInfoAPI(row.id)
                const rRes = await getAllRoles()
                if (uRes.isOk && isNotEmpty(rRes)) {
                    diaBDState.diaFormModelListBD[1].options = rRes.filter(item => (item.status === 0))
                    const myretData = uRes.retData
                    const tmp = { username: myretData.username, uid: myretData.id }
                    tmp.roleIds = myretData.roleVos.map(itm => (itm.id + ''))

                    nextTick(() => {
                        diaBDState.diaFormModelBD = tmp
                    })
                }
            } else if (act === 'reset') {
                resetAct(row)
            } else { // 删除
                deleteHttp(row.id)
            }
        }
        async function fetchData() {
            const tm = tableState.pageCfg.pageNo - 1
            const page = tm >= 0 ? tm : 0

            const pms = {
                ...formState.formModel,
                page,
                size: tableState.pageCfg.pageSize,
            }
            const res = await getUserListAPI(pms)
            const newRes = { isOk: false }
            if (res.isOk) {
                newRes.isOk = true
                newRes.retData = res.retData.content
                newRes.total = res.retData.totalElements
            }
            return newRes
        }
        async function deleteHttp(id) {
            diaState.diaOrgCfg.confirmLoading = true
            const res = await deleteUserAPI(id)
            diaState.diaOrgCfg.confirmLoading = false
            if (res.isOk) {
                message.success('删除成功')
                myTable.value.queryTableData()
            }
        }
        async function handleDiaOkBD() {
            const res = await validateMyForm(myBDFormRef.value.$refs.myFormRef)
            if (!res) {
                return false
            }

            const { uid, roleIds } = diaBDState.diaFormModelBD
            const res1 = await bindUserRolesAPI({ uid, roleIds })
            if (res1.isOk) {
                closeDiaBD()
                message.success('绑定成功')
                myTable.value.queryTableData()
            }
        }
        async function handleDiaOkRT() {
            const res = await validateMyForm(myRTFormRef.value.$refs.myFormRef)
            if (!res) {
                return false
            }

            const { id, password } = diaRTState.diaFormModelRT
            const res1 = await resetPwdAPI({ id, password })
            if (res1.isOk) {
                closeDiaRT()
                message.success('重置成功')
                myTable.value.queryTableData()
            }
        }
        async function getAllRoles () {
            const res = await getRoleListAPI({ page: 0, size: 1000 })
            if (res.isOk) {
                const arr2 = res.retData.content.map(item => ({
                    ...item,
                    value: item.id + '',
                    label: item.name,
                }))
                return arr2
            }
        }
        async function getPlatList() {
            const res = await getPlatformListAPI()
            if (res.isOk) {
                formState.formModelList[0].options = res.retData.map(item => ({ label: item.val, value: item.key }))
            }
        }

        getPlatList()


        return {
            myTable,
            infoEdit,
            modalCfg,
            allPerms,
            diaRules,
            infoReset,
            modalCfgDT,
            modifyModel,
            myRTFormRef,
            myBDFormRef,
            isSuperAdmin,
            tableActions,
            myAutoFormRef,
            formButtonList,
            diaFormModelList,
            ...toRefs(diaState),
            ...toRefs(formState),
            ...toRefs(tableState),
            ...toRefs(diaRTState),
            ...toRefs(diaDTState),
            ...toRefs(diaBDState),
            ...toRefs(modalCfgState),
            modDiaOk,
            queryAct,
            closeDia,
            butClick,
            fetchData,
            closeDiaBD,
            closeDiaRT,
            closeDiaDT,
            formatResult,
            handleDiaOkRT,
            handleDiaOkBD,
        }
    },
})
</script>

<style lang="less" scoped>

.tit1 {

    font-weight: bold;
    font-size: 15px;

}
.auto-table {
    width: 99.5%;
}
.view-p1{
    display: flex;
    justify-content: space-between;
    .view-but {
        .but-item {
            margin-left: 15px;
        }
    }
}

.p2-tit {
    margin-top: 20px;
}
</style>
