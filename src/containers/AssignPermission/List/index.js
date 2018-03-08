import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Row, Card, Spin, message } from 'antd';
import { SystemModel } from 'components';
import * as systemListActions from 'redux/modules/systemList';
const { SystemItem } = SystemModel;
@connect(
  state => ({
    system: state.systemList.system,
    listLoading: state.systemList.listLoading,
    error: state.systemList.error
  }),
  { ...systemListActions })
export default class List extends Component {
  static propTypes = {
    system: PropTypes.array.isRequired,
    listLoading: PropTypes.bool.isRequired,
    loadList: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired,
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
    const { error } = nextProps;
    if (error && error !== this.props.error) {
      message.error(error);
      this.props.resetError();
    }
  }
  render() {
    const { system, listLoading } = this.props;
    return (
      <div>
        <Helmet title="系统列表" />
        <Spin spinning={listLoading} size="large">
          <Card title="系统列表">
            <Row type="flex" justify="start">
              {
                system.map((item, key) => {
                  if (item) {
                    return (
                      <SystemItem auths={[]} hideEdit item={item} key={key} />
                    );
                  }
                })
              }
            </Row>
          </Card>
        </Spin>
      </div>
    );
  }
}
