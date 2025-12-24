import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'
import monkey from 'vite-plugin-monkey';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    compilerOptions: {
        resolveJsonModule: true
    },
    plugins: [
        tailwindcss(),
        vue(),
        monkey({
            entry: 'src/main.ts',
            userscript: {
                icon: 'https://vitejs.dev/logo.svg',
                namespace: 'npm/vite-plugin-monkey',
                match: ['https://www.coral.ru/monkey/*'],
            },
        }),
    ],
    build: {
        minify: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
