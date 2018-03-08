import React, { Component } from 'react';
import { Card, Col, Row, Table } from 'antd';
import Helmet from 'react-helmet';
export default class Home extends Component {
  render() {
    const dataSource = [
      {
        key: '1',
        name: '员工',
        en: 'staff',
        explain: '公司内部的员工'
      },
      {
        key: '2',
        name: '角色',
        en: 'role',
        explain: '某单系统下同一类功能权限的集合，员工可以被授予角色'
      },
      {
        key: '3',
        name: '系统',
        en: 'system',
        explain: '需要对接权限系统，给员工分配权限的系统'
      },
      {
        key: '4',
        name: '权限',
        en: 'permission',
        explain: '控制功能等展示，操作，使用的权限'
      },
      {
        key: '5',
        name: '功能权限',
        en: 'Function permission',
        explain: '真实可展示，控制菜单和操作的权限；包括目录权限、菜单权限和操作权限。'
      },
      {
        key: '6',
        name: '目录权限',
        en: 'Folder permission',
        explain: '不产生实际的功效，只做分类使用'
      },
      {
        key: '7',
        name: '菜单权限',
        en: 'Menu permission',
        explain: '控制菜单显示的权限'
      },
      {
        key: '8',
        name: '操作权限',
        en: 'Operate permission',
        explain: '控制操作类的权限，比如 删除，修改等按钮'
      },
      {
        key: '9',
        name: '资源权限',
        en: 'Resource permission',
        explain: '真实可控制，控制资源类展示；包括实际权限和虚拟权限。'
      },
      {
        key: '10',
        name: '实际权限',
        en: 'Actual permission',
        explain: '真实控制用的资源权限，比如财务系统第三方支付通道'
      },
      {
        key: '11',
        name: '虚拟权限',
        en: 'virtual permission',
        explain: '不产生实际的功效，只做分类使用，比如第三方支付这个集合'
      }
    ];

    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key'
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '英文',
        dataIndex: 'en',
        key: 'en'
      },
      {
        title: '解释',
        dataIndex: 'explain',
        key: 'explain'
      }
    ];
    const styles = require('./Home.scss');
    return (
      <div className={styles.homePage}>
        <Helmet title="首页"/>
        <Row>
          <Col span="24" className={styles.tipTitle}>
            <h3>使用权限系统如有任何疑问，请联系技术部：陈旻翔(chenmx@grapedu.cn)</h3>
          </Col>
          <Col span="16">
            <Card title="名词解释" bordered={false}>
              <Table
                columns={ columns }
                dataSource={ dataSource }
                pagination={false}
                />
            </Card>
          </Col>
          <Col span="6" offset="2">
            <Card title="版本更新" bordered={false}>
              <div className={styles.version}>
                <p><strong>V 1.0.0</strong><span style={{float: 'right'}}>2017-7-29</span></p>
                <p>原版</p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
