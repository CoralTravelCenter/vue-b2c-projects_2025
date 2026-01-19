// vite.config.ts
import vue from '@vitejs/plugin-vue'
import {defineConfig} from 'vite'
import monkey from 'vite-plugin-monkey'
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import pkg from './package.json'

export default defineConfig(({ command }) => {
	const isDev = command === 'serve'
	const isBuild = command === 'build'

	return {
		define: {
			'process.env.NODE_ENV': JSON.stringify('production'),
			__VUE_OPTIONS_API__: false,
			__VUE_PROD_DEVTOOLS__: false,
		},
		plugins: [
			vue({
				template: {
					compilerOptions: { isCustomElement: tag => tag.includes('-') },
				},
			}),

			isDev &&
			monkey({
				entry: 'src/main.ts',
				userscript: {
					icon: 'https://vitejs.dev/logo.svg',
					namespace: 'npm/vite-plugin-monkey',
					match: ['https://www.coral.ru/*'],
				},
			}),

			isBuild && cssInjectedByJsPlugin(),
		].filter(Boolean),

		build: isBuild
			? {
				target: 'esnext',
				lib: {
					entry: 'src/main.ts',
					name: 'CoralComponentsPopup',
					fileName: () => `coral-popup-component-${pkg.version.replace(/\./g, '_')}.js`,
					formats: ['iife'],
				},
				rollupOptions: {
					output: {
						inlineDynamicImports: true,
					},
				},
				minify: true,
			}
			: undefined,
	}
})
