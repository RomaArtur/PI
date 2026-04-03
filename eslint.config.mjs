import js from "@eslint/js";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["**/*.cjs", "**/*.mjs"] },

  js.configs.recommended,

  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
]);
