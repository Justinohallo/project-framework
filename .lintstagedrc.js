module.exports = {
  // Run ESLint on TypeScript and JavaScript files
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  // Run Prettier on other files
  "*.{json,md,mdx,css,html,yml,yaml}": ["prettier --write"],
  // Type check TypeScript files
  "*.{ts,tsx}": [() => "npm run type-check"],
};
