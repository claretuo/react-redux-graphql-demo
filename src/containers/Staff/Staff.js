import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Row, Col, Button, Icon, Input, Collapse, Popover, message, Spin, Popconfirm, Modal } from 'antd';
import { StaffModel, CheckAuth } from '../../components';
import { connect } from 'react-redux';
import * as staffActions from 'redux/modules/staff';
import { isEqual as objEq } from 'lodash';

const { CreateStaff, CreateDepartment, EditStaff, EditDepartment } = StaffModel;
const Panel = Collapse.Panel;
@connect(
  state => ({
    departmentLoading: state.staff.departmentLoading,
    staffListLoading: state.staff.staffListLoading,
    createStaffShow: state.staff.createStaffShow,
    createDepartmentShow: state.staff.createDepartmentShow,
    editStaffShow: state.staff.editStaffShow,
    department: state.staff.department,
    pathAuths: state.staff.pathAuths,
    filters: state.staff.filters,
    staff: state.staff.staff,
    error: state.staff.error,
    msg: state.staff.msg,
    creating: state.staff.creating,
    editing: state.staff.editing,
    itemLoading: state.staff.itemLoading,
    updating: state.staff.updating,
    deleting: state.staff.deleting,
    editDepartmentShow: state.staff.editDepartmentShow
  }),
  { ...staffActions })
