import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Row, Card, Col, Icon, message, Spin, Modal } from 'antd';
import { SystemModel, CheckAuth } from 'components';
import * as systemListActions from 'redux/modules/systemList';
const { SystemItem, CreateSystem, EditSystem } = SystemModel;
@connect(
  state => ({
    system: state.systemList.system,
    pathAuths: state.systemList.pathAuths,
    listLoading: state.systemList.listLoading,
    itemLoading: state.systemList.itemLoading,
    creating: state.systemList.creating,
    updating: state.systemList.updating,
    deleting: state.systemList.deleting,
    createShow: state.systemList.createShow,
    editShow: state.systemList.editShow,
    msg: state.systemList.msg,
    error: state.systemList.error
  }),
  { ...systemListActions })
export default class List extends Component {
  static propTypes = {
    system: PropTypes.array.isRequired,
    pathAuths: PropTypes.array.isRequired,
    listLoading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    creating: PropTypes.bool.isRequired,
    updating: PropTypes.bool.isRequired,
    deleting: PropTypes.bool.isRequired,
    createShow: PropTypes.bool.isRequired,
    editShow: PropTypes.object,
    loadList: PropTypes.func.isRequired,
    showCreate: PropTypes.func.isRequired,
    showEdit: PropTypes.func.isRequired,
    hideCreate: PropTypes.func.isRequired,
    hideEdit: PropTypes.func.isRequired,
    createSystem: PropTypes.func.isRequired,
    editSystem: PropTypes.func.isRequired,
    deleteSystem: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired,
    resetMsg: PropTypes.func.isRequired,
    msg: PropTypes.string,
    error: PropTypes.string
  }
  constructor() {
    super();
  }
  componentWillMount() {
    const path = location.pathname;
    this.props.loadList(path);
  }
  componentWillReceiveProps(nextProps) {
    const { msg, error} = nextProps;
    if (msg && msg !== this.props.msg) {
      message.success(msg);
      this.props.resetMsg();
    }
    if (error && error !== this.props.error) {
      message.error(error);
      this.props.resetError();
    }
  }
  showCreate = () => {
    this.props.showCreate();
  }
  hideCreate = () => {
    this.props.hideCreate();
  }
  showEdit = (item) => {
    this.props.showEdit(item);
  }
  hideEdit = () => {
    this.props.hideEdit();
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
  createSystem = () => {
    const _this = this;
    this.validateForm((values) => {
      _this.props.createSystem(values);
    });
  }
  editSystem = () => {
    const { editShow } = this.props;
    const _this = this;
    this.validateForm((values) => {
      _this.props.editSystem(editShow, values);
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  deleteSystem = (item) => {
    const _this = this;
    Modal.confirm({
      title: '删除系统',
      content: '系统删除后，所有与之关联的数据将收到影响，确定删除么？',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {_this.props.deleteSystem(item);}
    });
  }
  render() {
    const { pathAuths, system, listLoading, itemLoading, creating, updating, deleting, createShow, editShow } = this.props;
    const loading = listLoading || itemLoading || deleting || false;
    const styles = require('./list.scss');
    return (
      <div>
        <Helmet title="系统权限管理" />
        <Spin spinning={loading} size="large">
          <Card title="系统列表">
            <Row type="flex" justify="start">
              {
                system.map((item, key) => {
                  if (item) {
                    return (
                      <SystemItem auths={pathAuths} hideEdit={false} editSystem={this.showEdit} deleteSystem={this.deleteSystem} item={item} key={key} />
                    );
                  }
                })
              }
              <CheckAuth code="createSystem" auths={pathAuths}>
                <Col span="4">
                  <a className={styles.addLink} onClick={this.showCreate}>
                    <div className={styles.addIconContainer}>
                      <Icon type="plus" className={styles.addIcon} />
                    </div>
                    <p className={styles.addContent}>
                      添加系统
                    </p>
                  </a>
                </Col>
              </CheckAuth>
            </Row>
          </Card>
          {createShow ?
            <CreateSystem show={createShow} loading={creating} ref={this.saveFormRef} onCancel={this.hideCreate} onCreate={this.createSystem}/>
            : null
          }
          {editShow ?
            <EditSystem show={editShow} loading={updating} ref={this.saveFormRef} onCancel={this.hideEdit} onCreate={this.editSystem}/>
            : null
          }
        </Spin>
      </div>
    );
  }
}
