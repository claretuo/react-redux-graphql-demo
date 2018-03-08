import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Card, Row, Col, Icon, Tree, Spin, message, Modal, Select } from 'antd';
import Helmet from 'react-helmet';
import * as assignActions from 'redux/modules/role';
import { Assign } from 'components';

const { Role, User, EditRole, CreateRole } = Assign;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;
@connect(
  state => ({
    itemLoading: state.role.itemLoading,
    treeLoading: state.role.treeLoading,
    systemLoading: state.role.systemLoading,
    updating: state.role.updating,
    deleting: state.role.deleting,
    searching: state.role.searching,
    checkAble: state.role.checkAble,
    data: state.role.assigns,
    selectItem: state.role.selectItem,
    msg: state.role.msg,
    error: state.role.error,
    editRoleShow: state.role.editRoleShow,
    createShow: state.role.createShow,
    creating: state.role.creating,
    selectPermission: state.role.selectPermission,
    permissions: state.role.permissions,
    resources: state.role.resources,
    userResource: state.role.userResource,
    userRole: state.role.userRole,
    allRole: state.role.allRole,
    staffs: state.role.staffs,
    system: state.role.system,
    currentUser: state.auth.user,
    pathAuths: state.role.pathAuths,
    updated: state.role.updated
  }),
  { ...assignActions })
