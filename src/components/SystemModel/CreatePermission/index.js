import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { minRealLen, maxRealLen } from 'utils/validation';
import { trim } from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const CreatePermission = Form.create({
  mapPropsToFields: (props) => {
    return {
      parentName: {
        value: props.parentName || '无'
      }
    };
  }
})(
  (props) => {
    const { show, onCancel, onCreate, form, loading, auth } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        visible={!!show}
        title="创建权限"
        okText="创建"
        onCancel={onCancel}
        onOk={onCreate}
        maskClosable={false}
        confirmLoading={loading}
      >
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
              <Input placeholder="请输入权限名称" />
            )}
          </FormItem>
          <FormItem label="权限类型" {...formItemLayout}>
            {getFieldDecorator('type', {
              rules: [
                { required: true, message: '请选择权限类型' },
              ]
            })( auth ?
              <Select>
                <Option value="FOLDER">目录权限</Option>
                <Option value="PAGE">菜单权限</Option>
                <Option value="OPERATION">操作权限</Option>
              </Select>
              :
              <Select>
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
              <Input placeholder="请输入权限编码" />
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
              <Input placeholder="请输入权限链接" />
            )}
          </FormItem>
          <FormItem label="父级权限" {...formItemLayout}>
            {getFieldDecorator('parentName')(
              <Input disabled />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);
export default CreatePermission;
