<template>
    <a-form
        class="auto-form-wrapper"
        ref="AuToFormRef"
        :model="formModel"
        :rules="rulesIn"
        :name="formName"
        :class="{
            'form-no-border': true,
            'read-form': isFormRead,
        }"
        v-bind="formOtherCfg"
        @finish="handleSucFinish"
        @finishFailed="handleFailFinish"
    >
        <a-row :gutter="gutter" class="auto-row">
            <template v-for="fItem in fModelListIn" :key="fItem.modelKey">
                <a-col
                    :xs="fItemFixed ? null : fItemFlexCfg && fItemFlexCfg.xs"
                    :sm="fItemFixed ? null : fItemFlexCfg && fItemFlexCfg.sm"
                    :md="fItemFixed ? null : fItemFlexCfg && fItemFlexCfg.md"
                    :lg="fItemFixed ? null : fItemFlexCfg && fItemFlexCfg.lg"
                    :xl="fItemFixed ? null : fItemFlexCfg && fItemFlexCfg.xl"
                    :xxl="fItemFixed ? null : fItemFlexCfg && fItemFlexCfg.xxl"
                    :xxxl="fItemFixed ? null : fItemFlexCfg && fItemFlexCfg.xxxl"
                    :span="fItemFixed ? (fItem.colSpan || fItemFixedSpan) : null"
                    
                    :style="fItem.style"
                    class="auto-row-col"
                >
                    <!-- 日期的 title 需要特殊处理 -->
                    <a-form-item
                        class="fItem-body"
                        :validateFirst="validateFirst"
                        :name="fItem.modelKey"
                        :label-col="fItem.labelWidth ? { style: { width: fItem.labelWidth + 'px' } } : null"
                        :title="fItem.modelType.includes('picker') ? formModel[fItem.modelKey] :  null"
                        :class="{ 'fItem-body-read': isFormRead, 'fItem-body-list': isFormList }"
                    >   
                        <template #label>
                            <component v-if="isFormRead && fItem.labelIcon" :is="fItem.labelIcon" class="label-cmp-icon" />
                            <span
                                class="fItem-label-txt too-much"
                                :title="fItem.label"
                                :class="{'fItem-label-bold': isFormRead && readTitleMode === 'bold'}"
                            >{{ fItem.label }}</span>
                        </template>

                        <!-- formRead 特殊的情况 1: 为空时 -->
                        <template v-if="isFormRead && isEmpty(formModel[fItem.modelKey])">
                            <span class="read-empty-txt">{{ readEmptyTxt }}</span>
                        </template>
                        <!-- formRead 特殊的情况 2: input 和 input-number 带前后缀 统一展示 -->
                        <template
                            v-else-if="isFormRead &&
                                (
                                    fItem.modelType.includes('a-input') &&
                                    (fItem.orgCfg!.prefix || fItem.orgCfg!.suffix)
                                )
                            "
                        >
                            <span class="read-psfix-wrap too-much" :title="formModel[fItem.modelKey] + ''">
                                <span v-if="fItem.orgCfg && fItem.orgCfg.prefix" class="item-prefix">{{fItem.orgCfg.prefix}}</span>
                                <span class="too-much">{{formModel[fItem.modelKey]}}</span>
                                <span v-if="fItem.orgCfg && fItem.orgCfg.suffix" class="item-suffix">{{fItem.orgCfg.suffix}}</span>
                            </span>
                        </template>
                        <!-- formRead 特殊的情况 3: input 框前后配置 选择框 READ 时; 必须要用到 formModel，不方便在 getFormReadMList 里设置-->
                        <template v-else-if="isFormRead && (fItem.addonSBefore === 'on' || fItem.addonSAfter === 'on')">
                            <span class="read-psfix-wrap too-much">
                                <span v-if="fItem.beforeModelKey && formModel[fItem.beforeModelKey]" class="item-prefix">
                                    {{
                                        (
                                            isNotEmpty(fItem.beforeOptions) && 
                                            list2Map(fItem.beforeOptions!)[formModel[fItem.beforeModelKey] as string].label 
                                        ) || ''
                                    }}
                                </span>
                                <span>{{ formModel[fItem.modelKey] }}</span>
                                <span v-if="fItem.afterModelKey && formModel[fItem.afterModelKey]" class="item-suffix">
                                    {{ 
                                        fItem.afterOptions &&
                                        list2Map(fItem.afterOptions)[formModel[fItem.afterModelKey] as string].label 
                                    }}
                                </span>
                            </span>
                        </template>

                        <template v-else>
                            <component
                                :title="fItem.modelType.includes('a-input') ? formModel[fItem.modelKey] : null"
                                class="fItem-cmp"
                                :class="{
                                    'read-cmp': isFormRead,
                                    'cmp-not-select-raido':
                                            isFormRead &&
                                            fItem.modelType !== 'a-select' &&
                                            fItem.modelType !=='a-radio-group'
                                }"
                                :allowClear="isEmpty(fItem.allowClear) ? true : fItem.allowClear"
                                :is="fItem.modelType"
                                v-bind="fItem.orgCfg ? fItem.orgCfg : {}"
                                v-model:value="formModel[fItem.modelKey]"
                                :options="fItem.options ? fItem.options : null"
                                :placeholder="handlePlaceholder(fItem)"
                                :not-found-content="fItem.fetchLoading ? undefined : null"
                                @change="fItem.change"
                                @search="fItem.search"
                            >
                                <template v-if="fItem.fetchLoading" #notFoundContent ><a-spin size="small" /></template>
                                <!-- 只读模式下的 select处理 -->
                                <template v-if="isFormRead && fItem.modelType === 'a-select'" #maxTagPlaceholder="omittedValues">
                                    <a-popover placement="bottom" >
                                        <template #content>
                                            <div style="max-width: 230px;">
                                                <template v-for="tag in fItem.options" :key="tag.value">
                                                    <a-tag
                                                        class="select-read-tag too-much" 
                                                        :title="tag.label" 
                                                        :color="getFixedRandomColor()"
                                                    >{{ tag.label }}</a-tag>
                                                </template>
                                            </div>
                                        </template>
                                        <template #title><span>{{ fItem.label }}</span></template>
                                        <span>+ {{ omittedValues.length }} ...</span>
                                    </a-popover>
                                </template>
                                <!-- input 框前后配置 选择框 EDIT 时-->
                                <template v-if="fItem.beforeModelKey && fItem.modelType ==='a-input' && fItem.addonSBefore === 'on'" #addonBefore>
                                    <a-select
                                        v-bind="fItem.addonSBCfg"
                                        v-model:value="formModel[fItem.beforeModelKey!]"
                                        :options="fItem.beforeOptions ? fItem.beforeOptions : []"
                                    ></a-select>
                                </template>
                                <template v-if="fItem.afterModelKey && fItem.modelType ==='a-input' && fItem.addonSAfter === 'on'" #addonAfter>
                                    <a-select
                                        v-bind="fItem.addonSACfg"
                                        v-model:value="formModel[fItem.afterModelKey!]"
                                        :options="fItem.afterOptions ? fItem.afterOptions : []"
                                    ></a-select>
                                </template>
                            </component>
                            <div v-if="isNotEmpty(fItem.txtTips)" class="form-item-tip">
                                <div class="note-header"><InfoCircleOutlined /></div>
                                <div class="item-tip-wrap">
                                    <template v-for="(tTip, i) in fItem.txtTips" :key="tTip">
                                        <div v-if="fItem.txtTips && fItem.txtTips.length === 1">{{tTip}}</div>
                                        <div v-else>{{i+1}}&nbsp;{{tTip}}</div>
                                    </template>
                                </div>
                            </div>
                        </template>
                    </a-form-item>
                </a-col>
            </template>
        </a-row>
    </a-form>

