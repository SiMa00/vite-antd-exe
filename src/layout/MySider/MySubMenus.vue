<template>
    <a-sub-menu :key="menuInfo.routeKey">
        <template #icon>
            <span v-if="isFunc(menuInfo.icon)">
                <component :is="menuInfo.icon" class="anticon-cmp" />
            </span>
            <span v-else >
                <i :class="['iconfont18', menuInfo.icon]" ></i>
            </span>
        </template>
        <template #title>{{ menuInfo.title }}</template>

        <template v-for="item in menuInfo.children" :key="item.routeKey">
            <a-menu-item v-if="!item.children" :key="item.routeKey">
                <!-- <template #icon>
                    <PieChartOutlined />
                </template> -->
                <span class="sub-in-item-tit">{{ item.title }}</span>
            </a-menu-item>
            <MySubMenus v-else :menu-info="item" />
        </template>
    </a-sub-menu>
</template>

<script setup lang="ts">
// import { PieChartOutlined } from '@ant-design/icons-vue'
import { isNotEmpty, isFunc } from "@/utils/tool"
import myAntIcons from "@/utils/my-ant-Icons"
import type { IObjAny } from "@/utils/types"

interface Props {
    menuInfo: IObjAny;
}
const { menuInfo } = defineProps<Props>()

</script>

<style lang="less" scoped >

@fontSizeM1: 18px; // 1 级菜单展开时 Icon

.siderMenuOpenIcon{
  font-size: @fontSizeM1!important;
}
.siderMenuClosedIcon{
  width:100%!important;
  font-size: @fontSizeM1!important;
}

.sub-in-item-tit {
    margin-left: 5px;
}
</style>
