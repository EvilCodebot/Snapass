const express = require("express");
const authServiceClient = require("./services/authServiceClient");
const secretServiceClient = require("./services/secretServiceClient");
const path = require("path");

const app = express();
const port = 4000;
let secretID;
let token;

app.use(express.static(path.join(__dirname, "../client/build")));

app.use((req, res, next) => {
  authServiceClient
    .getToken()
    .then((value) => {
      token = value.data.access_token;

      res.json("The token is: " + token);
      console.log(token);
      console.log("---------------------------");
    })
    .catch((err) => {
      console.log(err);
    });

  next();
});

app.use("/api/postSecret", (req, res) => {
  secretServiceClient
    .postSecret(token)
    .then((value) => {
      secretID = value.data.id;

      res.json("The secret id is: " + secretID);
      console.log("The secret id is: " + secretID);
      console.log("---------------------------");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/api/getSecret", (req, res) => {
  secretServiceClient
    .getSecret(token, secretID)
    .then((value) => {
      res.json("The message of the secret is: " + value.data.body);
      console.log("The message of the secret is: " + value.data.body);
      console.log("---------------------------");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () =>
  console.log(`Sample expressjs is listening at port ${port}`)
);
