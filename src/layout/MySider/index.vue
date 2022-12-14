<template>
  <div class="sider-body" id="mySiderBody">
    <a-menu
        theme="light"
        mode="inline"
        class="mysider-menu-body"
        :open-keys="openKeys"
        v-model:selectedKeys="selectedKeys"
        @click="clickMenuItem"
        @openChange="onOpenChange"
        v-if="isNotEmpty(menuListIn)"
    >
        <template v-for="item in menuListIn" :key="item.routeKey">
            <a-menu-item v-if="!item.children" :key="item.routeKey">
                <template #icon>
                    <span v-if="isFunc(item.icon)">
                        <component :is="item.icon" class="anticon-cmp" />
                    </span>
                    <span v-else >
                        <i :class="['iconfont18', item.icon]" ></i>
                    </span>
                </template>
                <span>{{ item.title }}</span>
            </a-menu-item>
            <MySubMenus
                v-else
                :menu-info="item"
            />
        </template>
    </a-menu>
    <div v-else class="sider-no-data">
        <div class="no-body">
            <exclamation-circle-outlined class="gticon" />
            <h2 class="tit1">暂无菜单权限</h2>
            <h4>请联系系统管理员</h4>
        </div>
    </div>

    <div class="switch-area centerXY" v-if="isNotEmpty(menuListIn)" :class="{expandSwitch: !collapsed}">
        <SiderSwitch class="sider-switch" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MySubMenus from './MySubMenus.vue'
import SiderSwitch from "./SiderSwitch.vue"
import { isNotEmpty, isFunc } from "@/utils/tool"
import myAntIcons from "@/utils/my-ant-Icons"
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import type { IObjAny } from "@/utils/types"
import { storeToRefs } from "pinia"
import { usePublicStore } from "@/stores/public"
import { useUserStore } from "@/stores/user"
import { dashMenuList, rootSubmenuKeys } from "./dashMenu";

const route = useRoute()
const router = useRouter()
const publicStore = usePublicStore()
const userStore = useUserStore()

const { collapsed } = storeToRefs(publicStore)
const state = reactive({
    selectedKeys: [route.path],
    openKeys: JSON.parse(localStorage.getItem('openKeys') || '[]'), // JSON.parse(localStorage.getItem('openKeys') || '[]'),
})

const menuListIn = dashMenuList // uSiderMenu // TODO 临时固定路由 3
// const menuListIn = computed(() => userStore.uSiderMenu) // uSiderMenu
const rootSubmenuKeysIn = computed(() => {
    if (menuListIn.value) {
        const rootSbKeys = menuListIn.value
        .filter(item => isNotEmpty(item.children))
        .map(it => it.routeKey)
        return rootSbKeys
    } else {
        return []
    }
})


function clickMenuItem(item:IObjAny) {
    if (item.key) {
        router.push(item.key)
    } 
}
function onOpenChange(openKeys:Array<string>) {
    const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key) === -1)
    if (rootSubmenuKeysIn.value.indexOf(latestOpenKey) === -1) {
        state.openKeys = openKeys
    } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : []
    }

    localStorage.setItem('openKeys', JSON.stringify(toRaw(state.openKeys)))
}

watch(route, (newV) => {
    state.selectedKeys = [newV.path]
})

const { selectedKeys, openKeys} = toRefs(state)

</script>

<style lang="less" >

@switchHt: 50px;

  .sider-body {
    height: 100%;
    position: relative;

    .mysider-menu-body {
        min-height: calc(100% - @switchHt);
        .anticon-cmp { // 使用 ant icon 时 与其他icon对齐样式的代码
            font-size: 20px!important;
            margin-left: -1px!important;
        }

        .ant-menu-item {
            .ant-menu-item-icon {
                // 修复 icon 不能与文字垂直对齐
                display: flex;
                align-items: center;
            }
        }
        .ant-menu-submenu > .ant-menu {
            background-color: rgb(255, 255, 255);
        }

        .ant-menu-inline {
            border: none;
            margin: 0;
            // 选中菜单状态 ant-menu-item-selected(先) 和 ant-menu-item-active(后) 先后顺序不能乱，否则点击菜单后 样式错乱
            .ant-menu-item-selected {
                border-right: 1px #1890ff solid;
            }
        }

        .ant-menu-inline-collapsed {

        }

        .ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left {
            border-right: none;
        }

    }

    .sider-no-data{
        height: 100%;
        // height: calc(100% - 50px);
        border-right: 1px solid #f0f0f0;
        text-align: center;
        .no-body {
            padding-top: 66%;
            .gticon {
                font-size: 50px;
                margin-bottom: 10px;
            }
        }
        .tit1 {
            margin-bottom: 0px;
        }
    }
    .switch-area {
        height: @switchHt;
        border-right: 1px solid #f0f0f0;
        .sider-switch {}
    }
    .expandSwitch {
        justify-content: flex-end!important;
        padding-right: 12px;
    }

  }
</style>
