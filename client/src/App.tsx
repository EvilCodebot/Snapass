import "./App.css";
import axios from "axios";
import config from "./config.json";
import React, { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import Dropdown from "react-bootstrap/Dropdown";
import { CopyToClipboard } from "react-copy-to-clipboard";
import QRCode from "qrcode.react";

let id = ""; // stores secretID, later on used to getSecret

interface props {
  onHide: any;
  show: any;
}

function App() {
  const inactive = false;
  const active = true;

  const [secret, setSecret] = useState(""); // stores user input text
  const [loadingStatus, setLoadingStatus] = useState(inactive); // submit button changes to loading if  loadingStatus state is active
  const [errorResponse, setErrorResponse] = useState(""); // stores error response, will be used in alert
  const [showErrorAlert, setShowErrorAlert] = useState(inactive); // bootstrap alert to display error
  const targetTipOne = useRef(null); // for positioning popover
  const targetTipTwo = useRef(null);
  const [resultModalState, setResultModalState] = useState(inactive); // if state is active, ResultModalState appears
  const [tutorialModalState, setTutorialModalState] = useState(active); // modal appears when user first enters website to give them a tutorial, activates TipOne when closed
  const [showTipOne, setShowTipOne] = useState(inactive); // used for activating tip popover
  const [showTipTwo, setShowTipTwo] = useState(inactive);
  const [language, setLanguage] = useState("PlainText"); // set language for dropdown button

  function handleChange(evt: React.ChangeEvent<HTMLTextAreaElement>) {
    setSecret(evt.target.value);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // checking if secret is empty, if empty error alert appears
    if (!secret) {
      setShowErrorAlert(active);
      setErrorResponse("Secret can not be empty");
    } else {
      setLoadingStatus(active);

      // axios.post to send secret value, recieves secretID that can later be used to access secret in response
      // secret and language value first stored in a JSON then its turned into a string, finally btoa turn the string into base64
      axios
        .post(
          config.apiPostSecret,
          {
            secret: btoa(
              JSON.stringify({
                secret: secret,
                language: language,
              })
            ),
          },
          { timeout: 20000 }
        ) // timeout 20 seconds
        .then(function (response) {
          id = response.data; // stores returned secretID

          setLoadingStatus(inactive);
          setResultModalState(active);
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);

            setErrorResponse(error.response.data); // stores error response, will be used in error alert
            setShowErrorAlert(active);
            setLoadingStatus(inactive);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);

            setErrorResponse(error.message); // stores error response, will be used in error alert
            setShowErrorAlert(active);
            setLoadingStatus(inactive);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
      setSecret(""); // clears input area
    }
  }

  // when axios is still pending, will return loading button to indicate user it's still pending
  function SubmitButton() {
    if (loadingStatus == inactive) {
      return (
        <>
          <Button
            type="submit"
            variant="warning"
            className="submitButton"
            ref={targetTipTwo}
          >
            Click here to submit!
          </Button>

          <Overlay target={targetTipTwo} show={showTipTwo} placement="top">
            <Popover id="popover-basic">
              <Popover.Title
                as="h3"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                Tip 2
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => {
                    setShowTipTwo(inactive);
                  }}
                >
                  Done
                </Button>
              </Popover.Title>
              <Popover.Content>
                When your ready, click on the button, a shareable link will be
                automatically generated for you to share with your friends.
              </Popover.Content>
            </Popover>
          </Overlay>
        </>
      );
    } else if (loadingStatus == active) {
      return (
        <Button className="submitButton" variant="warning" disabled>
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

  function MyResultModal(props: props) {
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
            Secret will be automatically destoryed after viewed once.
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* window.location.href gets current url */}
          <p style={{ borderStyle: "solid", borderRadius: "5px" }}>
            {window.location.href}secret/{id}{" "}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {" "}
            <QRCode value={`${window.location.href}secret/${id}`} />
            Your friend can also access your secret via this QR code.
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>

          <CopyToClipboard text={`${window.location.href}secret/${id}`}>
            <Button variant="warning">Copy</Button>
          </CopyToClipboard>
        </Modal.Footer>
      </Modal>
    );
  }

  function MyTutorialModal(props: props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Welcome</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Snapass lets you easily share &quot;secret&quot; message with you
          friend over the brower. messages in Snapass will be automatically
          deleted by default from our servers after we detect they&rsquo;ve been
          opened.
        </Modal.Body>

        <Modal.Footer>
          <Button variant="warning" onClick={props.onHide}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <div className="background">
      <div className="container">
        {showErrorAlert ? (
          <ErrorAlert />
        ) : (
          <span className="appTitle">Snapass</span>
        )}

        <Form onSubmit={handleSubmit} className="formArea">
          <textarea
            className="inputArea"
            placeholder="Please enter your secret here!"
            value={secret}
            onChange={handleChange}
          ></textarea>

          <div className="containerTwo">
            <Dropdown className="dropDownButton">
              <Dropdown.Toggle
                variant="warning"
                id="dropdown-basic"
                ref={targetTipOne}
              >
                {language}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onSelect={() => {
                    setLanguage("CSS");
                  }}
                >
                  CSS
                </Dropdown.Item>
                <Dropdown.Item
                  onSelect={() => {
                    setLanguage("Javascript");
                  }}
                >
                  Javascript
                </Dropdown.Item>
                <Dropdown.Item
                  onSelect={() => {
                    setLanguage("JSON");
                  }}
                >
                  JSON
                </Dropdown.Item>
                <Dropdown.Item
                  onSelect={() => {
                    setLanguage("Markdown");
                  }}
                >
                  Markdown
                </Dropdown.Item>
                <Dropdown.Item
                  onSelect={() => {
                    setLanguage("Python");
                  }}
                >
                  Python
                </Dropdown.Item>
                <Dropdown.Item
                  onSelect={() => {
                    setLanguage("PlainText");
                  }}
                >
                  PlainText
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Overlay target={targetTipOne} show={showTipOne} placement="top">
              <Popover id="popover-basic">
                <Popover.Title
                  as="h3"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  Tip 1
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => {
                      setShowTipOne(inactive);
                      setShowTipTwo(active);
                    }}
                  >
                    ok
                  </Button>
                </Popover.Title>
                <Popover.Content>
                  Select the format you wish to enter, supports original
                  markdown and sytnax highlighting. Just leave it on PlainText
                  if you do not know what this does.
                </Popover.Content>
              </Popover>
            </Overlay>

            <SubmitButton />
          </div>
        </Form>

        <MyTutorialModal
          show={tutorialModalState}
          onHide={() => {
            setTutorialModalState(inactive);
            setShowTipOne(true);
          }}
        />

        <MyResultModal
          show={resultModalState}
          onHide={() => setResultModalState(inactive)}
        />
      </div>
    </div>
  );
}

export default App;
