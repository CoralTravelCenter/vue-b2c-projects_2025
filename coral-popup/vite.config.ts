import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    // считать все теги с тире как пользовательские элементы
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
            },
        }),
    ],
    build: {
        target: 'esnext',
        lib: {
            entry: 'src/main.ts',
            name: 'CoralComponentsPopup',
            fileName: () => 'coral-components-popup.js',
        },
        minify: true,
    },
});
