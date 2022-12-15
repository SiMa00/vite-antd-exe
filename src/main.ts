import { createApp } from 'vue'


import App from './App.vue'
import router from './router'
import stores from './stores/index'

import "./utils/permission"

import './assets/style/common.less'
import 'ant-design-vue/dist/antd.css' // TODO 临时修复 modal message组件 样式丢失问题
const app = createApp(App)

app.use(stores)
.use(router)
.mount('#app')
