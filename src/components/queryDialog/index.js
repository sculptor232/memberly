import React, { useState, useEffect } from "react";
import { Tabs, Modal, Button, Form, Input, message } from "antd";
import "./index.css";
import { decrypt } from "../../utils/crypto";
import $axios from "../../axios/$axios";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;
const Query = (props) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleCheck = async () => {
    setLoading(true);
    if (formData.orderId !== undefined) {
      $axios(`/order/query?orderId=${formData.orderId}`)
        .then((result) => {
          setOrderInfo(result.data);
          setLoading(false);
          showQueryModal();
        })
        .catch((error) => {
          setLoading(false);
          message.warning(error.response.data.message);
        });
    } else {
      $axios(
        `/order/query?email=${formData.email}&password=${
          formData.password
        }&productId=${document.location.href.split("/").reverse()[0]}`
      )
        .then((result) => {
          setOrderInfo(result.data);
          showQueryModal();
          setLoading(false);
        })
        .catch((error) => {
          message.warning(error.response.data.message);
          setLoading(false);
        });
    }
  };
  const showQueryModal = () => {
    setDialogVisible(true);
  };
  const showLocalModal = () => {
    if (localStorage.getItem("orderInfo")) {
      setOrderInfo(JSON.parse(decrypt(localStorage.getItem("orderInfo"))));
    } else {
      message.warning(t("No match order"));
      return;
    }
    setDialogVisible(true);
  };

  const handleOk = (e) => {
    setDialogVisible(false);
    setOrderInfo(null);
  };

  const handleCancel = (e) => {
    setDialogVisible(false);
    setOrderInfo(null);
  };

  const onFinish = (values) => {
    setFormData(values);
  };
  useEffect(() => {
    formData && handleCheck();
    // eslint-disable-next-line
  }, [formData]);
  return (
    <Modal
      visible={props.showQuery}
      onOk={() => {
        props.handleQuery(false);
      }}
      onCancel={() => {
        props.handleQuery(false);
      }}
      footer={[]}
      closable={false}
      bodyStyle={{ padding: 0 }}
    >
      {dialogVisible ? (
        <Modal
          title={t("Order info")}
          visible={dialogVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          style={{ userSelect: "text" }}
          footer={[
            <Button key="confirm" type="primary" onClick={handleOk}>
              {t("Confirm")}
            </Button>,
          ]}
        >
          <p>
            {t("Order ID")}: {orderInfo.orderId}
          </p>
          <p>
            {t("Purchase date")}: {orderInfo.date}
          </p>
          <p>
            {t("Subscription plan")}: {orderInfo.productName}
            {orderInfo.levelName}
          </p>
          <p>
            {t("Price")}: ???{orderInfo.price}
          </p>
          <p>
            {t("Redeem code")}: {orderInfo.code}
          </p>
        </Modal>
      ) : null}
      <Tabs defaultActiveKey="1" className="query-box-container">
        <TabPane tab={t("Search locally")} key="1" className="query-by-local">
          <Button
            type="primary"
            onClick={showLocalModal}
            size="medium"
            loading={loading}
          >
            {t("Search order")}
          </Button>

          <div className="query-alert">
            {t("Only avilable for the browser that you place orderes on")}
          </div>
        </TabPane>
        <TabPane tab={t("Search with order ID")} key="2">
          <Form onFinish={onFinish}>
            <Form.Item
              // label="????????????"
              name="orderId"
              rules={[
                {
                  required: true,
                  message: t("Please enter order ID"),
                },
              ]}
            >
              <Input
                placeholder={t("Order ID")}
                className="query-input-box"
                style={{ borderRadius: "5px" }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="medium"
                style={{ marginTop: "10px" }}
                loading={loading}
              >
                {t("Search order")}
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab={t("Search with email")} key="3">
          <Form onFinish={onFinish}>
            <Form.Item
              // label="????????????"
              name="email"
              rules={[
                {
                  required: true,
                  message: t("Please enter email"),
                },
              ]}
            >
              <Input
                placeholder={t("Email")}
                className="query-input-mail"
                style={{ borderRadius: "5px" }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              // label="????????????"
              rules={[
                {
                  min: 8,
                  message: t("Length of password should be longer than 8"),
                },
                {
                  required: true,
                  message: t("Please enter password"),
                },
              ]}
            >
              <Input
                placeholder={t("Password")}
                className="query-input-mail"
                style={{ borderRadius: "5px" }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                className=""
                type="primary"
                htmlType="submit"
                size="medium"
                style={{ marginTop: "10px" }}
                loading={loading}
              >
                {t("Search order")}
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
      <p className="query-alert">{t("Only the latest order can be queried")}</p>{" "}
    </Modal>
  );
};

export default Query;
