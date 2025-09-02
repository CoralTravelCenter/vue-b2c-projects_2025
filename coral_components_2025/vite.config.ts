import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey from 'vite-plugin-monkey';
import * as path from 'node:path';

export default defineConfig({
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    },
    plugins: [
        vue({
            customElement: true,
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.includes('-')
                }
            }
        }),
        monkey({
            entry: 'src/main.js',
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
            entry: 'src/main.js',
            name: 'CoralPopup',
            fileName: () => 'coral-popup.js',
            formats: ['iife'],
        },
        rollupOptions: {
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,     // убираем console.*
                drop_debugger: true     // убираем debugger
            },
            format: {
                comments: false         // удаляем все комментарии
            }
        }
    },
});
