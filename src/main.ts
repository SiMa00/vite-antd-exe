import { createApp } from 'vue'


import App from './App.vue'
import router from './router'
import stores from './stores/index'

import "./utils/permission"

import './assets/style/common.less'

const app = createApp(App)

app.use(stores)
.use(router)
.mount('#app')
