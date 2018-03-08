import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import config from '../../config';
import * as authActions from 'redux/modules/auth';
import { Header, SideBar, Verify } from 'components';
import { Breadcrumb, Modal, message, BackTop } from 'antd';
import { Link } from 'react-router';
import { Pass } from 'components';
const { Reset } = Pass;

@connect(
  state => ({
    user: state.auth.user,
    menuList: state.auth.menuList,
    resetShow: state.auth.resetShow,
    msg: state.auth.msg,
    error: state.auth.error,
    reseting: state.auth.reseting
  }),
  { ...authActions })
export default class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    menuList: PropTypes.array.isRequired,
    logout: PropTypes.func.isRequired,
    showReset: PropTypes.func.isRequired,
    hideReset: PropTypes.func.isRequired,
    confirmReset: PropTypes.func.isRequired,
    resetShow: PropTypes.bool.isRequired,
    reseting: PropTypes.bool.isRequired,
    resetMsg: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired,
    msg: PropTypes.string,
    error: PropTypes.string,
    routes: PropTypes.array,
    params: PropTypes.object
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    router: PropTypes.object
  }
  constructor() {
    super();
    this.state = {
      detailShow: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { user, msg, error } = nextProps;
    const { router } = this.context;
    if (user && !this.props.user) {
      router.push('/');
    }
    if (!user && this.props.user) {
      router.push('/signin');
    }
    if (msg && msg !== this.props.msg) {
      message.success(msg);
      this.props.resetMsg();
    }
    if (error && error !== this.props.error) {
      message.error(error);
      this.props.resetError();
    }
  }

  validateForm = (callback) => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      callback(values);
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }
  confirmReset = () => {
    const {user} = this.props;
    this.validateForm((values) => {
      this.props.confirmReset(user, values);
    });
  }
  hideReset = () => {
    this.props.hideReset();
  }
  showDetail = () => {
    this.setState({
      detailShow: true
    });
  }
  hideDetail = () => {
    this.setState({
      detailShow: false
    });
  }

  render() {
    const { user, children, showReset, logout, resetShow, reseting, menuList } = this.props;
    const { detailShow } = this.state;
    const styles = require('./App.scss');
    const itemRender = (route, params, routes, paths) => {
      const last = routes.indexOf(route) === routes.length - 1;
      return last ? <span>{route.breadcrumbName}</span> : <Link to={paths.join('/')}>{route.breadcrumbName}</Link>;
    };
    let userNode = null;
    if (user && user.userNum !== 'G-00000000') {
      userNode = (
        <div className={styles.infoDetail}>
          <p>
            <span>姓名：</span>
            { user.realName }
          </p>
          <p>
            <span>部门：</span>
            { user.department && user.department.name || '无' }
          </p>
          <p>
            <span>内部邮箱：</span>
            { user.innerEmail }
          </p>
          <p>
            <span>手机号码：</span>
            { user.phone }
          </p>
        </div>
      );
    }
    const path = location.pathname;
    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <Verify show={path !== '/signin' && !!user}>
          <Header user={user} showDetail={this.showDetail} showReset={showReset} logout={logout} />
        </Verify>
        <Verify show={path !== '/signin' && !!user}>
          <SideBar menuList={menuList} />
        </Verify>
        { path !== '/signin' && user ?
          <div className={styles.appContent} style={{ left: '240px', maxHeight: window.screen.height - 90 + 'px', overflowY: 'auto'}}>
            {children}
            <BackTop />
          </div>
          : children
        }
        <Verify show={path !== '/signin' && !!user}>
          <div className={styles.breadcrumb}>
            <Breadcrumb routes={this.props.routes} params={this.props.params} itemRender={itemRender} />
          </div>
        </Verify>
        { resetShow ?
          <Reset show={resetShow} loading={reseting} style={{zIndex: 9999}} ref={this.saveFormRef} onCancel={this.hideReset} onCreate={this.confirmReset} />
          : null
        }
        <Modal title="个人信息" visible={detailShow && user && user.userNum !== 'G-00000000'} width="30%" onCancel={this.hideDetail} footer={false}>
          { userNode }
        </Modal>
      </div>
    );
  }
}
