import "./displaySecretComponet.css";
import axios from "axios";
import config from "./config.json";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import marked from "marked";
import DOMPurify from "dompurify";
import SyntaxHighlighter from "react-syntax-highlighter";

function displaySecretComponent() {
  const inactive = false;
  const active = true;

  let { id } = useParams(); // get secretID value from url
  const [secret, setSecret] = useState(); // stores received secret from axios
  const [language, setLanguage] = useState(""); // stores received language from axios
  const [loadingStatus, setLoadingStatus] = useState(inactive);
  const [errorResponse, setErrorResponse] = useState(""); // stores error response, will be used in alert
  const [showErrorAlert, setShowErrorAlert] = useState(inactive); // bootstrap alert to display error

  useEffect(() => {
    axios
      .post(`${config.apiGetSecret}/${id}`, { id: id })
      .then(function (response) {
        setLoadingStatus(active);
        const parsedData = JSON.parse(atob(response.data)); // decode base64 into string first with atob, then JSON.parse to turn the string back into JSON
        setSecret(parsedData.secret);
        setLanguage(parsedData.language);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);

          setLoadingStatus(active);
          setErrorResponse(error.response.data);
          setShowErrorAlert(active);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);

          setLoadingStatus(active);
          setErrorResponse(error.message);
          setShowErrorAlert(active);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  }, []);

  function createMarkup(dirty) {
    const clean = DOMPurify.sanitize(dirty); // DOMpurify to prevent XSS attack
    const __html = marked(clean); // marked library used to display it as markdown
    return { __html };
  }

  function purifyPlainText(dirty) {
    const clean = DOMPurify.sanitize(dirty); // DOMpurify to prevent XSS attack
    const printableText = clean.replace(/(?:\r\n|\r|\n)/g, "<br />"); // turn plaintext linebreaks into html linebreaks
    const __html = printableText;
    return { __html };
  }

  function LoadingSpinner() {
    return (
      <Spinner animation="border" variant="primary" role="status"></Spinner>
    );
  }

  function ErrorAlert() {
    if (showErrorAlert) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Opps! You got an error!</Alert.Heading>
          {errorResponse}
        </Alert>
      );
    }
    return null;
  }

  // for displaying secret content based on secret's language selection
  function DisplaySecret() {
    if (language == "CSS") {
      return (
        <SyntaxHighlighter language="css" wrapLongLines="true">
          {secret}
        </SyntaxHighlighter>
      );
    } else if (language == "Javascript") {
      return (
        <SyntaxHighlighter language="javascript" wrapLongLines="true">
          {secret}
        </SyntaxHighlighter>
      );
    } else if (language == "Markdown") {
      return <div dangerouslySetInnerHTML={createMarkup(secret)}></div>;
    } else if (language == "Python") {
      return (
        <SyntaxHighlighter language="python" wrapLongLines="true">
          {secret}
        </SyntaxHighlighter>
      );
    } else if (language == "PlainText") {
      return <div dangerouslySetInnerHTML={purifyPlainText(secret)}></div>;
    } else {
      return null;
    }
  }

  return (
    <div className="background">
      {loadingStatus ? (
        <div className="container">
          {showErrorAlert ? (
            <ErrorAlert />
          ) : (
            <>
              <span className="appTitle">Snapass</span>

              <div className="displayArea">
                {" "}
                <b>The secret is :</b> <DisplaySecret />
              </div>
            </>
          )}
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}

export default displaySecretComponent;