export default class Staff extends Component {
  static propTypes = {
    departmentLoading: PropTypes.bool.isRequired,
    staffListLoading: PropTypes.bool.isRequired,
    itemLoading: PropTypes.bool.isRequired,
    createStaffShow: PropTypes.bool.isRequired,
    createDepartmentShow: PropTypes.bool.isRequired,
    editStaffShow: PropTypes.object,
    editDepartmentShow: PropTypes.object,
    filters: PropTypes.object,
    staff: PropTypes.array.isRequired,
    department: PropTypes.array,
    pathAuths: PropTypes.array.isRequired,
    getBasicData: PropTypes.func.isRequired,
    getStaffList: PropTypes.func.isRequired,
    changeFilters: PropTypes.func.isRequired,
    error: PropTypes.string,
    msg: PropTypes.string,
    showStaffCreate: PropTypes.func.isRequired,
    showDepartmentCreate: PropTypes.func.isRequired,
    hideCreateStaff: PropTypes.func.isRequired,
    hideCreateDepartment: PropTypes.func.isRequired,
    createStaff: PropTypes.func.isRequired,
    createDepart: PropTypes.func.isRequired,
    showStaffEdit: PropTypes.func.isRequired,
    hideEdit: PropTypes.func.isRequired,
    enableStaff: PropTypes.func.isRequired,
    freezeStaff: PropTypes.func.isRequired,
    resetPass: PropTypes.func.isRequired,
    cancellationStaff: PropTypes.func.isRequired,
    editStaffItem: PropTypes.func.isRequired,
    creating: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    updating: PropTypes.bool.isRequired,
    deleting: PropTypes.bool.isRequired,
    deleteDepartment: PropTypes.func.isRequired,
    setNewFilter: PropTypes.func.isRequired,
    resetErr: PropTypes.func.isRequired,
    resetMsg: PropTypes.func.isRequired,
    editDepartment: PropTypes.func.isRequired,
    hideEditDepartment: PropTypes.func.isRequired,
    confirmEditDepartment: PropTypes.func.isRequired,
    getDeparts: PropTypes.func.isRequired,
  }
  constructor() {
    super();
    this.state = {
      inputValue: '',
      visible: [],
      disableEdit: false
    };
  }
  componentWillMount() {
    const { filters } = this.props;
    const path = location.pathname;
    if (filters) {
      this.props.changeFilters(filters);
    } else {
      this.props.getStaffList();
    }
    this.props.getBasicData(path);
  }
  componentWillReceiveProps(nextProps) {
    const { msg, error, staff, filters } = nextProps;
    const {visible} = this.state;
    if (error && error !== this.props.error) {
      message.error(error);
      this.props.resetErr();
    }
    if (msg && msg !== this.props.msg) {
      message.success(msg, 3);
      this.props.resetMsg();
    }
    if (!visible.length || visible.length !== staff.length) {
      const list = staff.map(() => {
        return false;
      });
      this.setState({
        visible: list
      });
    }
    if (!objEq(this.props.filters, filters)) {
      this.props.changeFilters(filters);
    }
  }
  changeFilters = (which, item) => {
    const {inputValue} = this.state;
    this.props.setNewFilter('content', inputValue);
    this.props.setNewFilter(which, item);
  }
  handleInputChange = (evt) => {
    this.setState({
      inputValue: evt.target.value,
    });
  }
  hideCreateStaff = () => {
    this.props.hideCreateStaff();
  }
  hideCreateDepartment = () => {
    this.props.hideCreateDepartment();
  }
  hideEdit = () => {
    this.setState({
      disableEdit: false
    });
    this.props.hideEdit();
  }
  showStaff = () => {
    this.props.showStaffCreate();
  }
  showDepartment = () => {
    this.props.showDepartmentCreate();
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
  createDepart = () => {
    const _this = this;
    this.validateForm((values) => {
      _this.props.createDepart(values);
    });
  }
  createStaff = () => {
    const _this = this;
    this.validateForm((values) => {
      _this.props.createStaff(values).then(() => {
        _this.props.getDeparts();
      });
    });
  }
  editStaffItem = () => {
    const _this = this;
    const { editStaffShow } = this.props;
    this.validateForm((values) => {
      _this.props.editStaffItem(editStaffShow.id, values).then(() => {
        _this.props.getDeparts();
      });
    });
  }
  editDepartment = (item) => {
    this.props.editDepartment(item);
  }
  confirmEditDepartment = () => {
    const _this = this;
    const { editDepartmentShow } = this.props;
    this.validateForm((values) => {
      _this.props.confirmEditDepartment(editDepartmentShow.id, values);
    });
  }
  hideEditDepartment = () => {
    this.props.hideEditDepartment();
  }
  deleteDepartment = (item) => {
    Modal.confirm({
      title: (<span style={{color: 'red'}}>删除部门提醒</span>),
      content: (
        <div>
          请确认该部门下
          <span style={{color: 'red'}}>没有员工</span>
          再删除部门，
          <span style={{color: 'red'}}>同步删除</span>
          ，确定删除该部门么？
        </div>
      ),
      onOk: () => {
        this.props.deleteDepartment(item);
      }
    });
  }
  showEdit = (item, key) => {
    const {visible} = this.state;
    visible[key] = false;
    this.setState({
      visible: visible
    });
    this.props.showStaffEdit(item);
  }
  showUserInfo = (item, key) => {
    const {visible} = this.state;
    visible[key] = false;
    this.setState({
      disableEdit: true,
      visible: visible
    });
    this.props.showStaffEdit(item);
  }
  freezeStaff = (item, key) => {
    const {visible} = this.state;
    visible[key] = false;
    this.setState({
      visible: visible
    });
    this.props.freezeStaff(item);
  }
  enableStaff = (item, key) => {
    const {visible} = this.state;
    visible[key] = false;
    this.setState({
      visible: visible
    });
    this.props.enableStaff(item);
  }
  resetPass = (item, key) => {
    const {visible} = this.state;
    visible[key] = false;
    this.setState({
      visible: visible
    });
    this.props.resetPass(item);
  }
  cancellationStaff = (item, key) => {
    const {visible} = this.state;
    visible[key] = false;
    this.setState({
      visible: visible
    });
    this.props.cancellationStaff(item);
  }
  handleVisibleChange = (key, vis) => {
    const { visible } = this.state;
    visible[key] = vis;
    this.setState({
      visible: visible
    });
  }
  handleSearch = () => {
    const { inputValue} = this.state;
    this.props.setNewFilter('content', inputValue);
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  render() {
    const styles = require('./Staff.scss');
    const { pathAuths, staff, filters, department, createStaffShow, createDepartmentShow, editStaffShow, editDepartmentShow, staffListLoading, itemLoading, departmentLoading, creating, editing, updating, deleting } = this.props;
    const { inputValue, visible, disableEdit } = this.state;
    const staffLoading = staffListLoading || itemLoading || departmentLoading || editing || updating || deleting || false;
    const btnAfter = (
      <Icon className={styles.searchBtn} onClick={this.handleSearch} type="search"/>
    );
    let allCount = 0;
    if (department && department.length) {
      department.forEach((item) => {
        allCount += item.userCount;
      });
    }
    return (
      <div>
        <Helmet title="员工管理"/>
        <Spin size="large" spinning={staffLoading}>
          <Row type="flex" justify="start">
            <Col span="6" offset="12" className={styles.rowPadding}>
              <Input addonAfter={btnAfter} placeholder={`请输入员工的姓名、编号、邮箱`} value={inputValue} onChange={this.handleInputChange}
                onPressEnter={this.handleSearch}/>
            </Col>
            <Col span="6" className={`${styles.rowPadding} ${styles.optButton}`}>
              <CheckAuth code="createStaff" auths={pathAuths}>
                <Button type="primary" onClick={this.showStaff}>
                  <Icon type="user" />
                  添加员工
                </Button>
              </CheckAuth>
              <CheckAuth code="createDepartment" auths={pathAuths}>
                <Button type="primary" onClick={this.showDepartment}>
                  <Icon type="team" />
                  添加部门
                </Button>
              </CheckAuth>
            </Col>
          </Row>
          <div className={styles.container}>
            <Row type="flex" justify="start">
              <Col span="3" offset="1" className={`${styles.rowPadding} ${styles.filterTitle}`}>
                员工状态:
              </Col>
              <Col span="2" className={`${styles.rowPadding} ${filters && filters.status === 'NORMAL' ? styles.active : ''}`}>
                <a onClick={this.changeFilters.bind(this, 'status', 'NORMAL')}>
                  正常员工
                </a>
              </Col>
              <Col span="2" className={`${styles.rowPadding} ${filters && filters.status === 'FREEZE' ? styles.active : ''}`}>
                <a onClick={this.changeFilters.bind(this, 'status', 'FREEZE')}>
                  冻结员工
                </a>
              </Col>
              <Col span="2" className={`${styles.rowPadding} ${filters && filters.status === 'CANCEL' ? styles.active : ''}`}>
                <a onClick={this.changeFilters.bind(this, 'status', 'CANCEL')}>
                  注销员工
                </a>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col span="3" offset="1" className={`${styles.rowPadding} ${styles.filterTitle}`}>
                所属部门:
              </Col>
              <Col span="4" className={`${styles.rowPadding} ${ filters && filters.departmentId === null ? styles.active : ''}`}>
                <a onClick={this.changeFilters.bind(this, 'departmentId', null)}>
                  全部({allCount})
                </a>
              </Col>
              { department && department.length ?
                department.map((item, key) => {
                  if (item) {
                    return (
                      <Col key={key} span="4" offset={ key && ((key + 1) % 5 === 0) ? '4' : '0'} className={`${styles.rowPadding} ${ filters && filters.departmentId === item.id ? styles.active : ''}`}>
                        { pathAuths.some((auth) => auth.authNum === 'editDepartment' || auth.authNum === 'deleteDepartment') && item.id !== 0 ?
                          <Popover overlayStyle={{zIndex: 10}} content={
                              <div className={styles.departOperations}>
                                <CheckAuth code="editDepartment" auths={pathAuths}>
                                  <a onClick={this.editDepartment.bind(this, item)}><Icon type="edit" /></a>
                                </CheckAuth>
                                <CheckAuth code="deleteDepartment" auths={pathAuths}>
                                  <a onClick={this.deleteDepartment.bind(this, item)}><Icon type="delete" /></a>
                                </CheckAuth>
                              </div>
                            }
                            placement="bottom">
                            <a onClick={this.changeFilters.bind(this, 'departmentId', item.id)}>
                              { item.name }({item.userCount})
                            </a>
                          </Popover>
                          :
                          <a onClick={this.changeFilters.bind(this, 'departmentId', item.id)}>
                            { item.name }({item.userCount || 0})
                          </a>
                        }

                      </Col>
                    );
                  }
                })
                : <Col span="2" className={styles.rowPadding}>没有数据</Col>
              }
            </Row>
          </div>
          <div className={styles.paddingBox}>
            <Collapse accordion activeKey="1">
              <Panel header={filters && filters.departmentId ? department.filter((item) => item.id === filters.departmentId)[0].name : '全部'} key="1">
                <Row>
                  { staff.length ?
                    staff.map(( item, key) => {
                      if (item) {
                        return (
                          <Col span="2" className={styles.rowPadding} key={key}>
                            <Popover
                              content={
                                  <div className={styles.contentMenu}>
                                    <a onClick={this.showUserInfo.bind(this, item, key)}>
                                      查看
                                    </a>
                                    { item.status !== 'CANCEL' ?
                                      <CheckAuth code="updateStaff" auths={pathAuths}>
                                        <a onClick={this.showEdit.bind(this, item, key)}>
                                          编辑
                                        </a>
                                      </CheckAuth>
                                      : null
                                    }
                                    { item.status !== 'CANCEL' ?
                                      <CheckAuth code="resetPassword" auths={pathAuths}>
                                        <Popconfirm onConfirm={this.resetPass.bind(this, item, key)} title="确定重置该员工登陆密码么？" okText="确认" cancelText="取消">
                                          <a>重置密码</a>
                                        </Popconfirm>
                                      </CheckAuth>
                                      : null
                                    }
                                    { item.status === 'NORMAL' ?
                                      <CheckAuth code="freezeStaff" auths={pathAuths}>
                                        <Popconfirm onConfirm={this.freezeStaff.bind(this, item, key)} title="确定冻结该员工么？" okText="确认" cancelText="取消">
                                          <a>冻结</a>
                                        </Popconfirm>
                                      </CheckAuth>
                                      : null
                                    }
                                    { item.status === 'FREEZE' ?
                                      <CheckAuth code="activeStaff" auths={pathAuths}>
                                        <Popconfirm onConfirm={this.enableStaff.bind(this, item, key)} title="确定启用该员工么？" okText="确认" cancelText="取消">
                                          <a>启用</a>
                                        </Popconfirm>
                                      </CheckAuth>
                                      : null
                                    }
                                    { item.status !== 'CANCEL' ?
                                      <CheckAuth code="cancelStaff" auths={pathAuths}>
                                        <Popconfirm onConfirm={this.cancellationStaff.bind(this, item, key)} title="确定注销该员工么？" okText="确认" cancelText="取消">
                                          <a>注销</a>
                                        </Popconfirm>
                                      </CheckAuth>
                                      : null
                                    }
                                  </div>
                              }
                              trigger="click"
                              placement="right"
                              visible={visible[key]}
                              onVisibleChange={this.handleVisibleChange.bind(this, key)}
                              overlayClassName={styles.popOverBox}
                            >
                              <a className={(item.status && item.status !== 'NORMAL' ? styles.noActive : '')}>
                                <i className={`${styles.icon} ${item.sex === 'MALE' ? styles.iconMale : styles.iconFemale }`}></i>
                                {item.realName}
                              </a>
                            </Popover>
                          </Col>
                        );
                      }
                    })
                    : <Col span="2" className={styles.rowPadding}>没有数据</Col>
                  }
                </Row>
              </Panel>
            </Collapse>
          </div>
          { createStaffShow ?
            <CreateStaff show={createStaffShow} loading={creating} department={department.filter((item) => item.id !== 0)} ref={this.saveFormRef} onCancel={this.hideCreateStaff} onCreate={this.createStaff}/>
            : null
          }
          { createDepartmentShow ?
            <CreateDepartment loading={creating} show={createDepartmentShow} ref={this.saveFormRef} onCancel={this.hideCreateDepartment} onCreate={this.createDepart}/>
            : null
          }
          { editStaffShow ?
            <EditStaff show={editStaffShow} disableEdit={disableEdit} loading={editing} department={department.filter((item) => item.id !== 0)} ref={this.saveFormRef} onCancel={this.hideEdit} onCreate={this.editStaffItem}/>
            : null
          }
          { editDepartmentShow ?
            <EditDepartment show={editDepartmentShow} loading={editing} ref={this.saveFormRef} onCancel={this.hideEditDepartment} onCreate={this.confirmEditDepartment}/>
            : null
          }
        </Spin>
      </div>
    );
  }
}
