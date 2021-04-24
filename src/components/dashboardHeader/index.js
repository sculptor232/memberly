import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import numeral from "numeral";
import "./index.css";
import AreaChart from "../areaChart";
import BarChart from "../barChart";
import { connect } from "react-redux";
import { isMobile } from "react-device-detect";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: isMobile ? 5 : 24,
  },
};
const DashboardHeader = (props) => {
  const { t } = useTranslation();

  const diff = (arr) => {
    let result = [];
    for (let i = 0; i < arr.length - 1; i++) {
      result.push(Math.abs(arr[i + 1] - arr[i]));
    }
    return result;
  };
  const sum = (arr) => {
    let sum = 0;
    arr.forEach((item) => {
      sum += item;
    });
    return sum;
  };
  let saleSum1 = props.salesByPeriod[14] - props.salesByPeriod[7];
  let saleSum2 = props.salesByPeriod[7] - props.salesByPeriod[0];
  return (
    <Row justify="center" gutter={24} type="flex">
      <Col {...topColResponsiveProps}>
        <Card>
          <Statistic title={t("Sales")} value={props.allSales} />
          <Statistic
            title={t("By week")}
            value={parseInt(((saleSum2 - saleSum1) / saleSum1) * 100) || 0}
            valueStyle={
              saleSum2 / saleSum1 > 1
                ? { color: "#cf1322" }
                : { color: "#3f8600" }
            }
            prefix={
              saleSum2 / saleSum1 > 1 ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
            suffix="%"
          />
          <Statistic
            title={t("By day")}
            className="header-day-stats"
            value={
              props.salesByPeriod[13] - props.salesByPeriod[12] === 0
                ? 100
                : parseInt(
                    (props.salesByPeriod[14] +
                      props.salesByPeriod[12] -
                      2 * props.salesByPeriod[13]) /
                      (props.salesByPeriod[13] - props.salesByPeriod[12])
                  ) * 100 || 0
            }
            valueStyle={
              (props.salesByPeriod[14] - props.salesByPeriod[13]) /
                (props.salesByPeriod[13] - props.salesByPeriod[12]) >
              1
                ? { color: "#cf1322" }
                : { color: "#3f8600" }
            }
            prefix={
              (props.salesByPeriod[14] - props.salesByPeriod[13]) /
                (props.salesByPeriod[13] - props.salesByPeriod[12]) >
              1 ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )
            }
            suffix="%"
          />

          <p className="card-footer">
            {t("Today's sales")}{" "}
            {`￥${numeral(
              props.salesByPeriod[props.salesByPeriod.length - 1] -
                (props.salesByPeriod[props.salesByPeriod.length - 2] || 0) || 0
            ).format("0,0")}`}
          </p>
        </Card>
      </Col>
      <Col {...topColResponsiveProps}>
        <Card>
          <Statistic title={t("Visits")} value={props.allVisits} />

          {sum(diff(props.visitsByPeriod)) === 0 ? (
            <div className="header-chart-no-data">
              {t("No visits in the last two weeks")}
              <div className="card-line"></div>
            </div>
          ) : (
            <AreaChart
              visitsByPeriod={diff(props.visitsByPeriod)}
              period={props.period}
            />
          )}

          <p className="card-footer">
            {t("Today's visits")}{" "}
            {`${numeral(
              props.visitsByPeriod[props.visitsByPeriod.length - 1] -
                (props.visitsByPeriod[props.visitsByPeriod.length - 2] || 0) ||
                0
            ).format("0,0")}`}
          </p>
        </Card>
      </Col>

      <Col {...topColResponsiveProps}>
        <Card>
          <Statistic title={t("Orders")} value={props.allOrders} />

          {sum(diff(props.ordersByPeriod)) === 0 ? (
            <div className="header-chart-no-data">
              {t("No orders in the last two weeks")}
              <div className="card-line"></div>
            </div>
          ) : (
            <BarChart
              ordersByPeriod={diff(props.ordersByPeriod)}
              period={props.period}
            />
          )}

          <p className="card-footer">
            {t("Today's orders")}{" "}
            {`${numeral(
              props.ordersByPeriod[props.ordersByPeriod.length - 1] -
                (props.ordersByPeriod[props.ordersByPeriod.length - 2] || 0) ||
                0
            ).format("0,0")}`}
          </p>
        </Card>
      </Col>
      <Col {...topColResponsiveProps}>
        <Card>
          <p style={{ opacity: "0.7" }}>{t("Service status")}</p>
          <p style={{ fontSize: "30px", color: "" }}>
            {props.allProducts.length > 0 ? t("Avilable") : t("Not avilable")}
          </p>
          <p
            style={{
              fontSize: "15px",
              color: "#13C2C2",
              marginTop: "10px",
            }}
          >
            {!props.alipay.appId && !props.paypal.clientId
              ? t("Payment not configured")
              : !props.email.mailPassword
              ? t("Email not configured")
              : t("All set")}
          </p>
          <div className="card-line"></div>
          <p className="card-footer">
            {/* eslint-disable-next-line */}
            <a>{t("Learn more")}</a>
          </p>
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state) => {
  return {
    salesByPeriod: state.periodData.salesByPeriod,
    visitsByPeriod: state.periodData.visitsByPeriod,
    ordersByPeriod: state.periodData.ordersByPeriod,
    allSales: state.periodData.allSales,
    allVisits: state.periodData.allVisits,
    allOrders: state.periodData.allOrders,
    period: state.periodData.period,
    allProducts: state.product.allProducts,
    alipay: state.form.alipay,
    paypal: state.form.paypal,
    email: state.form.email,
    setting: state.product.setting,
  };
};

export default connect(mapStateToProps, null)(DashboardHeader);
