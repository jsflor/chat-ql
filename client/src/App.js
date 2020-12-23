import {Container} from "react-bootstrap";
import './App.scss'

import Register from "./pages/Register";

const App = () => {
  return (
    <Container className={'pt-5'}>
      <Register/>
    </Container>
  );
}

export default App;
