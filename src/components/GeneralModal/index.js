import React, { useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import $axios from "../../axios/$axios";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";

const GeneralModal = (props) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    setLoading(true);
    $axios
      .post(props.target, { ...props.user, ...values })
      .then((res) => {
        setLoading(false);
        message.success(t("Set successfully"));
        props.setModalVisible(false);
      })
      .catch((error) => {
        message.warning(error.response.data.message);
        setLoading(false);
        console.log(error, "error");
      });
  };
  return (
    <Modal
      title={props.title}
      visible={props.isModalVisible}
      onOk={() => props.setModalVisible(false)}
      onCancel={() => props.setModalVisible(false)}
      footer={[
        <Button onClick={() => props.setModalVisible(false)}>
          {t("Cancel")}
        </Button>,
      ]}
    >
      <Form onFinish={onFinish} layout={isMobile ? "horizontal" : "inline"}>
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
          <Input
            placeholder={props.placeholder}
            style={isMobile ? {} : { borderRadius: "5px", width: "200px" }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t("Set")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default GeneralModal;
