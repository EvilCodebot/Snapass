import axios from "axios";

import config from "./config.json";

import React, { useState } from "react";
import { useParams } from "react-router-dom";

function displaySecretComponent() {
  const [secret, setSecret] = useState("");
  let { id } = useParams();

  function getSecret(secretid) {
    console.log("button clicked");
    axios
      .post(`${config.apiGetSecret}/${secretid}`)
      .then(function (response) {
        setSecret(response.data);
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  }

  return (
    <div>
      <h1>the secret is : {secret} </h1>
      <button onClick={() => getSecret(id)}>Secret</button>
    </div>
  );
}

export default displaySecretComponent;
