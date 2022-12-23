<template>
    <div class="TestReq-wrap">
        
        <AutoForm 
            ref="myAutoFormRef"
            :rules="fRules"
            :formMode="fState.formMode"
            v-model:formModel="fState.formModel"
            v-model:formModelList="fState.formModelList"
        ></AutoForm>
        <div>外部数据 {{ fState.formModel }}</div>
        <div class="example-but">
            <a-button class="but-item" danger @click="validForm(0)">清空校验结果</a-button>
            <a-button class="but-item" danger @click="validForm(1)">校验表单数据</a-button>
            
            <a-button class="but-item" danger @click="changeFormMode(EFormMode.EDIT)">
                {{'EDIT 模式'  }}
            </a-button>
            <a-button class="but-item" danger @click="changeFormMode(EFormMode.READ)">
                {{'FORM READ 模式'}}
            </a-button>
            <a-button class="but-item" danger @click="changeFormMode(EFormMode.LIST)">
                {{'FORM LIST 模式'}}
            </a-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import AutoForm from "@/components/AutoForm.vue"
import { myFormList } from "./formList"
import { EFormMode } from "@/components/form-type"

const myAutoFormRef = ref()
const fState = reactive({
    formModel: {},
    formModelList: myFormList,
    formMode: EFormMode.EDIT,
    isListMode: true,
})
const fRules = {
    name1: [
        { required: true, message: '请输入名称1', trigger: 'change' },
    ],
    name2: [
        { required: true, message: '请输入名称2', trigger: 'change' },
    ],
}


function changeFormMode(mode:EFormMode) {
    fState.formMode = mode
}

async function validForm(act:number) {
    if(act === 0) {
        myAutoFormRef.value.clearValid()
    } else {
        const res = await myAutoFormRef.value.validAutoForm()
    }
}

</script>

<style lang="less" scoped>


.example-but {
    margin: 20px 0;
    text-align: right;
    .but-item {
        margin-right: 20px;
        &:last-child{
            margin-right: 0px;
        }
    }
}
</style>