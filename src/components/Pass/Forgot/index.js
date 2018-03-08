import React from 'react';
import { Modal, Form, Input } from 'antd';
import { trim } from 'lodash';

const FormItem = Form.Item;
const Forgot = Form.create()(
  (props) => {
    const { show, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        visible={!!show}
        title="忘记密码"
        okText="发送"
        onCancel={onCancel}
        onOk={onCreate}
        maskClosable={false}
        width="30%"
      >
        <Form horizontal onSubmit={ (evt) => {evt.preventDefault(); onCreate();}}>
          <FormItem label="邮箱地址" {...formItemLayout} >
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: '请输入邮箱地址！'},
                { validator: (rule, val, callback) => {
                  const value = trim(val);
                  const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                  if (value && !reg.test(value)) {
                    callback('邮箱格式错误，前缀支持英文大小写，数字，. - _');
                  }
                  callback();
                }}
              ],
            })(
              <Input placeholder="邮箱地址" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);
export default Forgot;