</template>

<script setup lang="ts">
import { cloneDeep, get } from "lodash"
import { isEmpty, isNotEmpty, validateMyForm, list2ObjAttr2, list2Map, isArray, isNumber, isString, } from "@/utils/tool"
import type { IObj, IBaseObj, IObjAny, TBaseValNull, IBaseObjNull, TBaseNull, IFormButton, IFormListItem } from "./form-type"
import { DoubleRightOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'
import type { FormInstance, FormProps } from "ant-design-vue"
import type { Rule } from "ant-design-vue/lib/form/interface"
import { EFormMode } from "./form-type"

const emits = defineEmits<{
    (e: 'query-act', actType: 'suc'|'reset'|'fail', data: TBaseValNull|IObjAny): void;
    (e: 'update:formModel', data: IBaseObjNull): void;
}>()
interface IFormProps {
    formModel: IBaseObjNull;
    formModelList: Array<IFormListItem>;
    formMode?: EFormMode; // 表单模式
    readTitleMode?: 'simple'|'bold'; // 表单只读模式下，label title的粗细模式
    formButtonList?: Array<IFormButton>;
    formOrgCfg?: FormProps; // 表单 官方配置
    rules?: Rule;
    pageCfg?: { [propName: string]: number }; // Page字段值
    pageFieldsCfg?: { PageNum: string, PageSize: string, Total: string }; // Page字段名
    // 表单元素 自适应模式配置
    fItemFlexCfg?: { xs: number, sm: number, md: number, lg: number, xl: number, xxl: number, xxxl: number };
    gutter?: number;
    formName?: string;
    placeholderType?: 'plz'|'label'|'all';
    labelWidth?: string;
    labelPosition?: string;
    readEmptyTxt?: string; // 只读模式 值为空时，显示的文本

    validateFirst?: boolean;
    fItemFixed?: boolean; // 是否固定 表单form 的元素
    fItemFixedSpan?: number; // 传给defineProps的泛型是一个外部导入的类型，会报错，目前暂不支持外部导入类型为参数;官网有说明
}
const {
    formModel = {},
    formModelList = [],
    formMode = EFormMode.EDIT,
    readTitleMode = 'simple',
    formButtonList = [],
    formOrgCfg = {},
    rules = {},
    pageCfg = {},
    pageFieldsCfg = { PageNum: 'pageNum', PageSize: 'pageSize', Total: 'total' },
    fItemFlexCfg = { xs: 12, sm: 12, md: 12, lg: 12, xl: 8, xxl: 6, xxxl: 6 },
    gutter = 40,
    formName = `auto-form-${Date.now()}`,
    placeholderType = 'label',
    labelWidth = '80px',
    labelPosition = 'right',
    readEmptyTxt = '----',
    validateFirst = true,
    fItemFixed = false, 
    fItemFixedSpan = 6,
} = defineProps<IFormProps>();


const AuToFormRef = ref()
const isFormRead = computed(() => formMode === EFormMode.READ)
const isFormList = computed(() => formMode === EFormMode.LIST)
const rulesIn = computed(() => ((isFormRead.value || isFormList.value) ? {} : rules))
const fModelListIn = computed(() => isFormRead.value ? getFormReadMList() : formModelList )

watch($$(formMode), newV => {
    if (newV === EFormMode.READ || newV === EFormMode.LIST) clearValid()
})
onMounted(() => {
    const newFormModel = list2ObjAttr2(formModelList, {}, 'modelKey')
    emits('update:formModel', newFormModel) // 
})


const formDefaultCfg = {
    labelAlign: labelPosition,
    colon: false,
    labelCol: {
        style: { width: labelWidth },
    },
    wrapperCol: {
        // span: 16,
    },
    validateOnRuleChange: false, // 是否在 rules 属性改变后立即触发一次验证
    scrollToFirstError: false, // 提交失败自动滚动到第一个错误字段
}
const formOtherCfg = computed(() => (Object.assign({}, formDefaultCfg, formOrgCfg)))


// 提交表单且数据验证成功后回调事件
function handleSucFinish(values:IObj) {
    // resetPageCfg()
    emits('query-act', 'suc', values)
}
// 提交表单且数据验证失败后回调事件
function handleFailFinish(values:{}) {
    // resetPageCfg()
    emits('query-act', 'fail', values)
}
function handleColShow() {
    
}
function handlePlaceholder(formItem:IFormListItem) {
    let holder:string|undefined|Array<string|undefined> = ''
    if (formItem.placeholder) {
        holder = formItem.placeholder
    } else {
        const iptHolder = '请输入'
        const selectHolder = '请选择'
        if (placeholderType === 'all') {
            holder = formItem.modelType === 'a-input'
                ? iptHolder + formItem.label
                : formItem.modelType === 'a-select'
                    ? selectHolder + formItem.label
                    : undefined // undefined 时会显示 ui库的默认holder
        } else if (placeholderType === 'plz') {
            holder = formItem.modelType === 'a-input'
                ? iptHolder
                : formItem.modelType === 'a-select'
                    ? selectHolder
                    : undefined
        } else {
            holder = formItem.modelType !== 'a-input' && formItem.modelType !== 'a-select'
                ? undefined
                : formItem.label
        }
    }
    return holder
}
// 设置 只读模式下的展示样式，不model数据操作
function getFormReadMList() {
    // const arr0 = fModelList0.value // 注意 此时父组件的 数据也会变化
    const arr0 = cloneDeep(formModelList)
    for (let idx = 0; idx < arr0.length; idx++) {
        const element = arr0[idx]
        element.txtTips = []
        element.placeholder = ' '

        if (element.orgCfg) {
            element.orgCfg.disabled = true
            element.orgCfg.bordered = false
            if (element.modelType === 'a-select') {
                element.orgCfg.showArrow = false
            }
        } else {
            const obj: IObj = {
                disabled: true,
                bordered: false,
            }
            if (element.modelType === 'a-select') {
                obj.showArrow = false
            }
            element.orgCfg = obj
        }

        // input 和 input-number 带前后缀 统一字段 prefix suffix
        if (element.modelType === 'a-input-number') {
            element.orgCfg!.prefix = element.orgCfg.addonBefore
            element.orgCfg!.suffix = element.orgCfg.addonAfter
        }
        if (element.modelType === 'a-date-picker') {
            element.orgCfg!.suffixIcon = ' '
        }
        if (element.modelType === 'a-range-picker') {
            element.orgCfg!.suffixIcon = ' '
            element.placeholder = []
        }
        // 注意：checkbox 使用 select 多选模式展示
        if (element.modelType === 'a-checkbox-group') {
            element.modelType = 'a-select'
            element.orgCfg = {
                ...element.orgCfg,
                mode: 'multiple',
                maxTagCount: element.orgCfg!.maxTagCount || 2,
                maxTagTextLength: element.orgCfg!.maxTagTextLength || 10,
            }
        }

        if (isNotEmpty(element.options)) {
            const fieldVal:TBaseNull|Array<TBaseNull> = formModel[element.modelKey]
            if (isArray(fieldVal)) {
                const temFdVal:Array<TBaseNull> = fieldVal as Array<TBaseNull> // 不然会报错 fieldVal 不存在 includes方法
                if (isNotEmpty(temFdVal)) {
                    element.options = element.options!.filter(item => (temFdVal.includes(item.value)))
                } else {
                    element.options = []
                }
            } else {
                element.options = element.options!.filter(item => fieldVal === item.value)
            }
        }
    }

    console.log('ReadMList', arr0);
    return arr0
}
function getFixedRandomColor() {
    const FIXED_COLOR = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple']
    const i = Math.floor(Math.random() * (6 + 1))
    return FIXED_COLOR[i]
}

// 校验
function clearValid() {
    AuToFormRef.value.clearValidate()
}
async function validAutoForm() {
    return await validateMyForm(AuToFormRef.value)
}


defineExpose({
    validAutoForm,
    clearValid,
    // AuToFormRef,
})

</script>

<style lang="less" scoped>
@disableFontColor: rgb(79, 68, 65);
@lineLVpad: 4px; // label 和 value 之间额外的 padding

.auto-form-wrapper {
    .auto-row {
        .auto-row-col {
            // 禁用样式重写 1
            ::v-deep(.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
                color: @disableFontColor!important;
            }
            .fItem-body {
                // label 样式
                .label-cmp-icon {
                    font-size: 16px;
                    margin-right: 4px;
                }
                .fItem-label-txt {
                    display: inline-block;
                }
                .fItem-label-bold {
                    font-weight: bold;
                }

                // 前后缀
                .read-psfix-wrap {
                    display: flex;
                    padding: 0 0 0 @lineLVpad; // read 垂直时对齐
                    .item-prefix {
                        padding-right: 5px;
                    }
                    .item-suffix {
                        padding-left: 5px;
                    }
                }
                // 空 文本
                .read-empty-txt {
                    padding: 0 0 0 @lineLVpad;
                    font-family: initial;
                }


                // component 公共样式
                ::v-deep(.fItem-cmp) {
                    width: 100%!important;

                    // 框内值省略
                    input {
                        .too-much-in(); // 框内值省略
                    }
                    .ant-picker-input {
                        input {
                            .too-much-in(); // 框内值省略
                        }
                    }
                    
                    // 禁用样式重写 2
                    .ant-picker-input > input[disabled] {
                        color: @disableFontColor!important;
                    }
                    .ant-input[disabled] {
                        color: @disableFontColor!important;
                    }
                }
                // component 只读时的样式
                ::v-deep(.read-cmp) {
                    label {
                        .ant-radio, .ant-checkbox {
                            display: none;
                        }
                        span {
                            color: rgb(81, 70, 67);
                            padding: 0 0 0 @lineLVpad;
                        }
                    }
                    .ant-select-selector {
                        padding: 0 0 0 @lineLVpad;
                    }
                    .ant-input-suffix {
                        margin-left: 0px; // read 垂直时对齐
                        .ant-input-show-count-suffix {
                            display: none;
                        }
                        .ant-input-clear-icon-hidden {
                            display: none;
                        }
                    }
                    textarea {
                        padding: 0 0 0 @lineLVpad;
                        margin-top: 3px;
                        resize: none;
                    }
                }
                ::v-deep(.cmp-not-select-raido) {
                    padding: 0 0 0 @lineLVpad;
                }

                // tip txt 样式
                .form-item-tip{
                    display: flex;
                    .note-header {
                        color: rgba(135, 131, 131, 0.969);
                        font-size: 13px;
                        margin-right: 4px;
                    }
                    .item-tip-wrap {
                        color: rgba(135, 131, 131, 0.969);
                        font-size: 12px;
                        line-height: 16px;
                        margin-top: 2px;
                    }
                }
            }
            .fItem-body-read {
                margin-bottom: 0px!important;
            }
            .fItem-body-list {
                margin-bottom: 12px!important;
            }
        }
    }

}

// 必须放在 外面 不能放在 auto-form-wrapper里，因为 popover 是挂在 body下
.select-read-tag {
    max-width: 80px;
}

// 混合名后面加上() 不带输出的混合，即 自己不会被单独生成样式
.too-much-in () {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>