<template>
    <a-layout class="h100">
        <a-layout-header class="header-wrapper" v-show="loadType !== 'iframe'">
            <MyHeader />
        </a-layout-header>
        <a-layout class="sider-cnt-wrapper">
            <a-layout-sider
                v-show="loadType !== 'iframe'"
                class="sider-wrapper"
                theme="light"
                :trigger="null"
                collapsible
                breakpoint="lg"
                :collapsed="collapsed"
                @breakpoint="onBreakpoint"
            >
                <MySider />
            </a-layout-sider>
            <a-layout-content class="content-wrapper" id="cntWrapper">
                <div
                    class="route-view-foot"
                    :class="{
                        'route-need-bg':
                            $route.meta &&
                            (isEmpty($route.meta.pageBg) || $route.meta.pageBg !== 'none')
                    }"
                    id="contentView"
                >
                    <div class="content-router-view">
                        <router-view />
                    </div>
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import { isEmpty } from "@/utils/tool"
import MyHeader from "./MyHeader/index.vue"
import MySider from "./MySider/index.vue"
import { usePublicStore } from "@/stores/public"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia"

const publicStore = usePublicStore()
const userStore = useUserStore()

const { loadType } = storeToRefs(userStore)
const { collapsed, isLessBkPoint } = storeToRefs(publicStore)


function onBreakpoint(bk:boolean) {
    collapsed.value = bk
    isLessBkPoint.value = bk
}

</script>

<style lang="less" scoped >
@layoutTheme: rgb(255 255 255);
@layoutCellPad: 10px;
@headHt: 64px;
@contentSpace: 0px;
@contentBg: rgb(255, 255, 255);
@footHt: 50px;

.header-wrapper {
    // background-color: @layoutTheme!important;
    padding: 0 @layoutCellPad;
    margin-bottom: @contentSpace;
}

.sider-cnt-wrapper {
    height: calc(100% - @headHt - @contentSpace);
    .sider-wrapper {
        overflow: auto;
        background-color: @layoutTheme!important;
    }
    .content-wrapper {
        height: 100%;
        overflow: hidden;
        position:relative;
        margin-left: @contentSpace;
        background-color: #ffffff;
        .route-view-foot {
            overflow: auto;
            height: 100%;
            .content-router-view {
                position: relative;
                height: 100%;
                .insert-frame {
                    border-radius: 3px;
                }
                .loading-logo-out {
                    // position: absolute;
                    // top: 0;
                    text-align: center;
                    position: absolute;
                    top: 30%;
                }
            }
            .footer-wrapper {
                height: @footHt;
                box-sizing: border-box;
                padding: @layoutCellPad;
                margin-top: @contentSpace;
                margin-bottom: @contentSpace;
                background-color: rgb(255, 255, 255);
            }
        }
        .route-need-bg {
            margin: 20px;
            background-color: @contentBg;
        }
    }
}

</style>
