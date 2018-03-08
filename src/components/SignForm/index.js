import React from 'react';
import { Form, Input, Button } from 'antd';
import { trim } from 'lodash';

const FormItem = Form.Item;
const SigninForm = Form.create()(
  (props) => {
    const { form, onCreate, forgotPass } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form horizontal onSubmit={ (evt) => {evt.preventDefault(); onCreate();}}>
        <FormItem label="员工编号" {...formItemLayout} hasFeedback>
          {getFieldDecorator('identifer', {
            rules: [
              {required: true, message: '请输入员工编号！'},
              { validator: (rule, val, callback) => {
                const value = trim(val);
                const reg = /^G-([0-9]{8})$/;
                if (!reg.test(value)) {
                  callback('员工编号格式错误，标准格式为“G-20XXXXXX”！');
                }
                callback();
              }}
            ],
          })(
            <Input placeholder="请输入员工编号" />
          )}
        </FormItem>
        <FormItem label="密码" {...formItemLayout} hasFeedback>
          {getFieldDecorator('pass', {
            rules: [
              {required: true, message: '请输入密码！'}
            ],
          })(
            <Input type="password" placeholder="请输入密码" />
          )}
        </FormItem>
        <FormItem wrapperCol={{span: 12, offset: 10}}>
          <Button type="primary" htmlType="submit" size="large">登录</Button>
          <a onClick={forgotPass} style={{ float: 'right'}}>忘记密码？</a>
        </FormItem>
      </Form>
    );
  }
);
export default SigninForm;
