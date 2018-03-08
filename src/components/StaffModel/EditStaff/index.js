import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { minRealLen, maxRealLen } from 'utils/validation';
import { trim } from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const EditStaff = Form.create({
  mapPropsToFields(props) {
    return {
      userNum: {
        value: props.show.userNum
      },
      realName: {
        value: props.show.realName
      },
      innerEmail: {
        value: props.show.innerEmail
      },
      departmentId: {
        value: `${props.show.department.id || '无部门'}`
      },
      phone: {
        value: props.show.phone
      }
    };
  }
})(
  (props) => {
    const { show, onCancel, onCreate, form, department, loading, disableEdit } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    return (
      !disableEdit ?
      <Modal
        visible={!!show}
        title="编辑员工"
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate}
        maskClosable={false}
        confirmLoading={loading}
      >
        <Form horizontal onSubmit={onCreate}>
          <FormItem label="员工编号" {...formItemLayout}>
            {getFieldDecorator('userNum')(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem label="员工姓名" {...formItemLayout} hasFeedback>
            {getFieldDecorator('realName', {
              rules: [
                {required: true, message: '请输入员工姓名！'},
                { validator: (rule, value, callback) => {
                  if (!minRealLen(value, 4)) {
                    callback('员工姓名长度太短，最短两个汉字或者四个英文字符！');
                  }
                  if (!maxRealLen(value, 16)) {
                    callback('员工姓名长度太长，八个汉字或者十六个英文字符！');
                  }
                  callback();
                }}
              ],
            })(
              <Input placeholder="请输入员工姓名" />
            )}
          </FormItem>
          <FormItem label="邮箱" {...formItemLayout}>
            {getFieldDecorator('innerEmail', {
              rules: [
                {required: true, message: '请输入员工邮箱！'},
                { validator: (rule, val, callback) => {
                  const value = trim(val);
                  const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                  if (value && !reg.test(value)) {
                    callback('邮箱格式错误，前缀支持英文大小写，数字，. - _');
                  }
                  if (!minRealLen(value, 4)) {
                    callback('邮箱长度太短，最短四个英文字符！');
                  }
                  callback();
                }}
              ],
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="部门选择" {...formItemLayout}>
            {getFieldDecorator('departmentId', {
              rules: [
                { required: true, message: '请选择一个部门！' }
              ],
            })(
              department && department.length ?
               <Select showSearch optionFilterProp="children" placeholder="请选择一个部门">
                 { department.map((item, key) => (
                   <Option value={`${item.id}`} key={key}>{item.name}</Option>
                 ))}
               </Select>
               : '没有数据'
            )}
          </FormItem>
        </Form>
      </Modal>
      :
      <Modal
        visible={!!show}
        title="员工信息"
        onCancel={onCancel}
        maskClosable
        footer={null}
      >
        <Form horizontal onSubmit={onCreate}>
          <FormItem label="员工编号" {...formItemLayout}>
            {getFieldDecorator('userNum')(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem label="员工姓名" {...formItemLayout} hasFeedback>
            {getFieldDecorator('realName', {
              rules: [
                {required: true, message: '请输入员工姓名！'},
                { validator: (rule, value, callback) => {
                  if (!minRealLen(value, 4)) {
                    callback('员工姓名长度太短，最短两个汉字或者四个英文字符！');
                  }
                  if (!maxRealLen(value, 16)) {
                    callback('员工姓名长度太长，八个汉字或者十六个英文字符！');
                  }
                  callback();
                }}
              ],
            })(
              <Input placeholder="请输入员工姓名" disabled />
            )}
          </FormItem>
          <FormItem label="手机号码" {...formItemLayout} hasFeedback>
            {getFieldDecorator('phone', {
              rules: [
                {required: true, message: '请输入员工手机号码！'}
              ],
            })(
              <Input disabled />
            )}
          </FormItem>
          <FormItem label="内部邮箱" {...formItemLayout}>
            {getFieldDecorator('innerEmail', {
              rules: [
                {required: true, message: '请输入员工内部邮箱！'},
                { validator: (rule, val, callback) => {
                  const value = trim(val);
                  const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                  if (value && !reg.test(value)) {
                    callback('邮箱格式错误，前缀支持英文大小写，数字，. - _');
                  }
                  if (!minRealLen(value, 4)) {
                    callback('邮箱长度太短，最短四个英文字符！');
                  }
                  callback();
                }}
              ],
            })(
              <Input disabled/>
            )}
          </FormItem>
          <FormItem label="部门选择" {...formItemLayout}>
            <span>{props.show.department && props.show.department.name || '无部门'}</span>
          </FormItem>
        </Form>
      </Modal>
    );
  }
);
export default EditStaff;
