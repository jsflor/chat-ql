import {Container} from "react-bootstrap";
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import './App.scss'

import ApolloProvider from "./ApolloProvider";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

const App = () => {
  return (
  <ApolloProvider>
      <BrowserRouter>
          <Container className={'pt-5'}>
              <Switch>
                  <Route path={'/'} exact component={Home} />
                  <Route path={'/register'} exact component={Register} />
                  <Route path={'/login'} exact component={Login} />
              </Switch>
          </Container>
      </BrowserRouter>
  </ApolloProvider>
  );
}

export default App;
