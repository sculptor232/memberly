import React, { useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import $axios from "../../axios/$axios";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";

const DiscountVerify = (props) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    setLoading(true);
    $axios
      .post("/discount/query", {
        code: values.code,
        ...props.order,
      })
      .then((res) => {
        props.setDiscount({ price: res.data, code: values.code });
        setLoading(false);
        message.success(t("Verify successfully"));
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
      title={t("Verify discount code")}
      style={{ top: 5 }}
      visible={props.isModalVisible}
      onOk={() => props.setModalVisible(false)}
      onCancel={() => props.setModalVisible(false)}
      footer={[
        <Button onClick={() => props.setModalVisible(false)}>
          {t("Cancel")}
        </Button>,
      ]}
    >
      <Form
        onFinish={onFinish}
        layout={isMobile ? "horizontal" : "inline"}
        style={isMobile ? {} : { marginLeft: "60px" }}
      >
        <Form.Item
          label={t("Discount code")}
          name="code"
          rules={[
            {
              required: true,
              message: t("Please enter discount code"),
            },
          ]}
        >
          <Input
            placeholder={t("Please enter discount code")}
            style={isMobile ? {} : { borderRadius: "5px", width: "200px" }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t("Verify")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default DiscountVerify;
