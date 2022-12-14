<template>
    <div class="login-wrap h100">
        <div class="bg-wrap">
            <div class="logo-wrap centerY">
                <img src="~@/assets/img/fjLogo.png" class="cmp-logo" />
                <div class="logo-txt-wrap">
                    <div class="tit1">丰疆智能</div>
                    <div>正直、创新、协作、高效、担当</div>
                </div>
            </div>
            <div class="bg-img wh100" id="back-img"></div>
        </div>

        <div class="login-form-wrap">
            <img src="~@/assets/img/user-sys.png" class="login-left-img" />

            <div>
                <div class="logo-title">—— 统一身份管理系统 ——</div>
                <a-form
                    class="my-login-form"
                    layout="vertical"
                    name="loginForm"
                    autocomplete="off"
                    :model="formState"
                    :label-col="{ span: 0 }"
                    :wrapper-col="{ span: 24 }"
                    @finish="onFinish"
                >
                    <a-form-item
                        name="username"
                        class="login-sp-fit"
                        :rules="[{ required: true, message: '请输入用户名!' }]"
                    >
                        <a-input v-model:value="formState.username" size='large' placeholder="用户名"/>
                    </a-form-item>

                    <a-form-item
                        name="password"
                        class="login-sp-fit"
                        :rules="[{ required: true, message: '请输入密码!' }]"
                    >
                        <a-input-password v-model:value="formState.password" size='large' placeholder="密码" />
                    </a-form-item>
                    <a-form-item
                        name="verifyCode"
                        class="login-sp-fit"
                        :rules="[{ required: true, message: '请输入验证码!' }]"
                    >
                        <div class="vcode-wrap">
                            <a-input class="code-ipt" v-model:value="formState.verifyCode" size='large' placeholder="验证码" />
                            <img class="code-img" @click="getVerifyCode" :src="formState.verfyImgSrc" alt="">
                            <!-- <div class="code-img" @click="getVerifyCode" :style="{backgroundImage: `url(${formState.verfyImgSrc})` }"></div> -->
                            <a-button type="link" @click="getVerifyCode" class="refreshcode" >
                                <template #icon><sync-outlined /></template>
                            </a-button>
                        </div>
                    </a-form-item>


                    <a-form-item>
                        <a-button
                            html-type="submit"
                            type="primary"
                            size='large'
                            class="w100 logsub"
                            :loading="loginLoading"
                        >
                            登录
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
        <div class="footer centerX">
            <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32010402000985">苏公网安备 32010402000985号</a>
            <a target="_blank" href="http://www.beian.miit.gov.cn/">苏ICP备20034460号-2</a>
            <a href="https://www.fjdynamics.cn/">©丰疆智能软件科技</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SyncOutlined } from '@ant-design/icons-vue'
import { getClientId } from "@/utils/tool"
import { getImgVerifyCodeAPI } from "@/api/userAPI"
import { useUserStore } from "@/stores/user"
import type { IObjAny } from "@/utils/types"
import bmImg from "@/assets/img/glb.jpg"

const router = useRouter()
const userStore = useUserStore()

const formState = reactive({
    username: '',
    password: '',
    verifyCode: '1234',
    verfyImgSrc: '' as string | ArrayBuffer,
})
const loginLoading = ref(false)

const clientId = getClientId()


function loadAniImg() {
    const bgImg = new Image()
    bgImg.src = bmImg
    bgImg.onload = function () {
        const loadbackground = document.getElementById('back-img')
        if (loadbackground) {
            loadbackground.style.backgroundImage = 'url(' + bgImg.src + ')'
            loadbackground.style.animationPlayState = 'running' 
        }
        
    }
}

async function onFinish(values:IObjAny) {
    loginLoading.value = true
    try {
        const res0 = await userStore.LoginACT({ ...values, clientId })
        console.log('llgon 1>', res0)
        loginLoading.value = false
        
        
        if (res0) {
            router.push('/frame')
        } else {
            getVerifyCode()
        }
    } catch (error) {
        loginLoading.value = false
        getVerifyCode()
    }

}
async function getVerifyCode() {
    // formState.verifyCode = ''
    const res = await getImgVerifyCodeAPI(clientId)
    if (res.isOk) {
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target && e.target.result) {
                formState.verfyImgSrc = e.target.result
            }
        }
        reader.readAsDataURL(res.retData as Blob)
    }
}

loadAniImg()
getVerifyCode()
</script>

<style lang="less" scoped>

@headerHt: 50px;
@bgWrapHt: 100%;

.login-wrap {
    position: relative;
    background-color: rgb(250 250 250);
    // padding: 15px;

    .bg-wrap {
        height: @bgWrapHt;
        position: relative;

        .logo-wrap {
            position: absolute;
            top:0;
            z-index: 9;
            margin-left: 20px;
            margin-top: 20px;
            .cmp-logo {
                width: 40px;
                height: 60px;
            }
            .logo-txt-wrap {
                margin-left: 10px;
                color: rgb(255, 255, 255);
                .tit1 {
                    font-size: 22px;
                    margin-top: -7px;
                    font-weight: bold;
                }
            }
        }

        .bg-img {
            animation: bgAn 1.5s 1 alternate forwards paused;
            // background-image: url('../../../src/assets/img/fj-signup.jpg');
            box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            &::before {
                display: block;
                content: "";
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                background-color: #000;
                opacity: .3;
            }
        }
    }

    .login-form-wrap {
        display: flex;
        width: 750px;
        height: 400px;
        overflow: hidden;
        position: absolute;
        animation: loginFormAn 0.8s 1 alternate forwards;
        background-color: rgb(255 255 255);
        padding: 10px 20px;
        box-shadow: 0 20px 27px rgb(0 0 0 / 5%);
        border-radius: 12px;
        top: 30%;
        bottom: 0;
        right: 0;
        left: 0;
        margin: 0 auto;

        .login-left-img {
            width: 450px;
        }
        .logo-img-wrap {
            text-align: center;
            .logo-img{
                width: 60px;
                margin-top: 8px;
            }
        }

        .logo-title {
            text-align: center;
            font-size: 24px;
            margin: 15px 0 30px 0;
        }

        .my-login-form {

            .logsub {
                border-radius: 8px;
                margin-top: 20px;
            }
            .vcode-wrap {
                display: flex;
                align-items: center;
                .code-ipt {
                    width: calc(100% - 74px - 24px - 25px - 15px);
                }
                .code-img {
                    width: 74px;
                    height: 40px;
                    margin-left: 25px;
                    cursor: pointer;
                }
                .refreshcode {
                    // font-size: 20px;
                    margin-left: 5px;
                    // cursor: pointer;
                    border: 0;
                }
            }
        }

        @media (min-width: 1200px) {
            top: 23%;
        }
        @media (min-width: 1550px) {
            top: 26%;
        }

    }

    .footer {
        position: absolute;
        bottom: 15px;
        width: calc(100% - 30px); // padding 15 * 2
        a {
            margin-right: 20px;
            margin-right: 25px;
            font-size: 14px;
            color: rgb(255, 255, 255);
            &:last-child {
                margin-right: 0;
            }
        }
    }

}

@keyframes bgAn {
    from {
        opacity: 0;
        background-position: 0%;
    }
    to {
        opacity: 1;
        background-position: 50%;
    }
}
@keyframes loginFormAn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
