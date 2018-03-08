/**
 * Created by peach on 16-3-16.
 */
import React, { Component, PropTypes } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router';

const SubMenu = Menu.SubMenu;

export default class SideBar extends Component {
  static propTypes = {
    menuList: PropTypes.array.isRequired
  }
  render() {
    const { menuList } = this.props;
    const styles = require('./SideBar.less');
    const menu = menuList.filter((item) => item.type === 'FOLDER');
    menuList.forEach((item) => {
      const index = menu.findIndex((mItem) => item.parentId && mItem.id === item.parentId);
      if (~index) {
        menu[index].children = menu[index].children || [];
        if (!menu[index].children.some((child) => child.id === item.id)) {
          menu[index].children.push(item);
        }
      }
    });
    const linkList = menu.reduce((prev, item) => {
      let list = [];
      if (item.children) {
        list = prev.concat(item.children);
      }
      return list;
    }, []);
    const loop = dataForm => dataForm.map((item) => {
      if (item.children && item.children.length) {
        return <SubMenu key={`${item.id}`} title={<span><Icon type="setting" /><span>{item.name}</span></span>}>{loop(item.children)}</SubMenu>;
      }
      return <Menu.Item key={`${item.id}`}><Link to={item.url}>{item.name}</Link></Menu.Item>;
    });
    const path = location.pathname;
    let selectKeys = linkList.reduce((prev, item) => {
      if (path !== '/' && item.url !== '/' && ~path.indexOf(item.url)) {
        prev.push(`${item.id}`);
      }
      return prev;
    }, []);
    if (!selectKeys.length) {
      selectKeys = linkList.reduce((prev, item) => {
        if (item.url === '/') {
          prev.push(`${item.id}`);
        }
        return prev;
      }, []);
    }
    return (
      <Menu className={ styles.sidebar }
            style={{ width: 240 }}
            defaultOpenKeys={menu.map((item) => `${item.id}`)}
            selectedKeys={selectKeys}
            mode="inline">
        {loop(menu)}
      </Menu>
    );
  }
}
