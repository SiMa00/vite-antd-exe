<template>
    <div class="TestReq-wrap">
        <a-button type="primary" @click="reptReq1" style="margin-right: 20px;">一次性取消重复请求</a-button>
        <a-button type="primary" @click="reptReq2" style="margin-right: 20px;">取消某个请求的重复请求</a-button>
        <a-button @click="controlErrMsg" style="margin-right: 20px;">请求错误弹框控制1次</a-button>
    </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import { getUserSelfAPI } from "@/api/userAPI"
import { getPlatformListAPI, addMenuAPI, getMenuInfoAPI, modifyMenuAPI } from "@/api/systemAPI"

async function reptReq1() {
    const res = await Promise.all([
        getUserSelfAPI(), 
        getUserSelfAPI(),
        getUserSelfAPI(),
        getUserSelfAPI(),
        getUserSelfAPI(),
        getUserSelfAPI(),
    ])
    console.log(res)
}
async function reptReq2() {
    const res = await Promise.all([
        getUserSelfAPI(), 
        getUserSelfAPI(),
        getUserSelfAPI(),
        getPlatformListAPI(),
        getPlatformListAPI(),
        getPlatformListAPI(),
    ])
}


async function controlErrMsg() {
    const res0 = await addMenuAPI({})
    message.success('This is a success message')
    const res1 = await getMenuInfoAPI('fff')
    message.success('This is a success message')
    const res2 = await modifyMenuAPI({})
    message.success('This is a success message')
    
    // console.log(res)
}
</script>

<style lang="less" scoped>

</style>