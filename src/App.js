import { Button, Container } from 'react-bootstrap';
import { Upload } from './Upload';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <Container>
        <Upload>
          <Button variant='primary'>Upload files</Button>
        </Upload>
      </Container>
    </div>
  );
}

export default App;
