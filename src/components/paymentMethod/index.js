//添加支付信息
import React, { useState } from "react";
import { Form, Input, Button, Row, message } from "antd";
import { AlipayCircleOutlined, createFromIconfontCN } from "@ant-design/icons";
import "./index.css";
import { connect } from "react-redux";
import { handleFetchForm } from "../../redux/actions/form";
import $axios from "../../axios/$axios";
import { useTranslation } from "react-i18next";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1701775_j1vsjy26z5r.js",
});
export const PaymentMethod = (props) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 16, offset: 8 },
    },
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 5, offset: 0 },
      sm: { span: 5, offset: 3 },
    },
    wrapperCol: {
      xs: { span: 6, offset: 0 },
      sm: { span: 12, offset: 0 },
    },
  };

  const onFinish = (values) => {
    setLoading(true);

    $axios
      .post(`/${props.mode}/update`, {
        ...values,
        uid: props.formData.uid,
      })
      .then(() => {
        message.success(t("Save successfully"));
        setLoading(false);
        props.handleFetchForm(props.setting.uid);
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.response.data.message);
      });
  };
  return (
    <div className="alipay-container" style={{ position: "relative" }}>
      <Row justify="center" style={{ marginTop: "20px" }}>
        {props.mode === "alipay" ? (
          <AlipayCircleOutlined className="alipay-icon" />
        ) : (
          <IconFont type="icon-social-paypal" className="paypal-icon" />
        )}

        <p className="alipay-title">{props.title}</p>
      </Row>
      <Form
        {...formItemLayout}
        onFinish={onFinish}
        name="control-ref"
        initialValues={props.formData}
        style={{ marginTop: "40px" }}
      >
        {props.mode === "alipay" ? (
          <div>
            <Form.Item
              label={t("App id")}
              name="appId"
              rules={[
                {
                  required: true,
                  message: t("Please enter your app id"),
                },
              ]}
            >
              <Input placeholder={t("App id")} />
            </Form.Item>
            <Form.Item
              name="publicKey"
              label={t("Alipay public key")}
              rules={[
                {
                  required: true,
                  message: t("Please enter Alipay public key"),
                },
              ]}
            >
              <Input.TextArea
                placeholder={t("Alipay public key not App public key")}
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
            <Form.Item
              name="secretKey"
              label={t("App secret key")}
              rules={[
                {
                  required: true,
                  message: t("Please enter app secret key"),
                },
              ]}
            >
              <Input.TextArea
                placeholder={t("App secret key")}
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </div>
        ) : (
          <div>
            <Form.Item
              label="ClientID"
              name="clientId"
              rules={[
                {
                  required: true,
                  message: t("Please enter your client ID"),
                },
              ]}
            >
              <Input.TextArea
                placeholder="ClientID"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
            <Form.Item
              label="Secret"
              name="secret"
              rules={[
                {
                  required: true,
                  message: t("Please enter your client secret"),
                },
              ]}
            >
              <Input.TextArea
                placeholder="Secret"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </div>
        )}

        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t("Save")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { setting: state.product.setting };
};
const actionCreator = {
  handleFetchForm,
};
export default connect(mapStateToProps, actionCreator)(PaymentMethod);
