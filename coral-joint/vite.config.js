import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey from 'vite-plugin-monkey';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.js',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://www.coral.ru/monkey/'],
      }
    }),
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/main.js',
      name: 'CoralJoint',
      fileName: () => 'coral-joint.js',
    },
    minify: true,
  },
  resolve: {
    alias: {'@': path.resolve(__dirname, './src')},
  },
});
