const express = require("express");
const authServiceClient = require("./services/authServiceClient");
const secretServiceClient = require("./services/secretServiceClient");
const path = require("path");
const config = require("./config");

const app = express();
const port = config.port;
let secretID;
let token;

app.use(express.static(path.join(__dirname, "../client/build")));

const jsonParser = express.json();

app.get("/secret/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const getToken = async (req, res, next) => {
  await authServiceClient
    .getToken()
    .then((value) => {
      token = value.data.access_token;

      console.log(token);
      console.log("---------------------------");
    })
    .catch((err) => {
      console.log(err);
    });

  next();
};

app.use("/api/postSecret", getToken, jsonParser, (req, res) => {
  const { secret } = req.body;

  if (!secret) {
    return res.status(400).json({
      status: "error",
      message: "Missing required secret field",
    });
  }

  secretServiceClient
    .postSecret(token, req.body.secret)
    .then((value) => {
      secretID = value.data.id;
      // res.json("The secret id is: " + secretID);
      console.log("The secret id is: " + secretID);
      console.log("---------------------------");
      res.send(secretID);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/api/getSecret", getToken, (req, res) => {
  secretServiceClient
    .getSecret(token, secretID)
    .then((value) => {
      // res.json("The message of the secret is: " + value.data.body);
      console.log("The message of the secret is: " + value.data.body);
      console.log("---------------------------");

      res.send(value.data.body);
    })
    .catch((err) => {
      console.log(err);
      console.log(err.response.status);

      if (err.response.status == 404) {
        res.status(404).send("The secret has been viewed and destroyed!");
      }
    });
});

app.listen(port, () =>
  console.log(`Sample expressjs is listening at port ${port}`)
);
