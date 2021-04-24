import React, { useState, useEffect } from "react";
import { Table, Button, Input, DatePicker, Badge, message } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import $axios from "../../axios/$axios";
import { handleFetchOrder } from "../../redux/actions/form";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";

const dateFormat = "YYYY-MM-DD";
const { Search } = Input;

const OrderPage = (props) => {
  const { t } = useTranslation();

  const [data, setData] = useState(props.order);
  const [loading, setLoading] = useState(true);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundIndex, setRefundIndex] = useState(-1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  useEffect(() => {
    if (props.order) {
      setLoading(false);
      setData(props.order);
    }
  }, [props.order]);
  const filterData = (date = {}) => {
    let filteredData = [];
    props.order.forEach((item) => {
      if (
        item.year === date.year &&
        item.month === date.month &&
        item.day === date.day
      ) {
        filteredData.push(item);
      }
    });
    setData(filteredData);
  };

  const onSelectedRowKeysChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  const handleSearch = (value) => {
    let searchResults = [];
    props.order.forEach((item) => {
      if (
        item.email === value ||
        item.orderId === value ||
        item.code === value
      ) {
        searchResults.push(item);
      }
    });
    setData(searchResults);
  };
  const handleReset = () => {
    setData(props.order);
    let inputBox = document.querySelector(".ant-input");
    inputBox.value = "";
  };
  const onDateChange = (date) => {
    date &&
      filterData({
        year: date._d.getFullYear(),
        month: date._d.getMonth() + 1,
        day: date._d.getDate(),
      });
  };
  const handleRefund = async (orderId, index, order) => {
    setRefundLoading(true);
    setRefundIndex(index);
    $axios
      .post(`/refund/${order.payment}`, {
        orderId,
        uid: order.uid,
        email: order.email,
      })
      .then((res) => {
        setRefundLoading(false);
        message.success(t("Refund successfully"));
        props.handleFetchOrder(props.setting.uid);
        setRefundIndex(-1);
      })
      .catch((err) => {
        setRefundLoading(false);
        setRefundIndex(-1);
        console.log(err);
        message.error(t("Refunding failed"));
      });
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectedRowKeysChange,
  };
  const columns = [
    {
      title: t("Refund"),
      dataIndex: "orderId",
      key: "orderId",
      width: 100,
      render: (text, record, index) => (
        <Button
          type="primary"
          onClick={() => {
            handleRefund(record.orderId, index, record);
          }}
          size="small"
          loading={refundIndex === index && refundLoading}
          disabled={record.paymentStatus !== "paid"}
        >
          {t("Refund")}
        </Button>
      ),
    },
    {
      title: t("Order ID"),
      dataIndex: "orderId",
      key: "orderId",
      width: 180,
    },

    {
      title: t("Subscription name"),
      key: "productName",
      dataIndex: "productName",
      width: 150,
    },
    {
      title: t("Subscription level"),
      key: "levelName",
      dataIndex: "levelName",
      width: 100,
    },
    {
      title: t("Payment status"),
      key: "paymentStatus",
      dataIndex: "paymentStatus",
      width: 120,
      render: (paymentStatus) =>
        paymentStatus === "paid" ? (
          <Badge status="success" text={paymentStatus} />
        ) : paymentStatus === "refunded" ? (
          <Badge status="error" text={paymentStatus} />
        ) : (
          <Badge status="warning" text={paymentStatus} />
        ),
    },
    {
      title: t("Redeem code"),
      key: "code",
      dataIndex: "code",
      width: 220,
    },

    {
      title: t("Status"),
      key: "activation",
      dataIndex: "activation",
      width: 140,
      render: (activation) =>
        activation.length > 0 ? (
          <Badge status="success" text={t("Active")} />
        ) : (
          <Badge status="warning" text={t("Not active")} />
        ),
    },
    {
      title: t("Activition times"),
      key: "activation",
      dataIndex: "activation",
      width: 100,
      render: (text, record, index) => (
        <p style={{ textAlign: "center" }}>
          {record.productType === 1 ? record.activation.length : "1"}
        </p>
      ),
    },
    {
      title: t("Creation date"),
      dataIndex: "date",
      key: "date",
      width: 140,
    },

    {
      title: t("Price"),
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (price) => <span>￥{price}</span>,
    },
    {
      title: t("Payement method"),
      dataIndex: "payment",
      key: "payment",
      width: 100,
      render: (payment) =>
        payment === "alipay" ? (
          <span>{t("Alipay")}</span>
        ) : payment === "paypal" ? (
          <span>PayPal</span>
        ) : (
          <span>{t("Balance")}</span>
        ),
    },
    {
      title: t("Discount code"),
      key: "discount",
      dataIndex: "discount",
      width: 200,
      render: (discount) =>
        discount ? <span>{discount}</span> : <span>{t("Not active")}</span>,
    },
    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
      width: 250,
    },
  ];
  const date = new Date();
  return (
    <div className="shadow-radius">
      <div
        style={
          isMobile
            ? {
                backgroundColor: "white",
                zIndex: 10,
              }
            : {
                backgroundColor: "white",
                margin: "20px 20px 0 20px",
              }
        }
      >
        <Search
          placeholder={t("Query order id, email, redeem code")}
          enterButton={t("Query")}
          style={
            isMobile
              ? {
                  width: 240,
                  margin: "25px 10px 5px 10px",
                  height: "20px",
                  fontSize: "25px",
                }
              : {
                  width: 300,
                  margin: "25px 10px 5px 10px",
                  height: "20px",
                  fontSize: "25px",
                }
          }
          onSearch={(value) => {
            handleSearch(value);
          }}
        />
        <DatePicker
          defaultValue={moment(`${date.toLocaleDateString()}`, dateFormat)}
          format={dateFormat}
          onChange={onDateChange}
          style={{
            width: 240,
            margin: "25px 10px 5px",
          }}
        />
        <Button
          onClick={handleReset}
          style={
            isMobile
              ? {
                  margin: "5px 10px",
                  color: "#40A9FF !important",
                }
              : {
                  margin: "25px 10px",
                  color: "#40A9FF !important",
                }
          }
        >
          {t("Reset")}
        </Button>
      </div>
      <div
        className="order-page-body"
        style={
          isMobile
            ? { backgroundColor: "white", margin: "5px" }
            : { backgroundColor: "white", margin: "0px 20px" }
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.title}
          rowSelection={rowSelection}
          style={{ userSelect: "text" }}
          scroll={{ x: 800 }}
          loading={loading}
        />
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    order: state.form.order,
    setting: state.product.setting,
  };
};
const actionCreator = { handleFetchOrder };
export default connect(mapStateToProps, actionCreator)(OrderPage);
