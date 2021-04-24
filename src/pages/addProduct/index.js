import React, { useState, useEffect } from "react";
import { Card, Steps, Row, message } from "antd";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import AddSteps from "../../components/addSteps";
import $axios from "../../axios/$axios";
import "./index.css";
import { connect } from "react-redux";
import _ from "underscore";
import {
  handleFetchAllProduct,
  handleProductInfo,
} from "../../redux/actions/product";
import { parseFormData } from "../../utils/productUtil";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";

const { Step } = Steps;
const AddProduct = (props) => {
  const [current, setCurrent] = useState(0);
  const [mode, setMode] = useState("add");
  const [productId, setProductId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    let id = document.location.href.split("/").reverse()[0];
    if (!isNaN(parseInt(id))) {
      setMode("edit");
      setProductId(
        props.allProducts[
          _.findLastIndex(props.allProducts, {
            _id: id,
          })
        ]._id
      );
    }
    // eslint-disable-next-line
  }, []);
  const next = () => {
    if (mode === "add") {
      //添加订阅时走这条分支
      if (current === 0) {
        setCurrent(current + 1);
      } else {
        $axios
          .post("/product/create", {
            ...parseFormData(props.formData),
            uid: props.setting.uid,
          })
          .then((res) => {
            props.handleProductInfo(res.data);
            setCurrent(current + 1);
          })
          .catch((err) => {
            message.error(t("Adding subscription failed"));
          });
      }
    } else {
      //编辑订阅时走这条分支
      if (current === 0) {
        setCurrent(current + 1);
      } else {
        $axios
          .post(`/product/update`, {
            ...parseFormData(props.formData),
            uid: props.setting.uid,
            productId,
          })
          .then((res) => {
            props.handleProductInfo(res.data);
            setCurrent(current + 1);
          })
          .catch((err) => {
            message.error(t("Adding subscription failed"));
          });
      }
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  return (
    <div className="product-add-page">
      <Link to="/productList">
        <span
          className="product-add-return"
          onClick={() => {
            props.handleFetchAllProduct(props.setting.uid);
          }}
        >
          <ArrowLeftOutlined />
          &nbsp; {t("Return")}
        </span>
      </Link>

      <div className="product-add-header">
        <p style={{ fontSize: "20px", fontWeight: "500", marginTop: "30px" }}>
          {mode === "add" ? t("Add") : t("Edit")}
        </p>
        <p style={{ lineHeight: "50px", fontSize: "15px" }}>
          {t("Edit or add your subscriptions")}
        </p>
        <div className={"extraImg"}>
          <img
            alt="这是一个标题"
            src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
          />
        </div>
      </div>
      <Card
        bordered={false}
        style={isMobile ? { margin: "5px" } : { margin: "20px" }}
      >
        <Row justify="center">
          <Steps current={current}>
            <Step key="1" title={t("Edit")}></Step>
            <Step key="2" title={t("Confirm")}></Step>
            <Step key="3" title={t("Complete")}></Step>
          </Steps>
        </Row>
        <AddSteps currentStep={current} next={next} prev={prev} />
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    formData: state.form.formData,
    setting: state.product.setting,
    allProducts: state.product.allProducts,
  };
};
const actionCreator = {
  handleFetchAllProduct,
  handleProductInfo,
};
export default connect(mapStateToProps, actionCreator)(AddProduct);
