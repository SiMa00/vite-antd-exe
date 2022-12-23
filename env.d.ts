// / <reference types="vite/client" />
/// <reference types="vue/macros-global" />
declare module '*.vue' {
    import type { DefineComponent } from 'vue';

    const vueComponent: DefineComponent<{}, {}, any>;
    
    export default vueComponent;
    
}