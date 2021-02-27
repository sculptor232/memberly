import React, { useState, useEffect } from "react";
import $axios from "../../axios/$axios";
import { Form, Input, Button, message } from "antd";
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
};
const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 12, offset: 0 },
  },
};
const ChangePassword = (props) => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    $axios
      .post(`/user/update/${props.user._id}`, values)
      .then(() => {
        message.success("保存成功");
        setLoading(false);
      })
      .catch(() => {
        message.error("保存失败");
        setLoading(false);
      });
  };
  return (
    <Form
      {...formItemLayout}
      onFinish={onFinish}
      initialValues={props.formData ? props.formData : null}
      style={{ marginTop: "40px" }}
    >
      <Form.Item
        label="新密码"
        name="password"
        rules={[
          { min: 8, message: "密码长度不能小于8位" },
          {
            required: true,
            message: "请输入密码",
          },
        ]}
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>

      <Form.Item
        label="安全问题1"
        name="answer1"
        rules={[
          {
            required: true,
            message: "请输入您最好的朋友的姓名",
          },
        ]}
      >
        <Input placeholder="请输入您最好的朋友的姓名" />
      </Form.Item>
      <Form.Item
        label="安全问题2"
        name="answer2"
        rules={[
          {
            required: true,
            message: "请输入您最爱的电影的名字",
          },
        ]}
      >
        <Input placeholder="请输入您最爱的电影的名字" />
      </Form.Item>
      <Form.Item
        label="安全问题3"
        name="answer3"
        rules={[
          {
            required: true,
            message: "请输入您拥有的第一部手机的品牌",
          },
        ]}
      >
        <Input placeholder="请输入您拥有的第一部手机的品牌" />
      </Form.Item>
      <Form.Item {...formItemLayoutWithOutLabel}>
        <Button type="primary" htmlType="submit" loading={loading}>
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};
export default ChangePassword;
