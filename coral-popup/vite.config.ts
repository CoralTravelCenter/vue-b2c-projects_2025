import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => ({
    plugins: [
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
    define: {
        'process.env.NODE_ENV': '"production"',
        'process.env': '{}',
    },
    build: {
        lib: {
            entry: 'src/elements.ts',
            name: 'MyComponentBundle',
            formats: ['iife'],
            fileName: () => 'my-component.js',
        },
        cssCodeSplit: false,
        sourcemap: false,
        target: 'esnext',
        minify: true,
    },
}));
