const cypressPlugin = require('eslint-plugin-cypress');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'cypress/reports/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
      'cypress/downloads/**',
    ],
  },
  {
    files: ['cypress.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
      globals: {
        require: 'readonly',
        module: 'writable',
        process: 'readonly',
      },
    },
  },
  {
    files: ['cypress/**/*.js'],
    plugins: cypressPlugin.configs.recommended.plugins,
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: cypressPlugin.configs.recommended.languageOptions.globals,
    },
    rules: {
      ...cypressPlugin.configs.recommended.rules,
      'no-unused-vars': 'error',
    },
  },
  eslintConfigPrettier,
];
