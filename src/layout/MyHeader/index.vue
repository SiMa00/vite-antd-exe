<template>
    <div class="centerY wh100 head-wrapper">
        <div class="head-p1 h100 centerY">
            <img src="~/@/assets/img/fjLogo.png" alt="" class="cmp-logo">
            <span class="logo-fg">|</span>
            <span class="logo-title">统一身份管理系统</span>
        </div>
        <div class="head-p2"></div>
        <div class="head-p3 h100 centerY">
            <a-popconfirm
                placement="bottomRight"
                title="您确认要重新登录吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirmLog"
            >
                <PoweroffOutlined class="loginout-icon centerXY reset-pwd-icon"/>
            </a-popconfirm>

            <span class="centerXY user-area">
                <span class="too-much my-name">{{ myUserName }}</span>
                <div
                    class="myAvaTxt"
                    :class="{ myAvaTxtEn: isLetter, myAvaTxtCn: !isLetter }"
                    @click="clickUserAva"
                >
                    {{ myUserName && myUserName[0].toUpperCase() }}
                </div>
            </span>
        </div>
    </div>

</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { PoweroffOutlined } from '@ant-design/icons-vue'
import { useUserStore } from "@/stores/user"

const userStore = useUserStore()
const router = useRouter()

const { usernameGT } = storeToRefs(userStore)
const myUserName = computed(() => usernameGT.value || localStorage.getItem('username'))
const isLetter = computed(() => {
    const reg = /^[a-z]+$/
    if (myUserName.value) {
        return reg.test(myUserName.value)
    } else {
        return false
    }
})


function clickUserAva() {
    router.push({ name: 'userCenter' })
}
function confirmLog() {
    userStore.SET_USER_INFO()
    router.push({ name: 'login', replace: true })
}
</script>

<style lang="less" scoped>

@brandWth: 230px;
@headIconAreaWth: 460px;

.head-wrapper{
    color: rgb(255, 255, 255);
    .head-p1 {
        width: @brandWth;
        .cmp-logo{
            width: 30px;
            height: 40px;
            cursor: pointer;
        }
        .logo-fg {
            font-size: 18px;
            margin-left: 15px;
            margin-right: 15px;
        }
        .logo-title {
            font-size: 18px;
        }
    }
    .head-p2 {
        width: calc(100% - @brandWth - @headIconAreaWth);
    }
    .head-p3 {
        width: @headIconAreaWth;
        justify-content: flex-end;
        .user-area {
            font-size: 16px;
            .user-icon {
                margin-right: 5px;
            }
            .my-name {
                margin-right: 5px;
                max-width: 140px;
            }
            .myAvaTxt {
                width: 40px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                border-radius: 50%;
                background-color: rgb(8, 85, 168);
                transition: all 0.3s;
                cursor: pointer;
                &:hover {
                    background-color: rgb(9, 109, 217);
                }
            }
            .myAvaTxtEn {
                font-size: 20px;
            }
            .myAvaTxtCn {
                font-size: 25px;
            }
        }

        .loginout-icon {
            display: flex!important;
            font-size: 18px;
            width: 32px;
            height: 32px;
            transition: all 0.3s;
            user-select: none;
            border-radius: 50%;
            cursor: pointer;

            &:hover {
                background-color: rgb(9, 109, 217);
            }
        }

        .reset-pwd-icon {
            margin-right: 10px;
        }
    }
}

</style>
