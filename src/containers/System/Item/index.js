import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Card, Row, Col, Icon, Tabs, Tree, message, Spin, Modal } from 'antd';
import Helmet from 'react-helmet';
import * as systemActions from 'redux/modules/authPer';
import * as resourceActions from 'redux/modules/resource';
import { SystemModel, CheckAuth } from 'components';

const { SystemForm, CreatePermission } = SystemModel;
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;

@connect(
  state => ({
    itemLoading: state.authPer.itemLoading || state.resource.itemLoading,
    updating: state.authPer.updating || state.resource.updating,
    creating: state.authPer.creating || state.resource.creating,
    deleting: state.authPer.deleting || state.resource.deleting,
    data: state.authPer.system,
    pathAuths: state.authPer.pathAuths,
    resource: state.resource.resource,
    selectItem: state.authPer.selectItem,
    selectResource: state.resource.selectResource,
    createShow: state.authPer.createShow,
    draggable: state.authPer.draggable || state.resource.draggable,
    msg: state.authPer.msg || state.resource.msg,
    error: state.authPer.error || state.resource.error,
    system: state.authPer.systemItem,
    currentUser: state.auth.user
  }),
  { ...systemActions, ...resourceActions })
export default class Item extends Component {
  static propTypes = {
    itemLoading: PropTypes.bool.isRequired,
    updating: PropTypes.bool.isRequired,
    creating: PropTypes.bool.isRequired,
    deleting: PropTypes.bool.isRequired,
    draggable: PropTypes.bool.isRequired,
    createShow: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    pathAuths: PropTypes.array.isRequired,
    resource: PropTypes.array.isRequired,
    system: PropTypes.object,
    currentUser: PropTypes.object,
    loadItem: PropTypes.func.isRequired,
    updateSystem: PropTypes.func.isRequired,
    resetSystem: PropTypes.func.isRequired,
    dropTreeNode: PropTypes.func.isRequired,
    selectItem: PropTypes.object,
    selectResource: PropTypes.object,
    toggleSelect: PropTypes.func.isRequired,
    createPermission: PropTypes.func.isRequired,
    deletePermission: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    saveResourceData: PropTypes.func.isRequired,
    editTree: PropTypes.func.isRequired,
    msg: PropTypes.string,
    error: PropTypes.string,
    hideCreate: PropTypes.func.isRequired,
    showCreate: PropTypes.func.isRequired,
    resetMsg: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired,
    loadSystem: PropTypes.func.isRequired,
    loadResource: PropTypes.func.isRequired,
    toggleResourceSelect: PropTypes.func.isRequired,
    dropResourceTreeNode: PropTypes.func.isRequired,
    deleteResource: PropTypes.func.isRequired,
    resetResource: PropTypes.func.isRequired,
    createResource: PropTypes.func.isRequired,
    resetResourceMsg: PropTypes.func.isRequired,
    resetResourceError: PropTypes.func.isRequired,
    editResourceTree: PropTypes.func.isRequired,
    resetAuthData: PropTypes.func.isRequired,
    resetResourceData: PropTypes.func.isRequired,
  }
  constructor() {
    super();
    this.state = {
      selectKey: '1'
    };
  }
  componentWillMount() {
    let sysId = location.pathname.split('/');
    const path = `/${sysId[1]}`;
    sysId = parseInt(sysId[sysId.length - 1], 10);
    this.props.loadItem(sysId);
    this.props.loadSystem(sysId, path);
    this.props.loadResource(sysId);
  }
  componentWillReceiveProps(nextProps) {
    const { msg, error, creating } = nextProps;
    if ( msg && msg !== this.props.msg) {
      message.success(msg);
      this.props.resetMsg();
      this.props.resetResourceMsg();
    }
    if (error && error !== this.props.error) {
      message.error(error);
      this.props.resetError();
      this.props.resetResourceError();
    }
    if (!creating && this.props.creating) {
      this.props.hideCreate();
    }
  }
  componentWillUnmount() {
    this.props.resetAuthData();
    this.props.resetResourceData();
  }
  onDrop = (info) => {
    const {currentUser, data, resource} = this.props;
    const {selectKey} = this.state;
    if (selectKey === '1') {
      this.props.dropTreeNode(data, info, currentUser);
    } else {
      this.props.dropResourceTreeNode(resource, info, currentUser);
    }
  }
  onSelect = (info) => {
    const {selectKey} = this.state;
    if (selectKey === '1') {
      this.props.toggleSelect(this.props.data, info);
    } else {
      this.props.toggleResourceSelect(this.props.resource, info);
    }
  }
  getTypeIcon = (item) => {
    switch (`${item.type}`) {
      case 'FOLDER':
        return 'folder';
      case 'PAGE':
        return 'file-text';
      case 'OPERATION':
        return 'edit';
      default:
        console.log('unknow role type');
    }
  }
  changeTab = (key) => {
    const _this = this;
    const {draggable, system} = this.props;
    if (draggable) {
      Modal.confirm({
        title: '标签切换确认',
        content: '当前正在编辑数据，确认放弃保存并切换标签么？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          if (key === '2') {
            _this.props.resetSystem(system.id);
          } else {
            _this.props.resetResource(system.id);
          }
          _this.setState({
            selectKey: key
          });
        }
      });
    } else {
      this.setState({
        selectKey: key
      });
    }
  }
  editTree = () => {
    const {selectKey} = this.state;
    if (selectKey === '1') {
      this.props.editTree();
    } else {
      this.props.editResourceTree();
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
  saveTree = () => {
    const { data, resource, system, currentUser } = this.props;
    const {selectKey} = this.state;
    if (selectKey === '1') {
      this.props.saveData(system.id, data, (currentUser && currentUser.userNum !== 'G-00000000'));
    } else {
      this.props.saveResourceData(system.id, resource, (currentUser && currentUser.userNum !== 'G-00000000'));
    }
  }
  reloadTree = () => {
    const {system} = this.props;
    this.props.resetSystem(system.id);
    this.props.resetResource(system.id);
  }
  createRole = () => {
    this.props.showCreate();
  }
  deleteRole = () => {
    Modal.confirm({
      title: '删除权限确认',
      content: '删除该权限后，所有与该权限相关的角色和用户将被影响，确定删除该权限么？',
      okText: '确认',
      cancelText: '取消',
      onOk: this.confirmDelete
    });
  }
  confirmDelete = () => {
    const {selectItem, selectResource} = this.props;
    const {selectKey} = this.state;
    if (selectKey === '1') {
      if (!selectItem.children || !selectItem.children.length) {
        this.props.deletePermission(selectItem);
      } else {
        message.error('无法删除权限，该权限有子权限');
      }
    } else {
      if (!selectResource.children || !selectResource.children.length) {
        this.props.deleteResource(selectResource);
      } else {
        message.error('无法删除权限，该权限有子权限');
      }
    }
  }
  editSystem = (changedFields) => {
    const _this = this;
    const { selectItem, selectResource } = this.props;
    const {selectKey} = this.state;
    const chooseKey = selectKey === '1' ? selectItem.id : selectResource.id;
    const loop = (dataform, key, callback) => {
      dataform.forEach((item) => {
        if (item.id === key) {
          return callback(item);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const { data, resource } = this.props;
    if (selectKey === '1') {
      Object.keys(changedFields).map((key) => {
        if (!changedFields[key].dirty && !changedFields[key].errors) {
          loop(data, chooseKey, (item) => {
            _this.props.updateSystem(data, Object.assign({}, item, {[key]: changedFields[key].value}));
          });
        }
      });
    } else {
      Object.keys(changedFields).map((key) => {
        if (!changedFields[key].dirty && !changedFields[key].errors) {
          loop(resource, chooseKey, (item) => {
            _this.props.updateResource(resource, Object.assign({}, item, {[key]: changedFields[key].value}));
          });
        }
      });
    }
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  hideCreate = () => {
    this.props.hideCreate();
  }
  createPermission = () => {
    const {selectItem, system, selectResource} = this.props;
    const {selectKey} = this.state;
    const _this = this;
    this.validateForm((values) => {
      if (selectKey === '1') {
        _this.props.createPermission(system, selectItem, values);
      } else {
        _this.props.createResource(system, selectResource, values);
      }
    });
  }
  render() {
    const { pathAuths, data, resource, selectResource, system, selectItem, createShow, draggable, itemLoading, updating, creating, deleting } = this.props;
    const styles = require('./item.scss');
    const { selectKey } = this.state;
    const loading = updating || itemLoading || deleting || false;
    const loop = dataForm => dataForm.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key={item.id} title={<span><Icon type={`${this.getTypeIcon(item)}`} />{item.name}</span>}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key={item.id} title={<span><Icon type={`${this.getTypeIcon(item)}`} />{item.name}</span>} />;
    });
    let operations = null;
    if (draggable) {
      operations = (
        <div className={styles.treeOpration}>
          <a onClick={this.saveTree}><Icon type="save" />保存</a>
          <a onClick={this.reloadTree}><Icon type="reload" />取消</a>
        </div>
      );
    }else {
      operations = (
        <div className={styles.treeOpration}>
          <a onClick={this.editTree}><Icon type="edit" />编辑</a>
        </div>
      );
    }
    const selectNode = (
      <Col span="10" offset="2" className={styles.borderBox}>
        <SystemForm auth auths={pathAuths} ref={this.saveFormRef} system={selectItem} editAble={draggable} createRole={this.createRole} deleteRole={this.deleteRole} onChange={this.editSystem} />
      </Col>
    );
    const selectRnode = (
      <Col span="10" offset="2" className={styles.borderBox}>
        <SystemForm auths={pathAuths} ref={this.saveFormRef} system={selectResource} editAble={draggable} createRole={this.createRole} deleteRole={this.deleteRole} onChange={this.editSystem} />
      </Col>
    );
    const tabNode = (
      <div>
        <Col span="6" className={styles.borderBox}>
          <Tree
            draggable={draggable}
            onDrop={this.onDrop}
            onSelect={this.onSelect}
            selectedKeys={[selectItem && selectItem.id]}
            defaultExpandAll
          >
            {loop(data)}
          </Tree>
        </Col>
        { selectItem ?
          selectNode
          : null
        }
      </div>
    );
    const tabNodeResource = (
      <div>
        <Col span="6" className={styles.borderBox}>
          <Tree
            draggable={draggable}
            onDrop={this.onDrop}
            onSelect={this.onSelect}
            selectedKeys={[selectResource && selectResource.id]}
            defaultExpandAll
          >
            { loop(resource) }
          </Tree>
        </Col>
        { selectResource ?
          selectRnode
          : null
        }
      </div>
    );
    return (
      <div>
        <Helmet title={system && system.name || '系统加载中...'} />
        <Spin spinning={loading} size="large">
          <Card title={system && system.name || '系统加载中...'}>
            <Row type="flex" justify="start">
              <Tabs activeKey={selectKey} onTabClick={this.changeTab} tabBarExtraContent={
                  selectItem && selectKey === '1' || selectResource && selectKey === '2' ?
                  <CheckAuth auths={pathAuths} code={selectKey === '1' ? 'batchUpdateAuths' : 'batchUpdateResource'}>
                    {operations}
                  </CheckAuth>
                  : null
                } style={{width: '100%'}}>
                <TabPane tab="功能权限" key="1">
                  { data && data.length ? tabNode : null}
                </TabPane>
                <TabPane tab="资源权限" key="2">
                  { resource && resource.length ? tabNodeResource : null}
                </TabPane>
              </Tabs>
            </Row>
          </Card>
          {createShow ?
            <CreatePermission auth={selectKey === '1'} loading={creating} parentName={ selectKey === '1' ? selectItem && selectItem.id !== 'p_-1' && selectItem.name : selectResource && selectResource.id !== 'p_-1' && selectResource.name } show={createShow} ref={this.saveFormRef} onCancel={this.hideCreate} onCreate={this.createPermission}/>
            : null
          }
        </Spin>
      </div>
    );
  }
}
