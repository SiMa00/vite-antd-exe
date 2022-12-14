<template>
    <div class="TestReq-wrap">
        <a-button type="primary" @click="reptReq1">一次性取消重复请求</a-button>
        <a-button type="primary" @click="reptReq2">取消某个请求的重复请求</a-button>
        <a-button @click="controlErrMsg">请求错误弹框控制1次</a-button>
    </div>
</template>

<script setup lang="ts">
import { getUserSelfAPI } from "@/api/userAPI"
import { getPlatformListAPI } from "@/api/systemAPI"

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