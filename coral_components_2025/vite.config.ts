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
            entry: 'src/main.ts',
            userscript: {
                namespace: 'npm/vite-plugin-monkey',
                match: ['https://b2cpilotui.coral.ru/*'],
                icon: 'https://vitejs.dev/logo.svg',
                name: 'coral_components_2025',
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
