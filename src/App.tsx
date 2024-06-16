import React, { useState } from 'react';
import { Card, Alert, Navbar, Container, Nav, Button } from "react-bootstrap";
import { RootState } from "./store";
import Form from "react-bootstrap/Form";
import { nanoid } from "nanoid";
import { S3_file_params } from "./types/S3_file_params";
import { handlePreSignedUrl, putFile } from "./utils/S3_utils";
import { getErrorMessage } from "./utils/utilities";
import { logOut } from "./auth/authenticate";
import AuthModal from './components/modals/authModal';
import DbContainer from "./components/tables/dbContainer";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useAppDispatch, useAppSelector } from './types/hooks';
import { clearStates, openModal } from './store/auth-slice';

function App() {
  const [errorMessage, seterrorMessage] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const dispatch = useAppDispatch();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (e.target.value.length > 0) {
      seterrorMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files && e.target.files[0]);
    if (e.target.files) {
      seterrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadStatus('');

    if (!text) {
      seterrorMessage('text input should not be empty');
      return;
    }

    if (!file) {
      seterrorMessage('file input should not be empty');
      return;
    }

    console.log(file);

    if (file.type !== "text/plain") {
      seterrorMessage('File type should be of txt.');
      return;
    }

    // Prepare parameters to upload to S3 and DynamoDB.
    const id = nanoid();

    const s3_params: S3_file_params = {
      s3_region: process.env.REACT_APP_AWS_REGION || '',
      s3_bucket: process.env.REACT_APP_AWS_S3_BUCKET || '',
      s3_key: file?.name,
    };

    // Upload file status
    try {
      const upload_url = await handlePreSignedUrl(
        s3_params
      );
      setUploadStatus(`Upload Url obtained. Uploading...`);

      const uploadResponse = await putFile(upload_url, file);

      if (uploadResponse.status === 200) {
        setUploadStatus('Upload Succeeded');
      } else {
        setUploadStatus('Upload Failed');
      }
    } catch (error) {
      setUploadStatus(getErrorMessage(error) || '');
    }
  }

  const handleLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    logOut();
    dispatch(clearStates());
  }

  const toggleAuth = () => {
    dispatch(openModal());
  }

  return (
    <>
      <Navbar expand="lg" bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Brand</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {useAppSelector((state: RootState) => state.auth.accessToken.length == 0)
                &&
                <Nav.Link>
                  <Button variant="warning" onClick={toggleAuth}>
                    Login / SignUp
                  </Button>
                </Nav.Link>}

              {useAppSelector((state: RootState) => state.auth.accessToken.length > 0) && <Nav.Link>
                <Button variant="warning" onClick={handleLogout}>
                  Logout
                </Button>
              </Nav.Link>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="App p-5">
        {errorMessage.length > 0 && <Alert variant='danger'>{errorMessage}</Alert>}

        <Card style={{ width: '25rem' }}>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Text Input:</Form.Label>
                <Form.Control type='text' placeholder='text input' onChange={handleTextChange}></Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>File Input:</Form.Label>
                <Form.Control type='file' placeholder='select file' onChange={handleFileChange}></Form.Control>
              </Form.Group>
              <br />
              <Button variant='primary' type='submit'>
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {uploadStatus.length > 0 && <Alert variant='primary'>{uploadStatus}</Alert>}

        { useAppSelector((state: RootState) => state.auth.email.length > 0) && <DbContainer />}
      </div>
        
      <AuthModal />
    </>
  );
}

export default App;
