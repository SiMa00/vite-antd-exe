<template>
    <a-button
        shape="circle"
        @click="toggleCollapsed"
        class="sider-swth-but"
        v-show="!isLessBkPoint"
    >
        <template #icon>
            <MenuFoldOutlined  v-show="!collapsed" />
            <MenuUnfoldOutlined  v-show="collapsed" />
        </template>
    </a-button>
</template>

<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { usePublicStore } from "@/stores/public"
import { storeToRefs } from "pinia"

const publicStore = usePublicStore()
const { collapsed, isLessBkPoint } = storeToRefs(publicStore)


function toggleCollapsed() {
    publicStore.SET_COLLAPSED(!collapsed.value)
}

</script>

<style lang="less">

.sider-swth-but {
    span {
        margin-left: 0px!important;
    }
}


</style>
