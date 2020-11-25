import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import './App.css';
import Layout from "./components/Hoc/Layout/Layout";
import Boards from "./containers/Boards/Boards";
import SingleBoard from "./containers/SingleBoard/SingleBoard";

import "bootstrap/dist/css/bootstrap.min.css";

import { Provider } from "react-redux";
import store from "./store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Layout>
            <BrowserRouter>
              <Switch>
                <Route path="/board" component={SingleBoard} />
                <Route path="/" exact component={Boards} />
              </Switch>
            </BrowserRouter>
          </Layout> 
        </div>
      </Provider>
    );
  }
  
}

export default App;
