import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey from 'vite-plugin-monkey';
import * as path from 'node:path';

export default defineConfig({
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
                namespace: 'npm/vite-plugin-monkey',
                match: ['https://www.coral.ru/*'],
                icon: 'https://vitejs.dev/logo.svg',
                name: 'coral-popup',
                version: '1.0.0',
                description: 'Popup as Web Component for Coral',
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        target: 'esnext',
        lib: {
            entry: 'src/main.ts',
            name: 'CoralPopup',
            fileName: () => 'coral-popup.js',
            formats: ['iife'],
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
});
