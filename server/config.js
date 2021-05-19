const dotenv = require("dotenv");
dotenv.config();

const config = require("./config.json");

module.exports = {
  apiBaseUrl: config.apiBaseUrl,
  abcPath: config.abcPath,
  authService: {
    baseUrl: config.authService.baseUrl,
    scope: config.authService.scope,
    apiKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  port: process.env.PORT,
};
