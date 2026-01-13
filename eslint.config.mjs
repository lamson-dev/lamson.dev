import eslint from "@eslint/js";
import astroParser from "astro-eslint-parser";
import astroPlugin from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  {
    ignores: [".husky/**", ".vscode/**", "node_modules/**", "public/**", "dist/**", ".yarn/**"],
  },
  eslint.configs.recommended,
  ...astroPlugin.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2022,
        ...globals.browser,
      },
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
      },
      globals: {
        Typewriter: "readonly",
      },
    },
    rules: {},
  },
  {
    files: ["**/*.js", "**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.test.js", "**/test/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
];
