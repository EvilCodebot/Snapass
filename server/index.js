const express = require("express");
const authServiceClient = require("./services/authServiceClient");
const axios = require("axios");

const app = express();
const port = 4000;
let secretID;

// get token from api first then post secret to api
app.use("/api/postSecret", (req, res) => {
  authServiceClient
    .getToken()
    .then((_) => {
      console.log(_.data.access_token);
      console.log("---------------------------");

      axios
        .post(
          "https://ikeb1e8o0e.execute-api.ap-southeast-2.amazonaws.com/api/secret",
          { secret: "This is a test baby" },
          {
            headers: { Authorization: `Bearer ${_.data.access_token}` },
          }
        )
        .then((_) => {
          secretID = _.data.id;

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
    .then((_) => {
      console.log(_.data.access_token);
      console.log("---------------------------");

      axios
        .get(
          "https://ikeb1e8o0e.execute-api.ap-southeast-2.amazonaws.com/api/secret/" +
            secretID,
          {
            headers: { Authorization: `Bearer ${_.data.access_token}` },
          }
        )
        .then((_) => {
          res.json("The message of the secret is: " + _.data.body);
          console.log("The message of the secret is: " + _.data.body);
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
