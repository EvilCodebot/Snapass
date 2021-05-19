const axios = require("axios");
const config = require("../config.json");

module.exports = {
  postSecret: (token, secret) => {
    return axios.post(
      config.secretApi.baseUrl,
      { secret: secret },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { timeout: 20000 }
    );
  },

  getSecret: (token, SecretID) => {
    return axios.get(
      config.secretApi.baseUrl + SecretID,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { timeout: 20000 }
    );
  },
};
