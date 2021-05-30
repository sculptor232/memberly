import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Checkbox, message } from "antd";
import { connect } from "react-redux";
import "./index.css";
import $axios from "../../axios/$axios";
import { withRouter } from "react-router-dom";
import { handleFetchSetting } from "../../redux/actions/product";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const FormItem = Form.Item;
const Login = (props) => {
  const [isForget, setIsforget] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const onFinish = (values) => {
    setLoading(true);
    if (isForget) {
      $axios
        .post("/user/forget", values)
        .then(() => {
          message.success(
            t("Modify successfully, You can login with your new password")
          );
          setLoading(false);
        })
        .catch((error) => {
          message.error(error.response.data.message);
          setLoading(false);
        });
    } else {
      $axios
        .post("/user/login", values)
        .then((res) => {
          localStorage.setItem("jwt", res.data.jwt);
          localStorage.setItem("uid", res.data._id);
          props.handleFetchSetting(res.data._id);
          props.history.push("/productList");
          message.success(t("Login successfully"));
          setLoading(false);
        })
        .catch((err) => {
          message.error(t("Wrong username or password"));
          setLoading(false);
        });
    }
  };

  const handleForget = (bool) => {
    setIsforget(bool);
  };
  return (
    <div className="login-container">
      <img src="assets/login.svg" alt="" className="login-image" />
      <Row className="login-title" justify="center">
        <div style={{ width: "400px" }}>
          <img
            src="../assets/logo.svg"
            alt=""
            className="login-logo"
            style={{ width: "50px", marginTop: "70px", marginLeft: "70px" }}
          />

          <span className="login-logo-text">Memberly</span>
        </div>
      </Row>

      <Row justify="center" span={8}>
        <div className="login-form">
          <Form
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            {isForget ? (
              <div>
                <FormItem
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: t("You need to enter your email"),
                    },
                  ]}
                  style={{ marginBottom: "10px" }}
                >
                  <Input
                    placeholder={t("Email")}
                    className="login-input"
                    prefix={<UserOutlined />}
                  />
                </FormItem>
                <FormItem
                  name="answer1"
                  rules={[
                    {
                      required: true,
                      message: t("You need to enter your best friend's name"),
                    },
                  ]}
                  style={{ marginBottom: "10px" }}
                >
                  <Input
                    placeholder={t("Your best friend's name")}
                    className="login-input"
                  />
                </FormItem>
                <FormItem
                  name="answer2"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "You need to enter your favorite movie's name"
                      ),
                    },
                  ]}
                  style={{ marginBottom: "10px" }}
                >
                  <Input
                    placeholder={t("Your favorite movie's name")}
                    className="login-input"
                  />
                </FormItem>
                <Form.Item
                  name="answer3"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "You need to enter the brand of your first phone"
                      ),
                    },
                  ]}
                >
                  <Input placeholder={t("The brand of your first phone")} />
                </Form.Item>
                <FormItem
                  name="password"
                  rules={[
                    {
                      min: 8,
                      message: t("Password length should be longer than 8"),
                    },
                    {
                      required: true,
                      message: t("You need to enter the new password"),
                    },
                  ]}
                  style={{ marginBottom: "10px" }}
                >
                  <Input.Password
                    placeholder={t("New password")}
                    className="login-input"
                    prefix={<LockOutlined />}
                  />
                </FormItem>
              </div>
            ) : (
              <div>
                <FormItem
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: t("You need to enter the email"),
                    },
                  ]}
                >
                  <Input
                    placeholder={t("Email")}
                    className="login-input"
                    prefix={<UserOutlined />}
                  />
                </FormItem>
                <FormItem
                  name="password"
                  rules={[
                    {
                      min: 8,
                      message: t("Password length should be longer than 8"),
                    },
                    {
                      required: true,
                      message: t("You need to enter your password"),
                    },
                  ]}
                  style={{ marginBottom: "10px" }}
                >
                  <Input.Password
                    placeholder={t("Password")}
                    prefix={<LockOutlined />}
                    className="login-input"
                  />
                </FormItem>

                <Row justify="space-between">
                  <Col style={{ height: "35px" }}>
                    <Form.Item name="remember" valuePropName="checked">
                      <Checkbox>{t("Remember password")}</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col
                    style={{
                      height: "30px",
                      lineHeight: "35px",
                      color: "#40a9ff",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleForget(true);
                    }}
                  >
                    {t("Forget password ?")}
                  </Col>
                </Row>
              </div>
            )}
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                style={{ marginTop: "10px", width: "100%" }}
              >
                {isForget ? t("Sumbit") : t("Login")}
              </Button>
              {isForget ? (
                <Button
                  size="large"
                  block
                  style={{ marginTop: "10px", width: "100%" }}
                  onClick={() => {
                    handleForget(false);
                  }}
                >
                  {t("Return")}
                </Button>
              ) : (
                <Button
                  size="large"
                  block
                  style={{ marginTop: "10px", width: "100%" }}
                  onClick={() => {
                    props.history.push("install");
                  }}
                >
                  {t("Register")}
                </Button>
              )}
            </FormItem>
          </Form>
        </div>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.form.user,
    setting: state.product.setting,
  };
};
const actionCreator = {
  handleFetchSetting,
};
export default connect(mapStateToProps, actionCreator)(withRouter(Login));
