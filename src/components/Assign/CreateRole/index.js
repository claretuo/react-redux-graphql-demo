import React from 'react';
import { Modal, Form, Input } from 'antd';
import { minRealLen, maxRealLen } from 'utils/validation';

const FormItem = Form.Item;
const CreateRole = Form.create()(
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
        title="新建角色"
        okText="新建"
        onCancel={onCancel}
        onOk={onCreate}
        maskClosable={false}
        confirmLoading={loading}
      >
        <Form horizontal onSubmit={(evt) => {evt.preventDefault(); onCreate();}}>
          <FormItem label="角色名称" {...formItemLayout} hasFeedback>
            {getFieldDecorator('name', {
              rules: [
                {required: true, message: '请输入角色名称'},
                { validator: (rule, value, callback) => {
                  if (!minRealLen(value, 4)) {
                    callback('角色名称长度太短，最短两个汉字或者四个英文字符！');
                  }
                  if (!maxRealLen(value, 16)) {
                    callback('角色名称长度太长，八个汉字或者十六个英文字符！');
                  }
                  callback();
                }}
              ],
            })(
              <Input placeholder="请输入角色名称" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);
export default CreateRole;
