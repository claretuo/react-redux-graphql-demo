import React from 'react';
import { Modal, Form, Input } from 'antd';
import { minRealLen, maxRealLen, onlyCharAndNum } from 'utils/validation';
import {trim} from 'lodash';

const FormItem = Form.Item;
const EditSystem = Form.create({
  mapPropsToFields(props) {
    return {
      name: {
        value: props.show.name
      },
      number: {
        value: props.show.number
      },
      url: {
        value: props.show.url
      }
    };
  }
})(
  (props) => {
    const { show, onCancel, onCreate, form, loading } = props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        visible={!!show}
        title="编辑系统"
        okText="编辑"
        onCancel={onCancel}
        onOk={onCreate}
        maskClosable={false}
        confirmLoading={loading}
      >
        <Form horizontal onSubmit={onCreate}>
          <FormItem label="系统名称" {...formItemLayout} hasFeedback>
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '请输入系统名称！'},
                { validator: (rule, value, callback) => {
                  if (!minRealLen(value, 4)) {
                    callback('系统名称长度太短，最短两个汉字或者四个英文字符！');
                  }
                  if (!maxRealLen(value, 16)) {
                    callback('系统名称长度太长，最长八个汉字或者十六个英文字符！');
                  }
                  callback();
                }}
              ],
            })(
              <Input placeholder="请输入系统名称" />
            )}
          </FormItem>
          <FormItem label="系统编码" {...formItemLayout} hasFeedback>
            {getFieldDecorator('number', {
              rules: [
                { required: true, message: '请输入系统编码！'},
                { validator: (rule, value, callback) => {
                  if (value && !onlyCharAndNum(value)) {
                    callback('格式错误，仅支持英文字符+数字组合！');
                  }
                  if (!minRealLen(value, 2)) {
                    callback('系统编码长度太短，最短两个英文字符+数字组合！');
                  }
                  if (!maxRealLen(value, 10)) {
                    callback('系统编码长度太长，最长十个英文字符+数字组合！');
                  }
                  callback();
                }}
              ],
            })(
              <Input placeholder="请输入系统编码" />
            )}
          </FormItem>
          <FormItem label="系统URL" {...formItemLayout} hasFeedback>
            {getFieldDecorator('url', {
              rules: [
                { required: true, message: '请输入系统URL！'},
                { validator: (rule, val, callback) => {
                  const value = trim(val);
                  const reg = /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
                  if (value && !reg.test(value)) {
                    callback('请输入正确的url地址！');
                  }
                  callback();
                }}
              ],
            })(
              <Input placeholder="请输入系统URL" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);
export default EditSystem;
