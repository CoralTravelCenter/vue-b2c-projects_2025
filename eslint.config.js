import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
	{
		ignores: [
			"**/node_modules/**",
			"**/dist/**",
			"**/build/**",
			"**/.nuxt/**",
			"**/.output/**",
			"**/.vite/**",
			"**/coverage/**",
			"**/public/**",
		],
	},

	js.configs.recommended,

	// База для всего
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			eqeqeq: ["error", "always"],
			curly: ["error", "all"],
			"prefer-const": "error",
			"no-var": "error",
			"no-debugger": "error",
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_", ignoreRestSiblings: true },
			],
		},
	},

	// TypeScript (только для TS-файлов)
	{
		files: ["**/*.{ts,mts,cts}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: { ecmaVersion: "latest", sourceType: "module" },
		},
		plugins: { "@typescript-eslint": tsPlugin },
		rules: {
			...tsPlugin.configs.recommended.rules,
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_", ignoreRestSiblings: true },
			],
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{ prefer: "type-imports" },
			],
		},
	},

	// Vue SFC
	{
		files: ["**/*.vue"],
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tsParser, // понимает и JS и TS внутри <script>
				extraFileExtensions: [".vue"],
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		plugins: { vue, "@typescript-eslint": tsPlugin },
		rules: {
			...(vue.configs["flat/recommended"]?.rules ?? {}),
			"vue/multi-word-component-names": "off",
			"vue/no-mutating-props": "error",
		},
	},

	// Всегда последним
	prettier,
];
