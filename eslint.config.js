export default [
  {
    ignores: ["node_modules/", "forclients/**", "assets/**"]
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        Audio: "readonly"
      }
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "single"]
    }
  }
];
