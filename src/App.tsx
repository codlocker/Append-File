import React, { useState } from 'react';
import { Form, Button, Card, Alert } from "react-bootstrap";
import { nanoid } from "nanoid";
import { S3_file_params } from "./types/S3_file_params";
import { handlePreSignedUrl } from "./utils/S3_utils";
import { getErrorMessage } from "./utils/utilities";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [errorMessage, seterrorMessage] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

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
      
      console.log(upload_url);

      setUploadStatus(upload_url);
    } catch (error) {
      setUploadStatus(getErrorMessage(error) || '');
    }
  }

  return (
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
    </div>
  );
}

export default App;
