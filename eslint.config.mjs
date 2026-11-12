import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
    {
        ignores: [
            "node_modules/**",
            "dist/**",
            "coverage/**",
        ],
    },
    {
        files: ["**/*.ts"],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
        ],
        languageOptions: {
            globals: globals.node,
        },
        plugins: {
            "@stylistic": stylistic,
        },
        rules: {
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/semi": ["error", "always"],
        },
    },
]);
