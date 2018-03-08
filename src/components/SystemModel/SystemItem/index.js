import React, { Component, PropTypes } from 'react';
import { Popover, Col, Icon, Popconfirm } from 'antd';
import {CheckAuth} from 'components';
import { Link } from 'react-router';
import { strToRGB } from 'utils/common';
export default class SystemItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    editSystem: PropTypes.func,
    hideEdit: PropTypes.bool,
    deleteSystem: PropTypes.func,
    auths: PropTypes.array.isRequired
  }
  constructor() {
    super();
  }
  deleteSystem = () => {
    this.props.deleteSystem(this.props.item);
  }
  editSystem = () => {
    const { item } = this.props;
    this.props.editSystem(item);
  }
  render() {
    const { item, hideEdit, auths } = this.props;
    const styles = require('./systemItem.scss');
    const letter = item.name.substr(0, 1);
    let overNode = (
      <div className={styles.systemIcon} style={{borderColor: `#${strToRGB(letter)}`, color: `#${strToRGB(letter)}`}}>
        {letter}
      </div>
    );
    if (auths.some((auth) => auth.authNum === 'updateSystem' || auth.authNum === 'deleteSystem')) {
      overNode = (
        <Popover placement="right" overlayStyle={{zIndex: '10'}} content={
          <div>
            <CheckAuth code="updateSystem" auths={auths}>
              <a className={styles.operationLink} onClick={this.editSystem}>
                <Icon type="edit" />
              </a>
            </CheckAuth>
            <CheckAuth code="deleteSystem" auths={auths}>
              <Popconfirm title="确定删除该系统吗？" onConfirm={this.deleteSystem} okText="确定" cancelText="取消">
                <a className={styles.operationLink}>
                  <Icon type="delete" />
                </a>
              </Popconfirm>
            </CheckAuth>
          </div>
        }>
          <div className={styles.systemIcon} style={{borderColor: `#${strToRGB(letter)}`, color: `#${strToRGB(letter)}`}}>
            {letter}
          </div>
        </Popover>
      );
    }
    return (
      <Col span="4">
        <Link to={`/${hideEdit ? 'assign' : 'system'}/${item.id}`}>
          {hideEdit ?
            <div className={styles.systemIcon} style={{borderColor: `#${strToRGB(letter)}`, color: `#${strToRGB(letter)}`}}>
              {letter}
            </div>
            :
            overNode
          }
          <p className={styles.systemName} style={{color: `#${strToRGB(letter)}`}}>
          {item.name}
          </p>
        </Link>
    </Col>
    );
  }
}