export default class Item extends Component {
  static propTypes = {
    itemLoading: PropTypes.bool.isRequired,
    treeLoading: PropTypes.bool.isRequired,
    updated: PropTypes.bool.isRequired,
    systemLoading: PropTypes.bool.isRequired,
    updating: PropTypes.bool.isRequired,
    deleting: PropTypes.bool.isRequired,
    searching: PropTypes.bool.isRequired,
    creating: PropTypes.bool.isRequired,
    checkAble: PropTypes.bool.isRequired,
    editRoleShow: PropTypes.bool.isRequired,
    createShow: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    allRole: PropTypes.array.isRequired,
    pathAuths: PropTypes.array.isRequired,
    permissions: PropTypes.array.isRequired,
    selectPermission: PropTypes.array.isRequired,
    resources: PropTypes.array.isRequired,
    userResource: PropTypes.array.isRequired,
    userRole: PropTypes.array.isRequired,
    staffs: PropTypes.array.isRequired,
    loadItem: PropTypes.func.isRequired,
    selectItem: PropTypes.object,
    system: PropTypes.object,
    toggleSelect: PropTypes.func.isRequired,
    updateRole: PropTypes.func.isRequired,
    searchUser: PropTypes.func.isRequired,
    editTree: PropTypes.func.isRequired,
    resetTree: PropTypes.func.isRequired,
    saveTree: PropTypes.func.isRequired,
    editRole: PropTypes.func.isRequired,
    hideEditRole: PropTypes.func.isRequired,
    showCreate: PropTypes.func.isRequired,
    hideCreate: PropTypes.func.isRequired,
    confirmCreate: PropTypes.func.isRequired,
    deleteRole: PropTypes.func.isRequired,
    resetMsg: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired,
    loadPermission: PropTypes.func.isRequired,
    loadResource: PropTypes.func.isRequired,
    getUserRole: PropTypes.func.isRequired,
    getUserResource: PropTypes.func.isRequired,
    loadAllRole: PropTypes.func.isRequired,
    updateUserRole: PropTypes.func.isRequired,
    updateUserResource: PropTypes.func.isRequired,
    selectStaff: PropTypes.func.isRequired,
    loadSystem: PropTypes.func.isRequired,
    getRoleAuths: PropTypes.func.isRequired,
    resetData: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    msg: PropTypes.string,
    error: PropTypes.string
  }
  constructor() {
    super();
    this.state = {
      inputValue: '',
      selectUser: null
    };
  }
  componentWillMount() {
    let sysId = location.pathname.split('/');
    const path = `/${sysId[1]}`;
    sysId = parseInt(sysId[sysId.length - 1], 10);
    this.props.loadItem(sysId);
    this.props.loadSystem(sysId, path);
    this.getStaffList();
  }
  componentWillReceiveProps(nextProps) {
    const { msg, error, selectItem, system, updated } = nextProps;
    let sysId = location.pathname.split('/');
    sysId = parseInt(sysId[sysId.length - 1], 10);
    if (error && error !== this.props.error) {
      message.error(error, 5);
      this.props.resetError();
    }
    if (msg && msg !== this.props.msg ) {
      message.success(msg);
      this.props.resetMsg();
    }
    if (selectItem && (!this.props.selectItem || selectItem !== this.props.selectItem)) {
      if (selectItem.userNum) {
        let selectId = typeof selectItem.id === 'number' ? `${selectItem.id}`.split('-') : selectItem.id.split('-');
        selectId = selectId[selectId.length - 1];
        this.props.loadAllRole(system.id);
        this.props.loadResource(system.id);
        this.props.getUserRole(system.id, !!parseInt(selectId, 10) ? selectId : parseInt(selectId.substring(2), 10));
        this.props.getUserResource(system.id, !!parseInt(selectId, 10) ? selectId : parseInt(selectId.substring(2), 10));
      } else {
        let selectId = selectItem.id.split('-');
        selectId = selectId[selectId.length - 1];
        this.props.getRoleAuths(sysId, selectId);
        this.props.loadPermission(system.id, selectItem.parentId);
      }
    }
    if (selectItem && updated && !this.props.updated) {
      if (selectItem.userNum) {
        let selectId = typeof selectItem.id === 'number' ? `${selectItem.id}`.split('-') : selectItem.id.split('-');
        selectId = selectId[selectId.length - 1];
        this.props.loadAllRole(system.id);
        this.props.loadResource(system.id);
        this.props.getUserRole(system.id, !!parseInt(selectId, 10) ? selectId : parseInt(selectId.substring(2), 10));
        this.props.getUserResource(system.id, !!parseInt(selectId, 10) ? selectId : parseInt(selectId.substring(2), 10));
      } else {
        let selectId = selectItem.id.split('-');
        selectId = selectId[selectId.length - 1];
        this.props.getRoleAuths(sysId, selectId);
        this.props.loadPermission(system.id, selectItem.parentId);
      }
    }
  }
  componentWillUnmount() {
    this.props.resetData();
  }
  onSelect = (info) => {
    const {checkAble, system} = this.props;
    if (checkAble) {
      Modal.confirm({
        title: '切换角色/用户提醒',
        content: '检查到您正在编辑当前项目，如果未保存将丢失保存的数据，确认切换么？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.props.resetTree();
          this.props.toggleSelect(system.id, this.props.data, info);
        }
      });
    }else {
      this.props.toggleSelect(system.id, this.props.data, info);
    }
    this.setState({
      selectUser: null
    });
  }
  getStaffList = () => {
    this.props.searchUser();
  }
  editRole = () => {
    this.props.editRole();
  }
  validateForm = (callback) => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      form.resetFields();
      callback(values);
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  hideEdit = () => {
    this.props.hideEditRole();
  }
  confirmEdit = () => {
    const { selectItem } = this.props;
    let sysId = location.pathname.split('/');
    sysId = parseInt(sysId[sysId.length - 1], 10);
    this.validateForm((values) => {
      this.props.updateRole(selectItem, values, sysId);
    });
  }
  handleChange = (value) => {
    const {checkAble} = this.props;
    if ( checkAble ) {
      Modal.confirm({
        title: '切换用户',
        content: '检查到您正在编辑项目，如果未保存将丢失保存的数据，确认切换么？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.setState({
            selectUser: value
          });
          this.props.resetTree();
          this.props.selectStaff(value);
        }
      });
    } else {
      this.setState({
        selectUser: value
      });
      this.props.selectStaff(value);
    }
  }
  editTree = () => {
    this.props.editTree();
  }
  saveTree = (checkedKeys, halfCheckedKeys) => {
    const {selectItem, system} = this.props;
    this.props.saveTree(system.id, selectItem, checkedKeys, halfCheckedKeys);
  }
  saveUserTree = (which, keys, hKeys) => {
    const {selectItem, system} = this.props;
    if (which === '1') {
      this.props.updateUserRole(system.id, selectItem, keys);
    } else {
      this.props.updateUserResource(system.id, selectItem, keys, hKeys);
    }
  }
  resetTree = () => {
    this.props.resetTree();
  }
  createRole = () => {
    this.props.showCreate();
  }
  hideCreate = () => {
    this.props.hideCreate();
  }
  confirmCreate = () => {
    const {system} = this.props;
    const { selectItem } = this.props;
    this.validateForm((values) => {
      this.props.confirmCreate(system.id, selectItem, values);
    });
  }
  deleteRole = () => {
    let sysId = location.pathname.split('/');
    sysId = parseInt(sysId[sysId.length - 1], 10);
    const { selectItem } = this.props;
    Modal.confirm({
      title: '删除角色',
      content: '角色删除后，所有与之关联的数据将受到影响，确定删除角色么？',
      onOk: () => {
        if (selectItem.children && selectItem.children.length) {
          message.error(`无法删除“${selectItem.name}”,该角色拥有子角色或者权限或者已经与员工关联!`);
        } else {
          this.props.deleteRole(selectItem, sysId);
        }
      }
    });
  }
  render() {
    const { pathAuths, data, system, selectItem, currentUser, checkAble, itemLoading, treeLoading, systemLoading, updating, deleting, creating, editRoleShow, createShow, selectPermission, permissions, resources, userRole, userResource, allRole, staffs } = this.props;
    const styles = require('./item.scss');
    const loading = updating || itemLoading || systemLoading || deleting || false;
    const typeIcon = (item) => {
      if (!item.userNum) {
        return 'solution';
      }
      return 'user';
    };
    const typeColor = (item) => {
      if (!item.userNum) {
        return '#666';
      }
      if (`${item.sex}` === 'MALE') {
        return '#1296db';
      }
      return '#d4237a';
    };
    const loop = dataForm => dataForm.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode key={item.id} title={<span className={styles.treeName} style={{fontWeight: item.realName ? 'normal' : 'bold', color: typeColor(item)}}><Icon type={typeIcon(item)}/>{item.name}</span>} >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode key={item.id} title={<span className={styles.treeName} style={{fontWeight: item.realName ? 'normal' : 'bold', color: typeColor(item)}}><Icon type={typeIcon(item)}/>{item.name}</span>} />
      );
    });
    let itemNode = null;
    if ( selectItem && !selectItem.userNum) {
      itemNode = (<Role loading={treeLoading} auths={pathAuths} checkAble={checkAble} saveTree={this.saveTree} permission={selectPermission} allPermission={permissions} editTree={this.editTree} resetTree={this.resetTree} role={selectItem} editRole={this.editRole} createRole={this.createRole} deleteRole={this.deleteRole} />);
    } else if ( selectItem && selectItem.userNum ) {
      itemNode = (<User loading={treeLoading} auths={pathAuths} user={selectItem} checkAble={checkAble} resources={resources} userResource={userResource} userRole={userRole} role={allRole} saveTree={this.saveUserTree} editTree={this.editTree} resetTree={this.resetTree} />);
    }
    return (
      <div>
        <Helmet title="分配权限" />
        <Spin spinning={loading}>
          <Card title={system && system.name || '加载中...'} extra={
            <Select
            showSearch
            value={this.state.selectUser}
            style={{ width: 200 }}
            placeholder="选择要添加的员工"
            optionFilterProp="children"
            onChange={this.handleChange}
            notFoundContent="没有此用户"
            disabled={!data.length || !data}
          >
            { staffs.length ?
              staffs.filter((staff) => (currentUser && currentUser.id && staff.id !== currentUser.id)).map((staff, key) => (
                <Option key={key} value={`${staff.id}`}>
                  {`${staff.realName}  ${staff.userNum}`}
                </Option>
              ))
              : <Option value="noMsg">no msg</Option>
            }
          </Select>
          }>
            <Row type="flex" justify="start">
              <Col span="6" className={styles.borderBox}>
                { data && data.length ?
                  <Tree
                    onDrop={this.onDrop}
                    onSelect={this.onSelect}
                    selectedKeys={selectItem ? [`${selectItem.id}`] : []}
                    defaultExpandAll
                  >
                    {loop(data)}
                  </Tree>
                  : null
                }
              </Col>
              { selectItem ?
                itemNode
                : null
              }
            </Row>
          </Card>
          {editRoleShow ?
            <EditRole show={editRoleShow} role={selectItem} loading={updating} ref={this.saveFormRef} onCancel={this.hideEdit} onCreate={this.confirmEdit} />
            : null
          }
          { createShow ?
            <CreateRole show={createShow} loading={creating} ref={this.saveFormRef} onCancel={this.hideCreate} onCreate={this.confirmCreate} />
            : null
          }
        </Spin>
      </div>
    );
  }
}
