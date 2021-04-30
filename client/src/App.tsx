import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import config from "./config.json";

function App() {
  let popUp;
  const inactive = false;

  const [popUpState, setPopUp] = useState(inactive); // if state is active pop up box appears
  const [apiResponse, setApiResponse] = useState(0); // stores api response
  const [secret, setSecret] = useState(""); // stores user input text

  function handleChange(evt: React.ChangeEvent<HTMLTextAreaElement>) {
    setSecret(evt.target.value);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    console.log("clicked");

    axios
      .post(config.apiPostSecret, { secret: secret })
      .then(function (response) {
        console.log(response);
        // console.log(response.status)
        // console.log(response.data)
        if (popUpState == inactive) {
          setPopUp(!popUpState);
        }

        setApiResponse(response.status);
        console.log(secret);
      })
      .catch(function (error) {
        console.log(error);
        console.log("error");
      });
  }

  if (popUpState == true) {
    popUp = (
      <div className="popup">
        <a href="#">
          {apiResponse} {secret}{" "}
        </a>

        <button onClick={() => setPopUp(!popUpState)}>x</button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="centerForm">
        <textarea
          className="inputArea"
          value={secret}
          onChange={handleChange}
        ></textarea>

        <button type="submit" className="submitButton">
          Click here to submit!
        </button>
      </form>

      {popUp}
    </div>
  );
}

export default App;
