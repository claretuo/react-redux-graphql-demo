import { Component, PropTypes } from 'react';

export default class Verify extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    children: PropTypes.object,
    message: PropTypes.string
  }
  constructor() {
    super();
  }
  render() {
    const { show, children, message } = this.props;
    return (
      show ?
      children
      : message || null
    );
  }
}
