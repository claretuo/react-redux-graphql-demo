/**
 * Created by peach on 16-3-16.
 */
import React, { Component, PropTypes } from 'react';
import { Icon, Popover } from 'antd';
import { Link } from 'react-router';

export default class Header extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    showReset: PropTypes.func.isRequired,
    showDetail: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
  }
  showDetail = () => {
    this.props.showDetail();
  }
  showReset = () => {
    this.props.showReset();
  }
  logout = () => {
    this.props.logout();
  }

  render() {
    const { user } = this.props;
    const styles = require('./Header.scss');
    const userLink = (
      <ul className={styles.userLink}>
        { user && user.userNum !== 'G-00000000' ?
          <li><a onClick={this.showDetail}>个人详情</a></li>
          : null
        }
        { user && user.userNum !== 'G-00000000' ?
          <li><a onClick={this.showReset}>修改密码</a></li>
          : null
        }
        <li><a onClick={this.logout}>退出</a></li>
      </ul>
    );
    return (
      <header className={ styles.header }>
        <div className={ styles.logo } >
          <Link to="/"><i className={styles.icon}></i>权限系统</Link>
          </div>
          <Popover
            content={userLink}
            placement="bottom"
          >
            <div className={styles.info}>
              <Icon type="user" />
              <span className={styles.userName}>
                {user && user.realName}
              </span>
            </div>
          </Popover>
      </header>
    );
  }
}
