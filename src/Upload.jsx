import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Upload.css';
import { Row, Table, Col, Alert } from 'react-bootstrap';
import { JSON_SCHEMA } from './jsonSchema';
const Ajv = require('ajv').default;

export function Upload({ children }) {
  const [files, setFiles] = useState('');
  const [fileName, setFileName] = useState('');
  const [validSchema, setValidSchema] = useState(0);
  const handleChange = (e) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (!e.target.files) {
      setValidSchema(1);
      return;
    }
    const [{ name }] = e.target.files;
    setFileName(name);
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (e) => {
      const jsonData = JSON.parse(e.target.result);
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile(JSON_SCHEMA);
      const validSchema = validate(jsonData);
      if (validSchema) {
        setFiles(jsonData);
        setValidSchema(3);
      } else {
        setValidSchema(2);
      }
    };
  };

  const handleGrid = (files) => {
    if (files && files !== '')
      return (
        <Table striped bordered hover variant='dark'>
          <thead>
            <tr>
              <th>#</th>
              <th>Domain</th>
              <th>Visitors</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {files.map(({ domain, visitors, date }, index) =>
              index < 20 ? (
                <tr key={index + 1}>
                  <td>{index + 1}</td>
                  <td>{domain}</td>
                  <td>{visitors}</td>
                  <td>{date.substring(0, 10)}</td>
                </tr>
              ) : null
            )}
          </tbody>
        </Table>
      );
  };

  const prepareMessageCard = () => {
    if (files && files !== '' && validSchema === 3) {
      return (
        <Alert variant='success'>
          The file is processed successfully and is showing the first 20
          results.
        </Alert>
      );
    } else if (validSchema === 2 && !files) {
      handleGrid(files);
      return (
        <Alert variant='danger'>
          There are some errors in json file. Please fix it.
        </Alert>
      );
    } else {
      handleGrid(files);
      return <Alert variant='warning'>Please upload a file to continue.</Alert>;
    }
  };

  return (
    <div class='file-input'>
      <Row className='justify-content-md-center'>
        <h2>Please upload a json file</h2>
      </Row>
      <Row className='justify-content-md-center'>
        <input
          type='file'
          id='file'
          accept='.json'
          className='file'
          onChange={handleChange}
        />
        <Col md='auto'>
          <label for='file'>Select file</label>
        </Col>
      </Row>
      <Row>
        <Col md='auto'>
          <p className='file-name' style={{ fontSize: '1.5rem' }}>
            {fileName}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>{prepareMessageCard()}</Col>
      </Row>
      {handleGrid(files)}
    </div>
  );
}
