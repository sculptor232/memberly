import React, { useEffect, useState } from "react";
import { Button, Modal, message, Form, Input } from "antd";
import { connect } from "react-redux";
import $axios from "../../axios/$axios";
import {
  handleForm,
  handleVerify,
  handleVerifyDialog,
  handleFetchForm,
} from "../../redux/actions/form";
import { useTranslation } from "react-i18next";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: {
    xs: { span: 16, offset: 0 },
    sm: { span: 16, offset: 10 },
  },
};
const SecurtyModal = (props) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    props.handleForm(null);
    // eslint-disable-next-line
  }, []);

  const handleCancel = () => {
    props.handleVerifyDialog(false);
  };
  const onFinish = (values) => {
    setLoading(true);
    $axios
      .post(`/user/updateInfo`, {
        ...values,
        uid: props.user._id,
      })
      .then(() => {
        props.handleVerify(true);
        props.handleVerifyDialog(false);
        props.handleFetchForm(props.user._id);
        message.success(t("Edit successfully"));
        setLoading(false);
      })
      .catch((error) => {
        message.error(t("Editing failed"));
        setLoading(false);
      });
  };
  return (
    <Modal
      visible={props.isShowDialog}
      title={props.title}
      onCancel={handleCancel}
      footer={[
        <Button key="submit" type="primary" onClick={handleCancel}>
          {t("Cancel")}
        </Button>,
      ]}
    >
      <Form {...layout} onFinish={onFinish}>
        <Form.Item
          label={props.label}
          name={props.name}
          rules={[
            {
              required: true,
              message: props.placeholder,
            },
          ]}
        >
          <Input placeholder={props.placeholder} />
        </Form.Item>

        <Form.Item
          label={t("First security question")}
          name="answer1"
          rules={[
            {
              required: true,
              message: t("Please enter your best friend's name"),
            },
          ]}
        >
          <Input placeholder={t("Your best friend's name")} />
        </Form.Item>
        <Form.Item
          label={t("Second security question")}
          name="answer2"
          rules={[
            {
              required: true,
              message: t("Please enter your favorite movie's name"),
            },
          ]}
        >
          <Input placeholder={t("Your favorite movie's name")} />
        </Form.Item>
        <Form.Item
          label={t("Third security question")}
          name="answer3"
          rules={[
            {
              required: true,
              message: t("Please enter the brand of your first phone"),
            },
          ]}
        >
          <Input placeholder={t("Brand of your first phone")} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t("Update")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    isShowDialog: state.form.isShowDialog,
    isVerified: state.form.isVerified,
    user: state.form.user,
  };
};
const actionCreator = {
  handleForm,
  handleVerify,
  handleVerifyDialog,
  handleFetchForm,
};
export default connect(mapStateToProps, actionCreator)(SecurtyModal);
