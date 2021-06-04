const express = require("express");
const authServiceClient = require("./services/authServiceClient");
const secretServiceClient = require("./services/secretServiceClient");
const path = require("path");
const config = require("./config");
const util = require("util"); // can be used to show full log in console

const app = express();
const port = config.port;
let token;

const jsonParser = express.json(); // middleware used for parsing req making it usable?

app.use(express.static(path.join(__dirname, "build")));

app.get("/secret/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

const getToken = async (req, res, next) => {
  await authServiceClient
    .getToken()
    .then((value) => {
      token = value.data.access_token;
      // console.log(token);
      // console.log("---------------------------");
    })
    .catch((err) => {
      console.log(err);
    });

  next();
};

app.post("/api/postSecret", getToken, jsonParser, (req, res) => {
  const { secret } = req.body;

  secretServiceClient
    .postSecret(token, secret)
    .then((value) => {
      // console.log("The secretID is: " + value.data.id);
      // console.log("---------------------------");
      res.send(value.data.id);
    })
    .catch((err) => {
      console.log(err);
      console.log(err.response.status);

      if (err.response.status == 400) {
        res.sendStatus(400);
      } else if (err.response.status == 401) {
        res.sendStatus(401);
      } else if (err.response.status == 403) {
        res.sendStatus(403);
      } else if (err.response.status == 404) {
        res.sendStatus(404);
      } else {
      }
    });
});

app.use("/api/getSecret", getToken, jsonParser, (req, res) => {
  secretServiceClient
    .getSecret(token, req.body.id)
    .then((value) => {
      // console.log("The message of the secret is: " + value.data.body);
      // console.log("---------------------------");
      res.send(value.data.body);
    })
    .catch((err) => {
      console.log(err);
      console.log(err.response.status);

      if (err.response.status == 400) {
        res.sendStatus(400);
      } else if (err.response.status == 401) {
        res.sendStatus(401);
      } else if (err.response.status == 403) {
        res.sendStatus(403);
      } else if (err.response.status == 404) {
        res.status(404).send("The secret has been viewed and destroyed!");
      } else {
      }
    });
});

app.listen(port, () =>
  console.log(`Sample expressjs is listening at port ${port}`)
);
