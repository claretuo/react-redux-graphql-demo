import React, { Component, PropTypes} from 'react';
import { Modal, Form, Input } from 'antd';
const FormItem = Form.Item;
const checkStrong = val => {
  let modes = 0;
  if (val.length < 8) return 0;
  if (/\d/.test(val)) modes++; // 数字
  if (/[a-z]/.test(val)) modes++; // 小写
  if (/[A-Z]/.test(val)) modes++; // 大写
  if (/\W/.test(val)) modes++; // 特殊字符
  return modes;
};
class Reset extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    form: PropTypes.object,
    loading: PropTypes.bool.isRequired
  }

  render() {
    const { show, onCancel, onCreate, form, loading } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        visible={!!show}
        title="修改密码"
        okText="保存"
        onCancel={onCancel}
        onOk={onCreate}
        maskClosable={false}
        width="30%"
        confirmLoading={loading}
      >
        <Form horizontal onSubmit={ (evt) => {evt.preventDefault(); onCreate();}}>
          <FormItem label="原密码" {...formItemLayout} >
            {getFieldDecorator('currentPass', {
              rules: [
                { required: true, message: '请输入原密码！'},
              ],
            })(
              <Input placeholder="原密码" type="password"/>
            )}
          </FormItem>
          <FormItem label="新密码" {...formItemLayout} >
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: '请输入新密码！'},
                { validator: (rule, value, callback) => {
                  if (value && checkStrong(value) < 2) {
                    callback('密码过于简单，包括：数字、特殊字符、小写字母、大写字母中的任意两种,8-20位。');
                  }
                  if (value && value.length > 20) {
                    callback('密码长度过长，最长20位');
                  }
                  callback();
                }}
              ],
            })(
              <div>
                <Input placeholder="新密码" type="password"/>
              </div>
            )}
          </FormItem>
          <FormItem label="确认密码" {...formItemLayout} >
            {getFieldDecorator('confirmpassword', {
              rules: [
                { required: true, message: '请输入确认密码！'},
                { validator: (rule, value, callback) => {
                  if (value && checkStrong(value) < 2) {
                    callback('密码过于简单，包括：数字、特殊字符、小写字母、大写字母中的任意两种,8-20位。');
                  }
                  if (value && value.length > 20) {
                    callback('密码长度过长，最长20位');
                  }
                  if (value && form.getFieldValue('password') && value !== form.getFieldValue('password')) {
                    callback('两次输入密码不一致');
                  }
                  callback();
                }}
              ],
            })(
              <div>
                <Input placeholder="确认密码" type="password"/>
              </div>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(Reset);
