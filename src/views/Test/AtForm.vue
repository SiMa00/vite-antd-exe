<template>
    <div class="TestReq-wrap">
        AtForm
        <a-button type="primary" @click="reptReq">一次性取消重复请求</a-button>
        <a-button @click="controlErrMsg">请求错误弹框控制1次</a-button>
    </div>
</template>

<script setup lang="ts">
import { getUserSelfAPI } from "@/api/userAPI"
async function reptReq() {
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
async function controlErrMsg() {
    // const res = await Promise.all([
    //     getUserSelfAPI(), 
    //     getUserSelfAPI(),
    //     getUserSelfAPI(),
    //     getUserSelfAPI(),
    //     getUserSelfAPI(),
    //     getUserSelfAPI(),
    // ])
    // console.log(res)
}
</script>

<style lang="less" scoped>

</style>