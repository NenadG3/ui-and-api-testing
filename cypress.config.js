const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false,
    env: {
     gorestUrl: 'https://gorest.co.in',
     authToken: 'a161fba2ba5cd8ee0231bcde7becb4d6fe60d28beecddead909431acf616f512',
    }
    },
  });

