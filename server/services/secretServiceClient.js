const axios = require("axios");
const config = require("../config.json");

module.exports = {
  postSecret: (token) => {
    return axios.post(
      config.secretApi.baseUrl,
      { secret: "This is a test baby" },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  getSecret: (token, SecretID) => {
    return axios.get(config.secretApi.baseUrl + SecretID, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
