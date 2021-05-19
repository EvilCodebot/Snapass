import axios from "axios";
import config from "./config.json";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

function displaySecretComponent() {
  let { id } = useParams();
  const [secret, setSecret] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  function Hello() {
    return <Spinner animation="border" role="status"></Spinner>;
  }

  useEffect(() => {
    console.log("auto ran");
    axios
      .post(`${config.apiGetSecret}/${id}`)
      .then(function (response) {
        setSecret(response.data);
        setLoadingStatus(true);
      })
      .catch(function (error) {
        console.log("error");
        console.log(error);
        console.log(error.response.data);

        setSecret(error.response.data);
        setLoadingStatus(true);
      });
  }, []);

  return (
    <div>{loadingStatus ? <h1>The secret is : {secret} </h1> : <Hello />}</div>
  );
}

export default displaySecretComponent;
