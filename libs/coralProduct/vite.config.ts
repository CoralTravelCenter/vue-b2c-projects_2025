import {defineConfig} from 'vite';
import {resolve} from 'path';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		monkey({
			entry: 'src/main.ts',
			userscript: {
				icon: 'https://vitejs.dev/logo.svg',
				namespace: 'npm/vite-plugin-monkey',
				match: ['https://www.coral.ru'],
			},
		}),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		}
	}
});
