import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from "unplugin-auto-import/vite"
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            reactivityTransform: true,
        }),
        Components({ resolvers: [AntDesignVueResolver()] }),
        AutoImport({
            imports: ['vue','vue-router'], //vue: 自动引入vue的 ref、toRefs、onmounted等，无需在页面中再次引入
            dts: "src/auto-import.d.ts" // 生成在src路径下名为auto-import.d.ts的声明文件
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: { // 跨域
        port: 8090,
        proxy: {
            // '/api': {
            //     target: 'http://192.168.25.133:8080',
            //     changeOrigin: true,
            //     rewrite: (path) => path.replace(/^\/api/, '')
            // },
            '/uop': {
                target: 'http://uims-test.fjdac.cn',
                changeOrigin: true,
                ws: false,
            },
        }
    }
})
