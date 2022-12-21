<template>
    <div class="MenuDetails-wrap">
        <a-form
            name="roleDetailForm"
            ref="myFormRef"
            :model="formModelIn"
            :rules="diaRules"
            v-bind="formDefaultCfg"
            autocomplete="off"
        >
            <a-form-item label="角色名称" name="name" validateFirst>
                <a-input v-model:value="formModelIn.name" :disabled="isReadMode" allowClear placeholder="请输入角色名称" />
            </a-form-item>
            <a-form-item label="权限字符" name="code" validateFirst>
                <a-input v-model:value="formModelIn.code" :disabled="act !== 'add'" allowClear placeholder="请输入权限字符" />
            </a-form-item>
            <a-form-item label="角色类型" name="type" validateFirst>
                <a-select v-model:value="formModelIn.type" :disabled="isReadMode" :options="roleTypeList" placeholder="请选择角色类型"></a-select>
            </a-form-item>
            <a-form-item label="角色顺序" name="index" validateFirst>
                <a-input-number v-model:value="formModelIn.index" :disabled="isReadMode" placeholder="请输入角色顺序" :min="0" :max="999999999" style="width: 100%;"/>
            </a-form-item>
            <a-form-item label="角色状态" name="status" validateFirst>
                <a-radio-group v-model:value="formModelIn.status" :disabled="isReadMode" :options="roleStatusList" placeholder="请选择角色状态"></a-radio-group>
            </a-form-item>

            <a-form-item label="菜单权限" name="menuIds" validateFirst>
                <CheckedTree
                    v-model:value="formModelIn.menuIds"
                    v-model:expandedKeys="expandedKeys"
                    :treeData='menuTreeData'
                    :isReadMode='isReadMode'
                />
            </a-form-item>
            <a-form-item label="备注" name="remarks" validateFirst>
                <a-textarea
                    v-model:value="formModelIn.remarks"
                    :disabled="isReadMode"
                    :rows="3"
                    showCount
                    :maxlength="500"
                    :placeholder="isReadMode ? '' : '请输入备注'"
                />
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
import {
    defineComponent,
    computed,
    toRef,
    ref,
} from 'vue'
import { isNotEmpty, generateMenuRoutes } from "@/utils"
import { useStore } from "vuex"
import { roleStatusList, roleTypeList } from "@/utils/constant"
import { getRoleListAPI } from "@/api/systemAPI"
export default defineComponent({
    name: "MenuDetails",
    props: ['formModel', 'act'],
    emits: ['update:formModel'],
    components: {},
    setup(props, ctx) {
        const myFormRef = ref()
        const formModel0 = toRef(props, 'formModel')
        const store = useStore()

        const rolename = formModel0.value.name
        const formModelIn = computed({
            get() {
                return formModel0.value
            },
            set(v) {
                ctx.emit('update:formModel', v)
            },
        })
        const expandedKeys = ref([])
        const isReadMode = computed(() => props.act === 'view')
        const menuTreeData = computed(() => {
            if (props.act === 'view') {
                if (isNotEmpty(formModel0.value.menuIds)) {
                    const arr = formModel0.value.menuIds.map(id => {
                        return store.state.user.allMenus.find(item => item.id === id)
                    })
                    const { userMenus } = generateMenuRoutes(arr)
                    return userMenus
                } else {
                    return []
                }
            } else {
                return store.state.user.uAllMenus
            }
        })

        const diaRules = {
            name: [
                { required: true, message: '请输入角色名称', trigger: 'change' },
                { max: 500, message: '长度最大为500个字符', trigger: 'change' },
                { validator: checkRoleName, trigger: 'blur' },
            ],
            code: [
                { required: true, message: '请输入权限字符', trigger: 'change' },
                { pattern: /^[0-9a-zA-Z-_]+$/, message: '只能输入数字、大小写字母、-、_，最多20位', trigger: 'change' },
                { max: 20, message: '长度最大为20个字符', trigger: 'change' },
            ],
            type: [
                { required: true, message: '请选择角色类型', trigger: 'change' },
            ],
            index: [
                { required: true, message: '请输入角色顺序', trigger: 'change' },
                { pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'change' },
            ],
            menuIds: [
                { required: true, message: '请选择菜单权限', trigger: 'change' },
            ],
        }

        const formDefaultCfg = {
            labelAlign: 'right',
            colon: false,
            labelCol: {
                style: { width: '80px' },
            },
            wrapperCol: {},
            validateOnRuleChange: false,
            scrollToFirstError: false,
        }

        async function checkRoleName(rule, value, callback) {
            if (isNotEmpty(value) && formModelIn.value.name !== rolename) {
                const res = await getRoleListAPI({ name: value, page: 0, size: 5000 })
                if (res.isOk && isNotEmpty(res.retData.content)) {
                    const idx = res.retData.content.findIndex(item => item.name === value.trim())
                    if (idx > -1) {
                        return Promise.reject(new Error('角色名称已存在'))
                    } else {
                        return Promise.resolve()
                    }

                } else {
                    return Promise.resolve()
                }
            } else {
                return Promise.resolve()
            }

        }


        return {
            diaRules,
            myFormRef,
            formModelIn,
            menuTreeData,
            expandedKeys,
            roleTypeList,
            roleStatusList,
            formDefaultCfg,
        }
    },
})
</script>

<style lang="less" scoped>

.MenuDetails-wrap {
    .m-tree {
        border: 1px solid #d9d9d9;
        border-radius: 2px;
    }

    .logo-tit {
        font-size: 14px;
        margin-top: 5px;
        margin-bottom: 2px;
    }

    .icon-but {
        border: 0!important;
        padding: 0!important;
        margin-right: 5px;
        margin-bottom: 5px;
        span {
            font-size: 19px;
            transition: transform 0.3s;
            transform: scale(1);

            &:hover {
                transform: scale(1.4);
            }
        }
    }

    .ipt-show-icon {
        font-size: 16px;
        margin-right: 5px;
    }
    .icon16 {
        font-size: 14px;
        margin-right: 5px;
    }

}

</style>
