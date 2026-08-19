require('dotenv').config();

const { defineConfig } = require('cypress');
const cypressOnFix = require('cypress-on-fix');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'Automation Exercise - Relatorio de testes',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    overwrite: true,
  },
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://www.automationexercise.com',
    specPattern: 'cypress/e2e/features/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    pageLoadTimeout: 90000,
    defaultCommandTimeout: 10000,
    async setupNodeEvents(on, config) {
      on = cypressOnFix(on);

      require('cypress-mochawesome-reporter/plugin')(on);
      await addCucumberPreprocessorPlugin(on, config);

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      config.env.userEmail = process.env.CYPRESS_USER_EMAIL;
      config.env.userPassword = process.env.CYPRESS_USER_PASSWORD;
      config.env.userName = process.env.CYPRESS_USER_NAME;

      return config;
    },
  },
});
