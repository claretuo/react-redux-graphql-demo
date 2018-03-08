import React, {Component, PropTypes} from 'react';
import {Icon} from 'antd';

export default class SystemNode extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    operation: PropTypes.string.isRequired
  }
  constructor() {
    super();
  }
  render() {
    const {item, create, operation} = this.props;
    const styles = require('./systemNode.scss');
    return (
      <div>
        <div className={styles.systemGroup}>
          <span className={styles.systemName}>{item.name || item.menubtnName}</span>
          <a className={styles.createLink} onClick={create}><Icon type="plus" />{operation}</a>
        </div>
      </div>
    );
  }
}
