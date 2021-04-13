const express = require("express");
const authServiceClient = require("./services/authServiceClient");
const axios = require("axios");

const app = express();
const port = 4000;
let secretID;

app.use("/api/postSecret", (req, res) => {
  authServiceClient
    .getToken()
    .then((value) => {
      console.log(value.data.access_token);
      console.log("---------------------------");

      authServiceClient
        .postSecret(value.data.access_token)
        .then((value) => {
          secretID = value.data.id;

          res.json("The secret id is: " + secretID);
          console.log("The secret id is: " + secretID);
          console.log("---------------------------");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

// get token from api first then get secret from api
app.use("/api/getSecret", (req, res) => {
  authServiceClient
    .getToken()
    .then((value) => {
      console.log(value.data.access_token);
      console.log("---------------------------");

      authServiceClient
        .getSecret(value.data.access_token, secretID)
        .then((value) => {
          res.json("The message of the secret is: " + value.data.body);
          console.log("The message of the secret is: " + value.data.body);
          console.log("---------------------------");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () =>
  console.log(`Sample expressjs is listening at port ${port}`)
);
