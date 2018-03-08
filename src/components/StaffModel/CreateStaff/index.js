import React from 'react';
import { Modal, Form, Input, Radio, Select, DatePicker } from 'antd';
import { minRealLen, maxRealLen, isPhone } from 'utils/validation';
import { trim } from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const CreateStaff = Form.create()(
  (props) => {
    const { show, onCancel, onCreate, form, department, loading } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const disabledDate = (current) => {
      // can not select days before today and today
      return current && current.valueOf() > Date.now();
    };
    return (
      <Modal
        visible={!!show}
        title="添加员工"
        okText="创建"
        onCancel={onCancel}
        onOk={onCreate}
        maskClosable={false}
        confirmLoading={loading}
      >
        <Form horizontal onSubmit={onCreate}>
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
          <FormItem label="员工性别" {...formItemLayout}>
            {getFieldDecorator('sex', {
              initialValue: 'MALE',
            })(
              <Radio.Group>
                <Radio value="MALE">男性</Radio>
                <Radio value="FEMALE">女性</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="手机号码" {...formItemLayout} hasFeedback>
            {getFieldDecorator('phone', {
              rules: [
                {required: true, message: '请输入手机号码！'},
                { validator: (rule, value, callback) => {
                  if (!isPhone(value)) {
                    callback('手机号码格式错误！');
                  }
                  callback();
                }}
              ],
            })(
              <Input type="phone" placeholder="请输入手机号码" />
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
              <Input />
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
          <FormItem label="入职日期" {...formItemLayout}>
            {getFieldDecorator('entryDatetime', {
              rules: [
                { type: 'object', required: true, message: '请选择员工入职时间' }
              ],
            })(
              <DatePicker disabledDate={disabledDate} format="YYYY-MM-DD"/>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);
export default CreateStaff;
