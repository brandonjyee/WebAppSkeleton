import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';

import {Home} from './components';

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
@withRouter
export default class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route component={Home} />
      </Switch>
    );
  }
}
