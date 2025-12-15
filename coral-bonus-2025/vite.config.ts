import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tailwindcss(),
		vueDevTools(),
		vue(),
		monkey({
			entry: "src/main.ts",
			userscript: {
				icon: "https://vitejs.dev/logo.svg",
				namespace: "npm/vite-plugin-monkey",
				match: ["https://www.coral.ru/*"],
			},
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	build: {
		minify: true,
	},
});
