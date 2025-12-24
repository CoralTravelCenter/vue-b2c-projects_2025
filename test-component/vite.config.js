import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey from 'vite-plugin-monkey'

export default defineConfig(({command}) => {
  const isDev = command === 'serve'

  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      __VUE_OPTIONS_API__: 'false',
      __VUE_PROD_DEVTOOLS__: 'false',
    },

    plugins: [
      vue(),

      // ✅ monkey только в dev
      ...(isDev
        ? [monkey({
          entry: 'src/main.js',
          userscript: {
            icon: 'https://vitejs.dev/logo.svg',
            namespace: 'npm/vite-plugin-monkey',
            match: ['https://www.coral.ru/monkey/*'],
          },
        })]
        : []),
    ],

    // ✅ prod-сборка без monkey: Vue снаружи, формат IIFE
    build: isDev
      ? undefined
      : {
        target: 'esnext',
        lib: {
          entry: 'src/main.js',
          name: 'CoralComponentsTest',
          fileName: () => 'coral-components-test.js',
          formats: ['iife'],
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {vue: 'Vue'},
            inlineDynamicImports: true,
          },
        },
        minify: true,
      },
  }
})
