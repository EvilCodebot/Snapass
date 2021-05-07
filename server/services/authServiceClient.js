const axios = require("axios");
const config = require("../config");

module.exports = {
  getToken: () => {
    const { baseUrl, scope, apiKeyId, secretAccessKey } = config.authService;
    return axios.post(baseUrl, { scope, apiKeyId, secretAccessKey });
  },
};
