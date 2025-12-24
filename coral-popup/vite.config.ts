// vite.config.ts
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

export default defineConfig({
	define: {
		"process.env.NODE_ENV": JSON.stringify("production"),
		__VUE_OPTIONS_API__: "false",
		__VUE_PROD_DEVTOOLS__: "false",
	},
	plugins: [
		vue({
			template: {
				compilerOptions: { isCustomElement: (tag) => tag.includes("-") },
			},
		}),
		monkey({
			entry: "src/main.ts",
			userscript: {
				icon: "https://vitejs.dev/logo.svg",
				namespace: "npm/vite-plugin-monkey",
				match: ["https://www.coral.ru/*"],
			},
		}),
	],
	build: {
		target: "esnext",
		lib: {
			entry: "src/main.ts",
			name: "CoralComponentsPopup",
			fileName: () => "coral-components-popup.js",
			formats: ["iife"],
		},
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
		minify: true,
	},
});
