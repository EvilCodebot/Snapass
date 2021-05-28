import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import config from "./config.json";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

let id = ""; // stores secretID needed to getSecret

interface props {
  onHide: any;
  show: any;
}

function App() {
  const inactive = false;
  const active = true;

  const [modalState, setModalState] = useState(inactive); // if state is a modal appears
  const [errorResponse, setErrorResponse] = useState(""); // stores error response
  const [secret, setSecret] = useState(""); // stores user input text
  const [loadingStatus, setLoadingStatus] = useState(inactive); // for spinner
  const [showErrorAlert, setShowErrorAlert] = useState(inactive); // bootstrap alert to display error

  function handleChange(evt: React.ChangeEvent<HTMLTextAreaElement>) {
    setSecret(evt.target.value);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // checking if secret is empty
    if (!secret) {
      setShowErrorAlert(active);
      setErrorResponse("Secret can not be empty");
    } else {
      setLoadingStatus(active);

      axios
        .post(
          config.apiPostSecret,
          { secret: btoa(secret) },
          { timeout: 20000 }
        ) // timeout 20 seconds
        .then(function (response) {
          id = response.data;
          console.log("this is secret id: " + id);
          // console.log(response.status)
          // console.log(response.data)

          setLoadingStatus(inactive);
          setModalState(active);

          console.log(secret);
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);

            setErrorResponse(error.response.data.message);
            setShowErrorAlert(active);
            setLoadingStatus(inactive);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);

            setErrorResponse(error.message);
            setShowErrorAlert(active);
            setLoadingStatus(inactive);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });

      setSecret("");
    }
  }

  function SubmitButton() {
    if (loadingStatus == inactive) {
      return (
        <Button type="submit" className="submitButton">
          Click here to submit!
        </Button>
      );
    } else if (loadingStatus == active) {
      return (
        <Button className="submitButton" variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </Button>
      );
    } else {
      return null;
    }
  }

  function ErrorAlert() {
    if (showErrorAlert) {
      return (
        <Alert
          variant="danger"
          onClose={() => setShowErrorAlert(inactive)}
          dismissible
        >
          <Alert.Heading>Opps! You got an error!</Alert.Heading>
          {errorResponse}
        </Alert>
      );
    }
    return null;
  }

  function MyVerticallyCenteredModal(props: props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            With this link your friend will be able to see your secret message!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {window.location.href}secret/{id}{" "}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
          <CopyToClipboard text={`${window.location.href}secret/${id}`}>
            <Button variant="primary">Copy</Button>
          </CopyToClipboard>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit} className="centerForm">
        <ErrorAlert />

        <textarea
          className="inputArea"
          placeholder="Please enter your secret here!"
          value={secret}
          onChange={handleChange}
        ></textarea>

        <SubmitButton />
      </Form>

      <MyVerticallyCenteredModal
        show={modalState}
        onHide={() => setModalState(inactive)}
      />
    </Container>
  );
}

export default App;
