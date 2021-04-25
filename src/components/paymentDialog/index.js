import React, { useState, useEffect } from "react";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { encrypt } from "../../utils/crypto";
import { isMobile } from "react-device-detect";
import QRCode from "qrcode.react";
import $axios from "../../axios/$axios";
import {
  Result,
  Spin,
  Col,
  Row,
  Form,
  Input,
  Button,
  Radio,
  message,
} from "antd";
import "./index.css";
import socket from "../../utils/socketUtil";
import DiscountVerify from "../discountVerify";
import { useTranslation } from "react-i18next";

let _count = 300;
let timer;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const PaymentDialog = (props) => {
  const { t } = useTranslation();

  const [paymentUrl, setPaymentUrl] = useState(null);
  const [formData, setFormData] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [paypalId, setPaypalId] = useState(null);
  const [alipayId, setAlipayId] = useState(null);
  const [failed, setFailed] = useState(false);
  const [currencyRate, setCurrencyRate] = useState(false);
  const [count, setCount] = useState(_count);
  const [isModalVisible, setModalVisible] = useState(false);
  const [useDiscount, setDiscount] = useState(null);
  let chooseLevel = { ...props.chooseLevel };
  let orderPrice = useDiscount
    ? useDiscount.price
    : chooseLevel.levelPrice.price;
  const formItemLayout = {
    labelCol: {
      sm: { span: 6 },
    },
    wrapperCol: {
      sm: { span: 16, offset: 1 },
    },
  };
  useEffect(() => {
    fetch("https://api.exchangeratesapi.io/latest?base=USD")
      .then((response) => response.json())
      .then((data) => {
        setCurrencyRate(data.rates ? data.rates.CNY : 6.5);
      });

    $axios
      .post("/checkPayment", {
        productId: document.location.href.split("/").reverse()[0],
      })
      .then((res) => {
        setAlipayId(res.data.alipayId);
        setPaypalId(res.data.paypalId);
        if (
          !res.data.alipayId &&
          !res.data.paypalId &&
          props.productInfo.allowBalance !== "yes"
        ) {
          message.error(t("Payment not configured"));
        }
      });
    return clearInterval(timer);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!paypalId || paypalId === " ") return;
    var scriptEle = document.createElement("script");
    scriptEle.src = `https://www.paypal.com/sdk/js?client-id=${paypalId}&currency=USD`;
    document.body.appendChild(scriptEle);
  }, [paypalId]);

  const onFinish = async (values) => {
    let orderId =
      Date.now().toString() + Math.floor(Math.random() * 9000 + 1000);
    setFormData({ ...values, orderId });
    socket.on("payment checked", async (paymentStatus) => {
      let metadata = await $axios.post(`/order/fetch`, { orderId });
      let order = metadata.data;
      if (paymentStatus === "paid") {
        setOrderInfo(order);
        message.success(t("Purchase successfully"));
        localStorage.setItem("orderInfo", encrypt(JSON.stringify(order)));
      }
      if (paymentStatus === "error") {
        message.error(t("Payment error"));
        setOrderInfo(order);
        setFailed(true);
        localStorage.setItem("orderInfo", encrypt(JSON.stringify(order)));
      }
      if (paymentStatus === "outdated") {
        message.error(t("Payment error"));
        setOrderInfo(order);
        setFailed(true);
        localStorage.setItem("orderInfo", encrypt(JSON.stringify(order)));
      }
    });
  };
  const handleCreateOrder = () => {
    $axios
      .post(`/order/${formData.payment}`, {
        ...formData,
        price: orderPrice,
        uid: props.productInfo.uid,
        productId: props.productInfo._id,
        productName: props.productInfo.productName,
        productType: props.productInfo.productType,
        levelName: chooseLevel.levelName,
        discount: useDiscount ? useDiscount.code : "unused",
      })
      .then((res) => {
        if (formData.payment !== "balance") {
          setPaymentUrl(res.data);
          timer = setInterval(() => {
            _count--;
            setCount(_count);
            if (_count === 0) {
              clearInterval(timer);
            }
          }, 1000);
        }
      })
      .catch((error) => {
        if (error.response) {
          message.error(error.response.data.message);
        }
        setFormData(null);
      });
  };

  useEffect(() => {
    if (!formData) return;
    if (formData.payment === "alipay" || formData.payment === "balance") {
      handleCreateOrder();
      if (document.querySelector(".paypal-buttons"))
        document.querySelector(".paypal-buttons").style.display = "none";
    } else {
      window.paypal
        .Buttons({
          // Set up the transaction
          createOrder: function (data, actions) {
            handleCreateOrder();
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value:
                      //金额低于0.01,paypal会报错
                      orderPrice < 0.1
                        ? "￥0.01"
                        : "￥" + (orderPrice / currencyRate).toFixed(2),
                  },
                },
              ],
            });
          },

          onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
              // Show a success message to the buyer
              message.success(t("Processing order, please wait"));
              $axios
                .post(`/paypal/callback`, {
                  orderId: formData.orderId,
                  captureId: details.purchase_units[0].payments.captures[0].id,
                  uid: props.productInfo.uid,
                })
                .then((res) => {})
                .catch((error) => {
                  message.error(t("Purchase failed"));
                });
            });
          },
          style: {
            color: "blue",
            shape: "pill",
            label: "pay",
            height: 40,
          },
        })
        .render("#paypal-button-container");
    }
    // eslint-disable-next-line
  }, [formData]);
  const closeDialog = () => {
    _count = 300;
    clearInterval(timer);
    props.handleDialog(false, null);
  };
  return (
    <div className="product-payment-container">
      <DiscountVerify
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        useDiscount={useDiscount}
        setDiscount={setDiscount}
        order={{
          productName: props.productInfo.productName,
          levelName: chooseLevel.levelName,
          price: chooseLevel.levelPrice.price,
          uid: props.productInfo.uid,
        }}
      />
      <CloseOutlined
        className="product-payment-close"
        onClick={() => {
          closeDialog();
        }}
      />

      <Row justify="center" className="product-payment-title">
        {t("Place order")}
      </Row>
      <Row justify="center" className="product-payment-message">
        {props.productInfo.productType === 1
          ? t(
              "You will receive a redeem code after purchase. Email and password can be used to query your order. Please contact us If you has any questions regrading your order",
              { levelName: chooseLevel.levelName }
            )
          : t(
              "Please enter your email and password. Your account will automaticaly be promoted after purchase. Please contact us If you has any questions regrading your order",
              {
                productName: props.productInfo.productName,
                levelName: chooseLevel.levelName,
              }
            )}
      </Row>
      {orderInfo ? (
        failed ? (
          <Result
            status="error"
            title={t("Purchase failed")}
            subTitle={t(
              "Order error, please contact us with the following order info"
            )}
            extra={[
              <div className="product-payment-results-detail" key={"orderInfo"}>
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
                  {t("Price")}: ￥{orderInfo.price}
                </p>
                <p>
                  {t("Email")}: {orderInfo.email}
                </p>
              </div>,
            ]}
            className="product-payment-results"
          />
        ) : (
          <Result
            status="success"
            title={t("Purchase successfully")}
            extra={[
              <div className="product-payment-results-detail" key={"orderInfo"}>
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
                  {t("Price")}: ￥{orderInfo.price}
                </p>
                <p>
                  {t("Redeem code")}: {orderInfo.code}
                </p>
              </div>,
            ]}
            className="product-payment-results"
          />
        )
      ) : (
        <Row justify="center">
          {isMobile && formData ? null : (
            <Col>
              <Row justify="center" style={{ marginTop: "20px" }}>
                <span className="product-payment-member">
                  {t("Purchase subscription", {
                    levelName: chooseLevel.levelName,
                  })}
                </span>
                <span className="product-payment-price">￥{orderPrice}</span>
              </Row>
              <Row>
                <Col>
                  <Form {...formItemLayout} onFinish={onFinish}>
                    <Form.Item
                      label={t("Email")}
                      name="email"
                      rules={[
                        {
                          type: "email",
                          message: t("Please enter correct email"),
                        },
                        {
                          required: true,
                          message: t("Please enter email"),
                        },
                      ]}
                    >
                      <Input
                        placeholder={
                          props.productInfo.productType === 1
                            ? t("Search order with this email")
                            : t("Please enter your account")
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label={t("Password")}
                      rules={[
                        {
                          min: 8,
                          message: t(
                            "Length of password should be longer than 8"
                          ),
                        },
                        {
                          required: true,
                          message: t("Please enter password"),
                        },
                      ]}
                    >
                      <Input
                        placeholder={
                          props.productInfo.productType === 1
                            ? t("Search order with this password")
                            : t("Please enter your account")
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      label={t("Payment")}
                      name="payment"
                      rules={[
                        {
                          required: true,
                          message: t("Please choose your payment"),
                        },
                      ]}
                    >
                      <Radio.Group defaultValue="alipay">
                        <Radio
                          value="alipay"
                          disabled={alipayId && alipayId !== " " ? false : true}
                        >
                          <span className="paypal-text">{t("Alipay")}</span>
                        </Radio>

                        <Radio
                          value="paypal"
                          disabled={paypalId && paypalId !== " " ? false : true}
                        >
                          <span className="paypal-text">PayPal</span>
                        </Radio>
                        <Radio
                          value="balance"
                          disabled={
                            props.productInfo.allowBalance === "yes"
                              ? false
                              : true
                          }
                        >
                          <span className="paypal-text">{t("Balance")}</span>
                        </Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        className="product-payment-next-button"
                        type="primary"
                        htmlType="submit"
                      >
                        {t("Next step")}
                      </Button>
                      <p
                        className="discount-option"
                        onClick={() => {
                          setModalVisible(true);
                        }}
                      >
                        &nbsp;&nbsp;&nbsp;{t("Use discount")}
                      </p>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Col>
          )}
          {formData && formData.payment !== "balance" && (
            <Col>
              {formData.payment === "alipay" ? (
                <div className="product-payment-qrcode-container">
                  <div className="product-payment-qrcode">
                    {paymentUrl ? (
                      <a
                        href={paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <QRCode
                          value={paymentUrl} //value参数为生成二维码的链接
                          size={150} //二维码的宽高尺寸
                          fgColor="#000000" //二维码的颜色
                          className="product-payment-qrcode-image"
                        />
                      </a>
                    ) : (
                      <Spin
                        indicator={antIcon}
                        tip={t("QR code is generating...")}
                        className="product-payment-qrcode-spin"
                      />
                    )}
                  </div>

                  <div className="product-payment-qrcode-text">
                    {isMobile
                      ? t("Long press QR code and open in new tab")
                      : t("Scan with Alipay")}
                  </div>
                  {paymentUrl && count > -1 && (
                    <p className="payment-countdown">
                      {t("Payment coutdown")}:
                      {"0" + Math.floor(count / 60) + ":"}
                      {count % 60 > 9 ? count % 60 : "0" + (count % 60)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="product-payment-paypal">
                  <div id="paypal-button-container"></div>
                </div>
              )}
            </Col>
          )}
        </Row>
      )}
    </div>
  );
};

export default PaymentDialog;
