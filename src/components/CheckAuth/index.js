import React, { Component, PropTypes } from 'react';

export default class CheckAuth extends Component {
  static propTypes = {
    auths: PropTypes.array.isRequired,
    children: PropTypes.object,
    message: PropTypes.string,
    code: PropTypes.string.isRequired,
  }
  constructor() {
    super();
  }
  render() {
    const { code, auths, children, message } = this.props;
    let msgNode = null;
    if (message) {
      msgNode = (
        <span>
          {message}
        </span>
      );
    }
    return (
      auths.some((item) => item.authNum === code) ?
      children
      : msgNode
    );
  }
}
