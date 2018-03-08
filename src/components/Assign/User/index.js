import React, { Component, PropTypes } from 'react';
import { Col, Tree, Icon, Card, Tabs, Modal, Spin } from 'antd';
import { flattenTree } from 'utils/common';
import {CheckAuth} from 'components';
import {uniq} from 'lodash';

const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;

export default class User extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    checkAble: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    resetTree: PropTypes.func.isRequired,
    editTree: PropTypes.func.isRequired,
    saveTree: PropTypes.func.isRequired,
    role: PropTypes.array.isRequired,
    resources: PropTypes.array.isRequired,
    userRole: PropTypes.array.isRequired,
    userResource: PropTypes.array.isRequired,
    auths: PropTypes.array.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      selectKey: '1',
      checkedRoleKeys: [],
      halfCheckedRoleKeys: [],
      checkedResourceKeys: [],
      halfCheckedResourceKeys: [],
      allRoleList: [],
      allResourceList: []
    };
  }
  componentWillReceiveProps(nextProps) {
    const {checkAble, userRole, userResource, role, resources} = nextProps;
    if (checkAble !== this.props.checkAble) {
      const list = flattenTree(userRole[0]);
      const allRoleList = flattenTree(role[0]);
      const allResourceList = flattenTree(resources[0]);
      const listResource = flattenTree(userResource[0]);
      let checkedRoleKeys = [];
      let halfCheckedRoleKeys = [];
      let checkedResourceKeys = [];
      let halfCheckedResourceKeys = [];
      this.setState({
        allRoleList: allRoleList,
        allResourceList: allResourceList
      });
      list.forEach((item) => {
        let iId = item.id.substring(3);
        if (!iId) {
          return false;
        }
        iId = iId.split('-');
        iId = iId[iId.length - 1];
        const cItem = allRoleList.filter((it) => {
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
        checkedRoleKeys = checkedRoleKeys.concat(cItem);
      });
      checkedRoleKeys = uniq(checkedRoleKeys);
      checkedRoleKeys.forEach((item) => {
        if (allRoleList.filter((it) => it.id === item)[0] && allRoleList.filter((it) => it.id === item)[0].treePid) {
          halfCheckedRoleKeys.push(allRoleList.filter((it) => it.id === item)[0].treePid);
        }
      });
      halfCheckedRoleKeys = uniq(halfCheckedRoleKeys).filter((item) => !checkedRoleKeys.some((it) => it === item));
      halfCheckedRoleKeys = halfCheckedRoleKeys.filter((item) => checkedRoleKeys.some((it) => ~it.indexOf(item)));
      if (halfCheckedRoleKeys.length) {
        halfCheckedRoleKeys.push('_1');
      }
      listResource.filter((item) => item.checkstatus === 2).forEach((item) => {
        let iId = item.id.substring(3);
        if (!iId) {
          return false;
        }
        iId = iId.split('-');
        iId = iId[iId.length - 1];
        const cItem = allResourceList.filter((it) => {
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
        checkedResourceKeys = checkedResourceKeys.concat(cItem);
      });
      checkedResourceKeys = uniq(checkedResourceKeys);
      checkedResourceKeys.forEach((item) => {
        if (allResourceList.filter((it) => it.id === item)[0] && allResourceList.filter((it) => it.id === item)[0].treePid) {
          halfCheckedResourceKeys.push(allResourceList.filter((it) => it.id === item)[0].treePid);
        }
      });
      halfCheckedResourceKeys = uniq(halfCheckedResourceKeys).filter((item) => !checkedResourceKeys.some((it) => it === item));
      halfCheckedResourceKeys = halfCheckedResourceKeys.filter((item) => checkedResourceKeys.some((it) => ~it.indexOf(item)));
      if (halfCheckedResourceKeys.length) {
        halfCheckedResourceKeys.push('_1');
      }
      halfCheckedRoleKeys = halfCheckedRoleKeys.filter((item) => !checkedRoleKeys.some((it) => it === item));
      halfCheckedResourceKeys = halfCheckedResourceKeys.filter((item) => !checkedResourceKeys.some((it) => it === item));
      this.setState({
        checkedRoleKeys: checkedRoleKeys,
        halfCheckedRoleKeys: halfCheckedRoleKeys,
        checkedResourceKeys: checkedResourceKeys,
        halfCheckedResourceKeys: halfCheckedResourceKeys
      });
    }
  }
  checkRole = (keys, evt) => {
    const {allRoleList} = this.state;
    const evtKey = evt.node.props.eventKey;
    let {checkedRoleKeys, halfCheckedRoleKeys} = this.state;
    const checked = !checkedRoleKeys.some((item) => item === evtKey);
    if (checked) {
      checkedRoleKeys.push(evtKey);
      halfCheckedRoleKeys = halfCheckedRoleKeys.filter((item) => item !== evtKey);
      allRoleList.forEach((item) => {
        if (item.id.split('-').length < evtKey.split('-').length && ~evtKey.indexOf(item.id) && !halfCheckedRoleKeys.some((it) => it === item.id)) {
          halfCheckedRoleKeys.push(item.id);
        }
        if (item.id.split('-').length > evtKey.split('-').length && ~item.id.indexOf(evtKey) && !checkedRoleKeys.some((it) => it === item.id)) {
          checkedRoleKeys.push(item.id);
        }
      });
      halfCheckedRoleKeys = halfCheckedRoleKeys.filter((item) => checkedRoleKeys.some((it) => ~it.indexOf(item)));
    } else {
      checkedRoleKeys = checkedRoleKeys.filter((item) => item !== evtKey);
      allRoleList.forEach((item) => {
        if (item.id.split('-').length !== evtKey.split('-').length && (~item.id.indexOf(evtKey) || ~evtKey.indexOf(item.id)) && checkedRoleKeys.some((it) => it === item.id)) {
          checkedRoleKeys = checkedRoleKeys.filter((key) => key !== item.id);
        }
        if (item.id.split('-').length < evtKey.split('-').length && ~evtKey.indexOf(item.id) && !halfCheckedRoleKeys.some((it) => it === item.id)) {
          halfCheckedRoleKeys.push(item.id);
        }
      });
      halfCheckedRoleKeys = halfCheckedRoleKeys.filter((item) => item !== evtKey);
      halfCheckedRoleKeys = halfCheckedRoleKeys.filter((item) => checkedRoleKeys.some((it) => ~it.indexOf(item)));
      if (!checkedRoleKeys.length) {
        halfCheckedRoleKeys = [];
      }
    }
    halfCheckedRoleKeys = halfCheckedRoleKeys.filter((item) => !checkedRoleKeys.some((it) => it === item));
    this.setState({
      checkedRoleKeys: checkedRoleKeys,
      halfCheckedRoleKeys: halfCheckedRoleKeys
    });
  }
  checkResource = (keys, evt) => {
    const {allResourceList} = this.state;
    const evtKey = evt.node.props.eventKey;
    let {checkedResourceKeys, halfCheckedResourceKeys} = this.state;
    const checked = !checkedResourceKeys.some((item) => item === evtKey);
    if (checked) {
      checkedResourceKeys.push(evtKey);
      halfCheckedResourceKeys = halfCheckedResourceKeys.filter((item) => item !== evtKey);
      allResourceList.forEach((item) => {
        if (item.id.split('-').length < evtKey.split('-').length && ~evtKey.indexOf(item.id) && !halfCheckedResourceKeys.some((it) => it === item.id)) {
          halfCheckedResourceKeys.push(item.id);
        }
        if (item.id.split('-').length > evtKey.split('-').length && ~item.id.indexOf(evtKey) && !checkedResourceKeys.some((it) => it === item.id)) {
          checkedResourceKeys.push(item.id);
        }
      });
      halfCheckedResourceKeys = halfCheckedResourceKeys.filter((item) => checkedResourceKeys.some((it) => ~it.indexOf(item)));
    } else {
      checkedResourceKeys = checkedResourceKeys.filter((item) => item !== evtKey);
      allResourceList.forEach((item) => {
        if (item.id.split('-').length !== evtKey.split('-').length && (~item.id.indexOf(evtKey) || ~evtKey.indexOf(item.id)) && checkedResourceKeys.some((it) => it === item.id)) {
          checkedResourceKeys = checkedResourceKeys.filter((key) => key !== item.id);
        }
        if (item.id.split('-').length < evtKey.split('-').length && ~evtKey.indexOf(item.id) && !halfCheckedResourceKeys.some((it) => it === item.id)) {
          halfCheckedResourceKeys.push(item.id);
        }
      });
      halfCheckedResourceKeys = halfCheckedResourceKeys.filter((item) => item !== evtKey);
      halfCheckedResourceKeys = halfCheckedResourceKeys.filter((item) => checkedResourceKeys.some((it) => ~it.indexOf(item)));
      if (!checkedResourceKeys.length) {
        halfCheckedResourceKeys = [];
      }
    }
    halfCheckedResourceKeys = halfCheckedResourceKeys.filter((item) => !checkedResourceKeys.some((it) => it === item));
    this.setState({
      checkedResourceKeys: checkedResourceKeys,
      halfCheckedResourceKeys: halfCheckedResourceKeys
    });
  }
  toggleTab = (key) => {
    const {checkAble} = this.props;
    if ( checkAble ) {
      Modal.confirm({
        title: '切换标签提醒',
        content: '检查到您正在编辑项目，如果未保存将丢失保存的数据，确认切换么？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.props.resetTree();
          this.setState({
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
    this.props.editTree();
  }
  saveTree = () => {
    const {selectKey, checkedRoleKeys, checkedResourceKeys, halfCheckedRoleKeys, halfCheckedResourceKeys } = this.state;
    if (selectKey === '1') {
      this.props.saveTree(selectKey, checkedRoleKeys, halfCheckedRoleKeys);
    } else {
      this.props.saveTree(selectKey, checkedResourceKeys, halfCheckedResourceKeys);
    }
  }
  resetTree = () => {
    this.props.resetTree();
  }
  render() {
    const { auths, user, checkAble, resources, userRole, userResource, role, loading } = this.props;
    const { selectKey, checkedRoleKeys, checkedResourceKeys, halfCheckedRoleKeys, halfCheckedResourceKeys} = this.state;
    const styles = require('./user.scss');
    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.id} title={item.name}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} />;
    });
    let treeOperations = null;
    if (!checkAble) {
      treeOperations = (
        <div className={styles.treeOperations}>
          <a onClick={this.editTree}>
            <Icon type="edit" />
            编辑
          </a>
        </div>
      );
    } else {
      treeOperations = (
        <div className={styles.treeOperations}>
          <a onClick={this.saveTree}><Icon type="save" />保存</a>
          <a onClick={this.resetTree}><Icon type="reload" />取消</a>
        </div>
      );
    }
    return (
      <Col span="16" offset="2">
        <Card title="基本信息" style={{width: '100%', marginBottom: '20px'}}>
          <div className={styles.inlineRow}>
            <span className={styles.label}>员工编号:</span>
            {user.userNum}
          </div>
          <div className={styles.inlineRow}>
            <span className={styles.label}>员工姓名:</span>
            {user.realName}
          </div>
        </Card>
        <Spin spinning={loading}>
          <Tabs activeKey={selectKey} onTabClick={this.toggleTab} tabBarExtraContent={
              <CheckAuth auths={auths} code={selectKey === '1' ? 'updateUserRoles' : 'updateUserResource'}>
                { treeOperations }
              </CheckAuth>
            } className={styles.shadowBox}>
            <TabPane tab="角色" key="1" className={styles.hiddenBox}>
              { (checkAble && role && role.length) || (!checkAble && userRole && userRole.length) ?
                <Tree
                  checkStrictly
                  checkable={checkAble}
                  className={styles.commonHeight}
                  checkedKeys={{checked: checkedRoleKeys, halfChecked: halfCheckedRoleKeys}}
                  onCheck={this.checkRole}
                  defaultExpandAll
                >
                  {loop(checkAble ? role : userRole)}
                </Tree>
                : null
              }
            </TabPane>
            <TabPane tab="资源" key="2" className={styles.hiddenBox}>
              { (checkAble && resources && resources.length) || (!checkAble && userResource && userResource.length) ?
                <Tree
                  checkStrictly
                  checkable={checkAble}
                  className={styles.commonHeight}
                  checkedKeys={{checked: checkedResourceKeys, halfChecked: halfCheckedResourceKeys}}
                  onCheck={this.checkResource}
                  defaultExpandAll
                >
                  {loop(checkAble ? resources : userResource)}
                </Tree>
                : null
              }
            </TabPane>
          </Tabs>
        </Spin>
      </Col>
    );
  }
}
