import { createApp } from 'vue'


import App from './App.vue'
import router from './router'
import stores from './stores/index'

import "./utils/permission"

import './assets/style/common.less'
import 'ant-design-vue/lib/modal/style/css' // 加载 modal 组件CSS，需要单独引入，目前版本不引入会丢失样式
import 'ant-design-vue/lib/message/style/css' // 加载 message组件CSS; 临时修复 modal message组件 样式丢失问题

const app = createApp(App)

app.use(stores)
.use(router)
.mount('#app')
