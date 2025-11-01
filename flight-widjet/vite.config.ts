import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'
import monkey from 'vite-plugin-monkey';
import path from 'path';

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        monkey({
            entry: 'src/app/main.ts',
            userscript: {
                icon: 'https://vitejs.dev/logo.svg',
                namespace: 'npm/vite-plugin-monkey',
                match: ['https://www.coral.ru/monkey/'],
            },
            build: {
                minify: 'terser'
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    }
});
