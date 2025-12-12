import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools'
import monkey from 'vite-plugin-monkey';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {api: 'modern-compiler'},
        },
    },
    plugins: [
        vueDevTools(),
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.includes('-')
                }
            }
        }),
        monkey({
            entry: 'src/main.ts',
            userscript: {
                icon: 'https://vitejs.dev/logo.svg',
                namespace: 'npm/vite-plugin-monkey',
                match: ['https://www.coral.ru/*'],
            }
        }),
    ],
    resolve: {
        alias: {'@': path.resolve(__dirname, './src')},
    },
    build: {
        target: 'esnext',
        lib: {
            entry: 'src/main.ts',
            name: 'CoralJoint',
            fileName: () => 'coral-joint.js',
        },
        minify: true,
    }
});
