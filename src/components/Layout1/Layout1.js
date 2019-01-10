import React, { Component } from 'react';

class Layout1 extends Component {
  render() {
    return (
      <div className="app flex-row align-items-center">
        {this.props.children}
      </div>
    );
  }
}

export default Layout1;
