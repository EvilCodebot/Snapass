import React from "react";

import "./App.css";

import { useState } from "react";
import axios from "axios";

function App() {
  let popUp;

  const apiURL =
    "https://ikeb1e8o0e.execute-api.ap-southeast-2.amazonaws.com/api/secret";

  const [popUpState, setPopUp] = useState(false);
  const [apiResponse, setApiResponse] = useState(0); // stores api response
  const [secret, setSecret] = useState(""); // stores user input text

  function handleChange(evt: React.ChangeEvent<HTMLTextAreaElement>) {
    setSecret(evt.target.value);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    axios
      .post(apiURL, {
        secret: secret,
      })
      .then(function (response) {
        console.log(response);
        // console.log(response.status)
        // console.log(response.data)
        if (popUpState == false) {
          setPopUp(!popUpState);
        }

        setApiResponse(response.status);
      })
      .catch(function (error) {
        console.log(error);
        console.log("eroor lol");
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
      <form onSubmit={handleSubmit} className="center">
        <textarea
          className="input"
          value={secret}
          onChange={handleChange}
        ></textarea>

        <button type="submit" className="submitButton">
          Click here !
        </button>
      </form>

      {popUp}
    </div>
  );
}

export default App;
