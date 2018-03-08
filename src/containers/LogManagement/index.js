import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { Row, Col, Table, Spin, Input, DatePicker, Button, Icon, message } from 'antd';
import Helmet from 'react-helmet';
import * as logActions from 'redux/modules/logs';

@connect(
  state => ({
    logs: state.logs.logs,
    columes: state.logs.columes,
    listLoading: state.logs.listLoading,
    columesLoading: state.logs.columesLoading,
    searching: state.logs.searching,
    error: state.logs.error,
    total: state.logs.total,
    current: state.logs.current
  }),
  { ...logActions })
export default class LogManagement extends Component {
  static propTypes = {
    logs: PropTypes.array.isRequired,
    columes: PropTypes.array.isRequired,
    columesLoading: PropTypes.bool.isRequired,
    listLoading: PropTypes.bool.isRequired,
    loadList: PropTypes.func.isRequired,
    loadColumes: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    searching: PropTypes.bool.isRequired,
    total: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    error: PropTypes.string,
  }
  constructor() {
    super();
    this.state = {
      inputValue: '',
      start: null,
      end: null
    };
  }
  componentWillMount() {
    this.props.loadList();
    this.props.loadColumes();
  }
  componentWillReceiveProps(nextProps) {
    const {error} = nextProps;
    if (error && error !== this.props.error) {
      message.error(error);
      this.props.resetError();
    }
  }
  startChange = (value) => {
    this.setState({
      start: value
    });
  }
  endChange = (value) => {
    this.setState({
      end: value
    });
  }
  disabledStartDate = (current) => {
    const {end} = this.state;
    if (!current) {
      return false;
    }
    if (!end) {
      return current.valueOf() > new Date().getTime();
    }
    return current.valueOf() > end.valueOf() || current.valueOf() > new Date().getTime();
  }
  disabledEndDate = (current) => {
    const {start} = this.state;
    if (!current) {
      return false;
    }
    if (!start) {
      return current.valueOf() > new Date().getTime();
    }
    return current.valueOf() <= start.valueOf() || current.valueOf() > new Date().getTime();
  }
  filterData = () => {
    const { start, end, inputValue } = this.state;
    this.props.search({ start: start, end: end, name: inputValue});
  }
  inputChange = (evt) => {
    const { value } = evt.target;
    this.setState({
      inputValue: value
    });
  }
  handleTableChange = (pagination, filters, sorter) => {
    const {start, end, inputValue} = this.state;
    const filterObj = {
      start: start,
      end: end,
      name: inputValue,
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order
    };
    this.props.changePage(filterObj);
  }
  render() {
    const { logs, listLoading, columes, columesLoading, searching, total, current } = this.props;
    const loading = listLoading || columesLoading || searching || false;
    const {start, end} = this.state;
    const styles = require('./log.scss');
    return (
      <div>
        <Helmet title="日志管理" />
        <Spin spinning={loading}>
          <Row>
            <Col span="4" offset="6" className={styles.rowPadding}>
              <Input addonBefore={<Icon type="user" />} onChange={this.inputChange} placeholder="请输入用户名查询" />
            </Col>
            <Col span="4" offset="1" className={styles.rowPadding}>
              <DatePicker
                disabledDate={this.disabledStartDate}
                format="YYYY-MM-DD"
                value={start}
                placeholder="请输入开始查找时间"
                onChange={this.startChange}
              />
            </Col>
            <Col span="4" offset="1" className={styles.rowPadding}>
              <DatePicker
                disabledDate={this.disabledEndDate}
                format="YYYY-MM-DD"
                value={end}
                placeholder="请输入结束查找时间"
                onChange={this.endChange}
              />
            </Col>
            <Col span="2" offset="1" className={styles.rowPadding}>
              <Button onClick={this.filterData} type="primary" icon="search">
                查找
              </Button>
            </Col>
            <Col span="24" className={styles.rowPadding}>
              <Table columns={columes} dataSource={logs} onChange={this.handleTableChange}
                pagination={{
                  total: total,
                  pageSize: 10,
                  current: current,
                  showTotal: num => `总共${num}条数据`
                }} />
            </Col>
          </Row>
        </Spin>
      </div>
    );
  }
}
