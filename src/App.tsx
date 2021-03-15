import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { useState } from "react";

function App() {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (popUpState == false) {
      setPopUp(!popUpState);
      console.log("hello");
    }
  }

  const [popUpState, setPopUp] = useState(false);

  let popUp;

  if (popUpState == true) {
    popUp = (
      <div className="popup">
        <a href="#">www.secret.com</a>
        <button onClick={() => setPopUp(!popUpState)}>x</button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="center">
        <textarea className="input"></textarea>

        <input type="submit" value="click here!" className="submitButton" />
      </form>

      {popUp}
    </div>
  );
}

export default App;
