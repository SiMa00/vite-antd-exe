<template>
  <div class="NotAuthed-wrap  wh100">
    <div class="header">
        <MyHeader :isLogo2Main="false" />
    </div>

    <div class="no-auth-wrap centerXY">
        <div class="no-auth-body">
            <img src="~@/assets/img/lock-fill.png" />
            <div class="auth-txt">
                <span>权限不足，请联系系统管理员</span>
            </div>
            <a-button type="primary" class="auth-but" @click="$router.push('/frame/goods')">返回主页</a-button>
        </div>
    </div>
  </div>
</template>

<script>
import { LockOutlined } from '@ant-design/icons-vue'
import MyHeader from "@/layout/MyHeader"

export default {
    name: 'NotAuthed',
    props: [],
    components: { LockOutlined, MyHeader },
    setup () {

    },

}
</script>

<style lang="less" scoped>

.NotAuthed-wrap {
    .header {
        height: 60px;
        background-color: black;
        padding: 0 20px;
    }

    .no-auth-wrap {
        height: calc(100% - 60px);
        text-align: center;

        .no-auth-body {
            margin-top: -40px;
            .auth-txt {
                margin-top: 35px;
                margin-bottom: 10px;

                .auth-but {
                    padding: 5px;
                }
            }
        }
    }
}
</style>
