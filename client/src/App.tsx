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
      setLoadingStatus(true);

      axios
        .post(config.apiPostSecret, { secret: secret }, { timeout: 20000 }) // timeout 20 seconds
        .then(function (response) {
          id = response.data;
          console.log("this is secret id: " + id);
          // console.log(response.status)
          // console.log(response.data)

          setLoadingStatus(false);
          setModalState(active);

          console.log(secret);
        })
        .catch(function (error) {
          console.log(error);
          console.log(error.response);
          console.log("error");

          setErrorResponse(error.response);
          setShowErrorAlert(true);
        });

      setSecret("");
    }
  }

  function LoadingSpinner() {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  function ErrorAlert() {
    if (showErrorAlert) {
      return (
        <Alert
          variant="danger"
          onClose={() => setShowErrorAlert(false)}
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
            http://localhost:4000/secret/{id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            With this link your friend will be able to see your secret message!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
          <CopyToClipboard text={`http://localhost:4000/secret/${id}`}>
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

        <Button type="submit" className="submitButton">
          Click here to submit!
        </Button>
      </Form>

      {loadingStatus ? <LoadingSpinner /> : null}

      <MyVerticallyCenteredModal
        show={modalState}
        onHide={() => setModalState(inactive)}
      />
    </Container>
  );
}

export default App;
