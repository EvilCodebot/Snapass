import axios from "axios";
import config from "./config.json";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import "./displaySecretComponet.css";

function displaySecretComponent() {
  let { id } = useParams();
  const [secret, setSecret] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  function LoadingSpinner() {
    return (
      <Spinner animation="border" variant="primary" role="status"></Spinner>
    );
  }

  useEffect(() => {
    console.log("auto ran");
    axios
      .post(`${config.apiGetSecret}/${id}`)
      .then(function (response) {
        // setSecret(JSON.stringify(response.data));
        setSecret(atob(response.data));
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
    <div className="background">
     
      {loadingStatus ? ( <div>
        <h1 style={{color: "#ffb347", fontFamily:"Brush Script MT, Helvetica, sans-serif", fontSize:"3em"}}>Snapass</h1>     
        <h2 className="box"> <b>The secret is :</b> {secret} </h2>
      </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}

export default displaySecretComponent;
