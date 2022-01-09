import React, { Component } from 'react';
//import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
        //<NavMenu />
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
