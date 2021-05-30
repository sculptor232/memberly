import React, { useState, useEffect } from "react";
import { Table, Button, Input, DatePicker, Badge, message } from "antd";
import { connect } from "react-redux";
import $axios from "../../axios/$axios";
import { handleFetchDiscount } from "../../redux/actions/form";
import { isMobile } from "react-device-detect";
import CreateDiscount from "../../components/createDiscount";
import { useTranslation } from "react-i18next";

const dateFormat = "YYYY-MM-DD";
const { Search } = Input;

const DiscountPage = (props) => {
  const { t } = useTranslation();

  const [data, setData] = useState(props.discount);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [title, setTile] = useState(t("Create"));
  const [editDiscount, setEditDiscount] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isShowCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (props.discount) {
      setLoading(false);
      setData(props.discount);
    }
  }, [props.discount]);
  const filterData = (date = {}) => {
    let filteredData = [];
    props.discount.forEach((item) => {
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
    props.discount.forEach((item) => {
      if (item.code === value) {
        searchResults.push(item);
      }
    });
    setData(searchResults);
  };
  const handleReset = () => {
    setData(props.discount);
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

  const handleDelete = async (code, index, discount) => {
    setDeleteLoading(true);
    setDeleteIndex(index);
    $axios
      .post(`/discount/delete/${discount._id}`, { uid: props.setting.uid })
      .then((res) => {
        setDeleteLoading(false);
        message.success(t("Deleting successfully"));
        props.handleFetchDiscount(props.setting.uid);
        setDeleteIndex(-1);
      })
      .catch((err) => {
        setDeleteLoading(false);
        setDeleteIndex(-1);
        message.error(t("Deleting failed"));
      });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectedRowKeysChange,
  };
  const columns = [
    {
      title: t("Edit"),
      dataIndex: "code",
      key: "code",
      width: 80,
      render: (text, record, index) => (
        <Button
          onClick={() => {
            setTile(t("Edit"));
            setEditDiscount(record);
            setShowCreate(true);
          }}
          size="small"
        >
          {t("Edit")}
        </Button>
      ),
    },
    {
      title: t("Delete"),
      dataIndex: "code",
      key: "code",
      width: 80,
      render: (text, record, index) => (
        <Button
          type="primary"
          onClick={() => {
            handleDelete(record.code, index, record);
          }}
          size="small"
          loading={deleteIndex === index && deleteLoading}
        >
          {t("Delete")}
        </Button>
      ),
    },
    {
      title: t("Discount"),
      key: "code",
      dataIndex: "code",
      width: 200,
    },
    {
      title: t("Subscription name"),
      key: "productName",
      dataIndex: "productName",
      width: 160,
      render: (productName) => (
        <p>{productName === "all" ? t("All subscriptions") : productName}</p>
      ),
    },
    {
      title: t("Subscription level"),
      key: "levelName",
      dataIndex: "levelName",
      width: 160,
      render: (levelName) => (
        <p>{levelName === "all" ? t("All levels") : levelName}</p>
      ),
    },
    {
      title: t("Status"),
      key: "activation",
      dataIndex: "activation",
      width: 160,
      render: (activation) =>
        activation.length > 0 ? (
          <Badge status="success" text={t("Active")} />
        ) : (
          <Badge status="warning" text={t("Not active")} />
        ),
    },
    {
      title: t("Activiting times"),
      key: "activation",
      dataIndex: "activation",
      width: 160,
      render: (activation) => (
        <p style={{ textAlign: "center" }}>{activation.length}</p>
      ),
    },
    {
      title: t("Remaining times"),
      key: "number",
      dataIndex: "number",
      width: 160,
      render: (number) => <p style={{ textAlign: "center" }}>{number}</p>,
    },
    {
      title: t("Creation date"),
      dataIndex: "time",
      key: "time",
      width: 140,
      render: (time) => new Date(parseInt(time)).toLocaleDateString(),
    },
    {
      title: t("Expiration date"),
      dataIndex: "validUntil",
      key: "validUntil",
      width: 140,
      render: (validUntil) => new Date(validUntil).toLocaleDateString(),
    },
    {
      title: t("Discount code"),
      dataIndex: "amount",
      key: "amount",
      width: 160,
      render: (text, record, index) => (
        <span>
          {record.amount}
          {record.amountType === "price" ? "￥" : "%"}
        </span>
      ),
    },
    {
      title: t("Discount type"),
      dataIndex: "discountType",
      key: "discountType",
      width: 160,
      render: (discountType) =>
        discountType === "one_time" ? (
          <span>{t("One time")}</span>
        ) : (
          <span>{t("Reusable")}</span>
        ),
    },
  ];
  return (
    <div className="shadow-radius">
      {isShowCreate && (
        <CreateDiscount
          isShowCreate={isShowCreate}
          setShowCreate={setShowCreate}
          title={title}
          discountInfo={editDiscount}
          setEditDiscount={setEditDiscount}
        />
      )}

      <div
        style={
          isMobile
            ? {
                backgroundColor: "white",
                height: "170px",
                margin: "5px",
                zIndex: 10,
              }
            : {
                backgroundColor: "white",
                margin: "20px 20px 0 20px",
              }
        }
      >
        <Search
          placeholder={t("Search discount")}
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
        <Button
          onClick={() => {
            setShowCreate(true);
            setTile(t("Create"));
          }}
          type="primary"
          style={
            isMobile
              ? {
                  margin: "5px 10px",
                }
              : {
                  margin: "25px 20px",
                }
          }
        >
          {t("Create discount")}
        </Button>
      </div>
      <div
        className="discount-page-body"
        style={
          isMobile
            ? { backgroundColor: "white", margin: "5px" }
            : { backgroundColor: "white", margin: "0px 20px" }
        }
      >
        <Table
          columns={columns}
          dataSource={data && [...data].reverse()}
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
                    &nbsp; {t("Subscription level")}: {item.levelName}&nbsp;{" "}
                    {t("Price")}: ￥{item.price}
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
    discount: state.form.discount,
    setting: state.product.setting,
  };
};
const actionCreator = { handleFetchDiscount };
export default connect(mapStateToProps, actionCreator)(DiscountPage);
