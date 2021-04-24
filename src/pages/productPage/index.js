import React, { useEffect } from "react";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  List,
  Typography,
  Modal,
  message,
  notification,
} from "antd";
import "./index.css";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import $axios from "../../axios/$axios";
import { handleFetchAllProduct } from "../../redux/actions/product";
import { handleForm } from "../../redux/actions/form";
import Logo from "../../components/logo";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";

const { confirm } = Modal;
const { Paragraph } = Typography;
const ProductPage = (props) => {
  const { t } = useTranslation();

  useEffect(() => {
    props.handleForm(null);
    // eslint-disable-next-line
  }, []);

  const showConfirm = (index) => {
    let { allProducts } = props;
    let { handleFetchAllProduct } = props;
    confirm({
      title: t("Do you want to delete this subscription"),
      icon: <ExclamationCircleOutlined />,
      content: t(
        "The purchase link for this subscription will be deleted, but all the history data will be kept"
      ),
      okText: t("Confirm"),
      okType: "danger",
      cancelText: t("Cancel"),
      onOk() {
        return $axios
          .post(`/product/delete`, {
            productId: allProducts[index - 1]._id,
          })
          .then((results) => {
            message.success(t("Delete successfully"));
            handleFetchAllProduct(props.setting.uid);
          })
          .catch((err) => {
            console.log(err);
            message.error(t("Deleting failed"));
          });
      },
      onCancel() {},
    });
  };
  const openNotification = (title, desc) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        size="small"
        onClick={() => {
          props.history.push("/account");
          notification.close(key);
        }}
      >
        {t("Confirm")}
      </Button>
    );
    notification.open({
      message: title,
      description: desc,
      btn,
      duration: null,
      key,
    });
  };
  const handleAddProduct = () => {
    if (!props.alipay.appId && !props.paypal.clientId) {
      openNotification(
        t("You haven't configure any payment method"),
        t("Customer can't purchase your subscription")
      );
      props.history.push("/productAdd");
    } else if (!props.email.mailPassword) {
      openNotification(
        t("You haven't configure any email"),
        t("Customer can't receive order and password-reset email")
      );
      props.history.push("/productAdd");
    } else {
      props.history.push("/productAdd");
    }
  };

  return (
    <div className="product-page-container">
      <div
        className={"cardList"}
        style={isMobile ? { margin: "5px" } : { margin: "20px" }}
      >
        <List
          rowKey="id"
          grid={{
            gutter: 24,
            xl: 3,
            lg: 3,
            md: 2,
            sm: 2,
            xs: 1,
          }}
          dataSource={[{}, ...props.allProducts]}
          renderItem={(item, index) => {
            if (item && item._id) {
              return (
                <List.Item key={item._id}>
                  <Card
                    hoverable
                    className={"card"}
                    actions={[
                      <Link to={`/productAdd/${item._id}`} key="edit">
                        {t("Edit")}
                      </Link>,
                      // eslint-disable-next-line
                      <a
                        key="delete"
                        onClick={() => {
                          showConfirm(index);
                        }}
                      >
                        {t("Delete")}
                      </a>,
                      <Link
                        to={`/product/${props.allProducts[index - 1]._id}`}
                        key="check"
                        target="_blank"
                      >
                        {t("View")}
                      </Link>,
                    ]}
                  >
                    <Card.Meta
                      avatar={
                        <Logo
                          productId={item._id}
                          url={item.logo}
                          uid={item.uid}
                        />
                      }
                      title={<a href="/#">{item.productName}</a>}
                      description={
                        <Paragraph
                          className={"item"}
                          ellipsis={{
                            rows: 3,
                          }}
                        >
                          {item.productInfo}
                        </Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }

            return (
              <List.Item>
                <Button
                  type="dashed"
                  className={"newButton"}
                  style={{ fontSize: "15px", height: "200px" }}
                  onClick={handleAddProduct}
                >
                  <PlusOutlined /> {t("Create subscription")}
                </Button>
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    allProducts: state.product.allProducts,
    alipay: state.form.alipay,
    paypal: state.form.paypal,
    email: state.form.email,
    setting: state.product.setting,
  };
};
const actionCreator = {
  handleFetchAllProduct,
  handleForm,
};
export default connect(mapStateToProps, actionCreator)(withRouter(ProductPage));
