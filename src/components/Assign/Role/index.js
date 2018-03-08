import React, { Component, PropTypes } from 'react';
import { Col, Tree, Icon, Card, Popconfirm, Alert } from 'antd';
import { flattenTree } from 'utils/common';
import {CheckAuth} from 'components';
import {uniq} from 'lodash';

const TreeNode = Tree.TreeNode;
export default class Role extends Component {
  static propTypes = {
    role: PropTypes.object.isRequired,
    editRole: PropTypes.func.isRequired,
    checkAble: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    editTree: PropTypes.func.isRequired,
    saveTree: PropTypes.func.isRequired,
    resetTree: PropTypes.func.isRequired,
    createRole: PropTypes.func.isRequired,
    deleteRole: PropTypes.func.isRequired,
    permission: PropTypes.array.isRequired,
    allPermission: PropTypes.array.isRequired,
    auths: PropTypes.array.isRequired,
  }
  constructor() {
    super();
    this.state = {
      checkedKeys: [],
      halfCheckedKeys: [],
      allList: []
    };
  }
  componentWillReceiveProps(nextProps) {
    const {checkAble, permission, allPermission} = nextProps;
    if (checkAble && checkAble !== this.props.checkAble) {
      const list = flattenTree(permission[0]);
      const allList = flattenTree(allPermission[0]);
      this.setState({
        allList: allList
      });
      let checkedKeys = [];
      let halfCheckedKeys = [];
      list.filter((item) => item.checkstatus === 2).forEach((item) => {
        let iId = item.id;
        iId = iId.split('-');
        iId = iId[iId.length - 1];
        const cItem = allList.filter((it) => {
          const cId = it.id;
          if (~cId.indexOf(iId)) {
            let ccId = cId.split('-');
            ccId = ccId[ccId.length - 1];
            if (ccId === iId) {
              return true;
            }
          }
          return false;
        }).map((it) => it.id);
        checkedKeys = checkedKeys.concat(cItem);
      });
      checkedKeys = uniq(checkedKeys);
      checkedKeys.forEach((item) => {
        if (allList.filter((it) => it.id === item)[0] && allList.filter((it) => it.id === item)[0].treePid) {
          halfCheckedKeys.push(allList.filter((it) => it.id === item)[0].treePid);
        }
      });
      halfCheckedKeys = uniq(halfCheckedKeys).filter((item) => !checkedKeys.some((it) => it === item));
      halfCheckedKeys = halfCheckedKeys.filter((item) => checkedKeys.some((it) => ~it.indexOf(item)));
      halfCheckedKeys = halfCheckedKeys.filter((item) => !checkedKeys.some((it) => it === item));
      this.setState({
        checkedKeys: checkedKeys,
        halfCheckedKeys: halfCheckedKeys
      });
    }
  }
  onCheck = (checkedObj, evt) => {
    const {allList} = this.state;
    const evtKey = evt.node.props.eventKey;
    let {checkedKeys, halfCheckedKeys} = this.state;
    const checked = !checkedKeys.some((item) => item === evtKey);
    if (checked) {
      checkedKeys.push(evtKey);
      halfCheckedKeys = halfCheckedKeys.filter((item) => item !== evtKey);
      allList.forEach((item) => {
        if (item.id.split('-').length < evtKey.split('-').length && ~evtKey.indexOf(item.id) && !halfCheckedKeys.some((it) => it === item.id)) {
          halfCheckedKeys.push(item.id);
        }
        if (item.id.split('-').length > evtKey.split('-').length && ~item.id.indexOf(evtKey) && !checkedKeys.some((it) => it === item.id)) {
          checkedKeys.push(item.id);
        }
      });
      halfCheckedKeys = halfCheckedKeys.filter((item) => checkedKeys.some((it) => ~it.indexOf(item)));
    } else {
      checkedKeys = checkedKeys.filter((item) => item !== evtKey);
      allList.forEach((item) => {
        if (item.id.split('-').length !== evtKey.split('-').length && (~item.id.indexOf(evtKey) || ~evtKey.indexOf(item.id)) && checkedKeys.some((it) => it === item.id)) {
          checkedKeys = checkedKeys.filter((key) => key !== item.id);
        }
        if (item.id.split('-').length < evtKey.split('-').length && ~evtKey.indexOf(item.id) && !halfCheckedKeys.some((it) => it === item.id)) {
          halfCheckedKeys.push(item.id);
        }
      });
      halfCheckedKeys = halfCheckedKeys.filter((item) => item !== evtKey);
      halfCheckedKeys = halfCheckedKeys.filter((item) => checkedKeys.some((it) => ~it.indexOf(item)));
      if (!checkedKeys.length) {
        halfCheckedKeys = [];
      }
    }
    halfCheckedKeys = halfCheckedKeys.filter((item) => !checkedKeys.some((it) => it === item));
    this.setState({
      checkedKeys: checkedKeys,
      halfCheckedKeys: halfCheckedKeys
    });
  }
  editTree = () => {
    this.props.editTree();
  }
  saveTree = () => {
    const {checkedKeys, halfCheckedKeys} = this.state;
    this.props.saveTree(checkedKeys, halfCheckedKeys);
  }
  resetTree = () => {
    this.props.resetTree();
  }
  render() {
    const { auths, role, editRole, checkAble, createRole, deleteRole, permission, allPermission } = this.props;
    const {checkedKeys, halfCheckedKeys} = this.state;
    const styles = require('./role.scss');
    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode disableCheckbox={item.disableCheck || false} key={item.id} title={<span className={item.disableCheck ? styles.disableTitle : ''}>{item.name}</span>}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode disableCheckbox={item.disableCheck || false} key={item.id} title={<span className={item.disableCheck ? styles.disableTitle : ''}>{item.name}</span>} />;
    });
    let treeOperations = null;
    if (!checkAble) {
      treeOperations = (
        <a onClick={this.editTree}>
          <Icon type="edit" />
          编辑
        </a>
      );
    }else {
      treeOperations = (
        <div className={styles.treeOperations}>
          <a onClick={this.saveTree}><Icon type="save" />保存</a>
          <a onClick={this.resetTree}><Icon type="reload" />取消</a>
        </div>
      );
    }
    return (
      <Col span="16" offset="2">
        <Card title="基本信息" extra={
            <CheckAuth code="updateRole" auths={auths}>
              <a onClick={editRole}><Icon type="edit" />编辑</a>
            </CheckAuth>
          } style={{width: '100%', marginBottom: '20px'}}>
          <div className={styles.inlineRow}>
            <span className={styles.label}>角色名称:</span>
            {role.name}
          </div>
          <div className={styles.inlineRow}>
            <span className={styles.label}>父级角色:</span>
            {role.parentName || '无'}
          </div>
          <div className={styles.inlineRow}>
            <span className={styles.operationBox}>
              <CheckAuth code="createRole" auths={auths}>
                <a onClick={createRole} className={styles.operation}><Icon type="solution"/>创建子角色</a>
              </CheckAuth>
              { role && role.treePid ?
                <CheckAuth code="deleteRole" auths={auths}>
                  <Popconfirm title="确定删除该角色么？" onConfirm={deleteRole}>
                    <a className={styles.operation}><Icon type="delete"/>删除</a>
                  </Popconfirm>
                </CheckAuth>
                : null
              }
            </span>
          </div>
        </Card>
        <Card title="权限信息" extra={
            <CheckAuth code="updateRoleAuths" auths={auths}>
              {treeOperations}
            </CheckAuth>
          } style={{width: '100%'}}>
          { (checkAble && allPermission && allPermission.length) || (!checkAble && permission && permission.length) ?
            <Tree
              checkStrictly
              checkable={checkAble}
              className={styles.commonHeight}
              checkedKeys={{checked: checkedKeys, halfChecked: halfCheckedKeys}}
              onCheck={this.onCheck}
              defaultExpandAll
            >
              { checkAble ?
                loop(allPermission)
                : loop(permission)
              }
            </Tree>
            : <Alert message="该角色还没有权限，请尽快分配！" type="info" showIcon />
          }
        </Card>
      </Col>
    );
  }
}
