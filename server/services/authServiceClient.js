const axios = require("axios");
const config = require("../config.json");

module.exports = {
  getToken: () => {
    const { baseUrl, scope, apiKeyId, secretAccessKey } = config.authService;
    return axios.post(baseUrl, { scope, apiKeyId, secretAccessKey });
  },

  postSecret: (token) => {
    return axios.post(
      config.apiBaseUrlSecret,
      { secret: "This is a test baby" },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  getSecret: (token, SecretID) => {
    return axios.get(config.apiBaseUrlSecret + SecretID, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
