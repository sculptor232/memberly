import React, { useState, useEffect } from "react";
import { Table, Button, Input, DatePicker } from "antd";
import { connect } from "react-redux";
import { isMobile } from "react-device-detect";
import "./index.css";
import { useTranslation } from "react-i18next";

const dateFormat = "YYYY-MM-DD";
const { Search } = Input;
const CustomerPage = (props) => {
  const [data, setData] = useState(props.customer);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (props.customer) {
      setLoading(false);
      setData(props.customer);
    }
  }, [props.customer]);
  const filterData = (date = {}) => {
    let filteredData = [];
    props.customer.forEach((item) => {
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
    props.customer.forEach((item) => {
      if (item.email === value || item.nickname === value) {
        searchResults.push(item);
      }
    });
    setData(searchResults);
  };
  const handleReset = () => {
    setData(props.customer);
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

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectedRowKeysChange,
  };
  const columns = [
    {
      title: t("Customer ID"),
      key: "_id",
      dataIndex: "_id",
      width: 250,
    },
    {
      title: t("Nickname"),
      key: "nickname",
      dataIndex: "nickname",
      width: 150,
    },
    {
      title: t("Email"),
      key: "email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: t("Register date"),
      dataIndex: "date",
      key: "date",
      width: 140,
    },
    {
      title: t("Balance"),
      dataIndex: "balance",
      key: "balance",
      width: 100,
      render: (price) => <span>￥{price || 0}</span>,
    },
  ];
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
          placeholder={t("Search nickname or email")}
          enterButton={t("Search")}
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
          rowKey={(record) => record}
          rowSelection={rowSelection}
          style={{ userSelect: "text" }}
          scroll={{ x: 800 }}
          loading={loading}
          expandable={{
            expandedRowRender: (record) =>
              record.orders.map((item) => {
                return (
                  <p style={{ textAlign: "center" }}>
                    {t("Purchase date")}: {item.date}&nbsp;{" "}
                    {t("Subscription name")}: {item.productName}
                    &nbsp; {t("Subscription level")}: {item.levelName}
                    &nbsp; {t("Price")}: ￥{item.price}
                    &nbsp; {t("Order ID")}: {item.orderId}
                    &nbsp;
                  </p>
                );
              }),
          }}
        />
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    customer: state.form.customer,
  };
};
const actionCreator = {};
export default connect(mapStateToProps, actionCreator)(CustomerPage);
