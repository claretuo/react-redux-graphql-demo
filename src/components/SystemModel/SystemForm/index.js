import React from 'react';
import { Form, Input, Button, Select, Popconfirm } from 'antd';
import { minRealLen, maxRealLen } from 'utils/validation';
import { trim } from 'lodash';
import {CheckAuth} from 'components';

const FormItem = Form.Item;
const Option = Select.Option;
const SystemForm = Form.create({
  onFieldsChange: (props, changedFields) => {
    props.onChange(changedFields);
  },
  mapPropsToFields: (props) => {
    const auth = props.auth ? 'authNum' : 'resourceNum';
    return {
      name: {
        value: props.system.name
      },
      type: {
        value: props.system.type
      },
      [auth]: {
        value: props.auth ? props.system.authNum : props.system.resourceNum
      },
      url: {
        value: props.system.url
      },
      parentName: {
        value: props.system.parentName || '无'
      }
    };
  }
})(
  (props) => {
    const { form, editAble, deleteRole, createRole, auth, auths } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const styles = require('./systemForm.scss');
    return (
      <Form horizontal>
        <FormItem label="权限名称" {...formItemLayout} hasFeedback>
          {getFieldDecorator('name', {
            rules: [
              {required: true, message: '请输入权限名称！'},
              { validator: (rule, value, callback) => {
                if (!minRealLen(value, 4)) {
                  callback('权限名称长度太短，最短两个汉字或者四个英文字符！');
                }
                if (!maxRealLen(value, 16)) {
                  callback('权限名称长度太长，八个汉字或者十六个英文字符！');
                }
                callback();
              }}
            ],
          })(
            <Input disabled={!editAble} placeholder="请输入权限名称" />
          )}
        </FormItem>
        <FormItem label="权限类型" {...formItemLayout}>
          {getFieldDecorator('type')(
            auth ?
              <Select disabled={!editAble}>
                <Option value="FOLDER">目录权限</Option>
                <Option value="PAGE">菜单权限</Option>
                <Option value="OPERATION">操作权限</Option>
              </Select>
              :
              <Select disabled={!editAble}>
                <Option value="FOLDER">虚拟权限</Option>
                <Option value="OPERATION">实际权限</Option>
              </Select>
          )}
        </FormItem>
        <FormItem label="权限编码" {...formItemLayout} hasFeedback>
          {getFieldDecorator((auth ? 'authNum' : 'resourceNum'), {
            rules: [
              {required: true, message: '请输入权限编码'},
              {validator: (rule, val, callback) => {
                const value = trim(val);
                const reg = /^[A-Za-z0-9\/\-_:{}]+$/;
                if (value && !reg.test(value)) {
                  callback('格式错误，只能输入英文 数字 / _ - : { }');
                }
                callback();
              }}
            ],
          })(
            <Input disabled={!editAble} placeholder="请输入权限编码" />
          )}
        </FormItem>
        <FormItem label="权限链接" {...formItemLayout} hasFeedback>
          {getFieldDecorator('url', {
            rules: [
              {validator: (rule, val, callback) => {
                const value = trim(val);
                const reg = /^\/[\w+\{\}\?\&=\/]+/;
                if (value && !reg.test(value)) {
                  callback('请使用正确的路径规则！');
                }
                callback();
              }}
            ],
          })(
            <Input disabled={!editAble} placeholder="请输入权限链接" />
          )}
        </FormItem>
        <FormItem label="父级权限" {...formItemLayout}>
          {getFieldDecorator('parentName')(
            <Input disabled />
          )}
        </FormItem>
        {editAble ?
          <FormItem wrapperCol={{span: 14, offset: 4}}>
            <CheckAuth code={auth ? 'createAuth' : 'createResource'} auths={auths}>
              <Button onClick={createRole} type="primary" icon="solution">添加权限</Button>
            </CheckAuth>
            { props.system && props.system.treePid ?
              <CheckAuth code={auth ? 'deleteAuth' : 'deleteResource'} auths={auths}>
                <Popconfirm onConfirm={deleteRole} title="确定删除该权限么？" okText="确认" cancelText="取消">
                  <Button className={styles.btnMargin} icon="delete">删除</Button>
                </Popconfirm>
              </CheckAuth>
              : null
            }
          </FormItem>
          : null
        }
      </Form>
    );
  }
);
export default SystemForm;
