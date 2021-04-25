import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Row, Radio } from "antd";
import "./index.css";
import { connect } from "react-redux";
import $axios from "../../axios/$axios";
import { handleFetchForm } from "../../redux/actions/form";
import { handleFetchSetting } from "../../redux/actions/product";
import { createFromIconfontCN } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1701775_j1vsjy26z5r.js",
});
const Mail = (props) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const email = props.email;
  let formRef = React.createRef();
  const onFinish = (values) => {
    setLoading(true);

    if (values.defaultMail === 1) {
      $axios
        .post(`/setting/update`, {
          ...props.setting,
          defaultMail: props.mailName,
        })
        .then(() => {
          props.handleFetchSetting(props.setting.uid);
        })
        .catch(() => {
          message.error(t("Changing default mail failed"));
        });
    }
    $axios
      .post(`/email/update/${email._id}`, {
        ...values,
        mailName: props.mailName,
      })
      .then(() => {
        message.success(t("Save successfully"));

        props.handleFetchForm(props.setting.uid);
        setLoading(false);
      })
      .catch(() => {
        message.error(t("Saving failed"));
        setLoading(false);
      });
  };
  useEffect(() => {
    if (props.isVerified) {
      formRef.current.setFieldsValue(email);
    }
    // eslint-disable-next-line
  }, [props.mailName]);
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
  return (
    <div className="mail-page-container">
      <Row justify="center" style={{ marginTop: "20px" }}>
        <IconFont type={props.iconName} className="paypal-icon" />
        <p className="paypal-title">
          {t("Add email", { item: props.mailTitle })}
        </p>
      </Row>
      <div
        style={{
          backgroundColor: "white",
        }}
        className="mail-page-setting"
      >
        <Form
          {...formItemLayout}
          ref={formRef}
          name="control-ref"
          onFinish={onFinish}
          initialValues={{
            ...email,
            defaultMail: 1,
          }}
          style={{ marginTop: "40px" }}
        >
          <Form.Item
            label={t("Email address", { item: props.mailTitle })}
            name="mailAddress"
            rules={[
              {
                required: true,
                message: t("Please enter email address", {
                  item: props.mailTitle,
                }),
              },
            ]}
          >
            <Input
              placeholder={t("Email address", { item: props.mailTitle })}
            />
          </Form.Item>
          <Form.Item
            label={t("Email password", { item: props.mailTitle })}
            name="mailPassword"
            rules={[
              {
                required: true,
                message: t("Please enter email password", {
                  item: props.mailTitle,
                }),
              },
            ]}
          >
            <Input
              placeholder={t("Email password", { item: props.mailTitle })}
            />
          </Form.Item>
          {props.mailTitle === "smtp" && (
            <>
              <Form.Item
                label={t("Server address", { item: props.mailTitle })}
                name="host"
                rules={[
                  {
                    required: true,
                    message: t("Please enter server address", {
                      item: props.mailTitle,
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={t("Server address", { item: props.mailTitle })}
                />
              </Form.Item>
            </>
          )}
          {props.mailTitle === "gmail" && (
            <>
              <Form.Item
                label={`${props.mailTitle} client ID`}
                name="clientId"
                rules={[
                  {
                    required: true,
                    message: t("Please enter client ID", {
                      item: props.mailTitle,
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={t("Client id", { item: props.mailTitle })}
                />
              </Form.Item>
              <Form.Item
                label={t("Client secret", {
                  item: props.mailTitle,
                })}
                name="clientSecret"
                rules={[
                  {
                    required: true,
                    message: t("Please enter client secret", {
                      item: props.mailTitle,
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={t("Client secret", { item: props.mailTitle })}
                />
              </Form.Item>
              <Form.Item
                label={t("Refresh token", { item: props.mailTitle })}
                name="refreshToken"
                rules={[
                  {
                    required: true,
                    message: t("Please enter refresh token", {
                      item: props.mailTitle,
                    }),
                  },
                ]}
              >
                <Input
                  placeholder={t("Refresh token", { item: props.mailTitle })}
                />
              </Form.Item>
            </>
          )}
          <Form.Item
            label={t("Sender nickname")}
            name="sendName"
            rules={[
              {
                required: true,
                message: t("Please enter sender nickname"),
              },
            ]}
          >
            <Input placeholder={t("Sender nickname")} />
          </Form.Item>
          <Form.Item
            label={t("Set as default")}
            name="defaultMail"
            rules={[
              {
                required: true,
                message: t("Please choose whether to set it as default email"),
              },
            ]}
          >
            <Radio.Group>
              <Radio value={1}>{t("yes")}</Radio>
              <Radio value={2}>{t("no")}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ marginLeft: "10px" }}
            >
              {t("Save")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    setting: state.product.setting,
  };
};
const actionCreator = {
  handleFetchForm,
  handleFetchSetting,
};
export default connect(mapStateToProps, actionCreator)(Mail);
