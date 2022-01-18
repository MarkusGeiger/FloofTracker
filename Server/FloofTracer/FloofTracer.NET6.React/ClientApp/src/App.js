import React, { Component } from 'react';
import { Route } from 'react-router';
import { Home } from './components/Home';

import 'antd/dist/antd.dark.css';
import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  constructor(props) {
    super(props);
    this.state = { darkMode: false };
  }

  render () {
    return (
      <Route exact path='/' component={Home} />
    );
  }
}
