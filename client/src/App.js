import {Container} from "react-bootstrap";
import {BrowserRouter, Switch} from 'react-router-dom';

import './App.scss'

import ApolloProvider from "./ApolloProvider";
import {AuthProvider} from './context/auth';
import {MessageProvider} from './context/message';

import Home from "./pages/home/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

import DynamicRoute from "./util/DynamicRoute";

const App = () => {
  return (
  <ApolloProvider>
      <AuthProvider>
          <MessageProvider>
              <BrowserRouter>
                  <Container className={'pt-5'}>
                      <Switch>
                          <DynamicRoute path={'/'} exact component={Home} authenticated />
                          <DynamicRoute path={'/register'} exact component={Register} guest />
                          <DynamicRoute path={'/login'} exact component={Login} guest />
                      </Switch>
                  </Container>
              </BrowserRouter>
          </MessageProvider>
      </AuthProvider>
  </ApolloProvider>
  );
}

export default App;
