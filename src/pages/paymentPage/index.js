import React from "react";
import { Tabs } from "antd";
import { connect } from "react-redux";
import PaymentMethod from "../../components/paymentMethod";
import "./index.css";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;

const PaymentPage = (props) => {
  const { t } = useTranslation();

  return (
    <div className="product-page-container">
      <div style={{ width: "100%" }}>
        <Tabs defaultActiveKey="1" centered={true} onChange={() => {}}>
          <TabPane tab={t("Alipay")} key="1">
            <PaymentMethod
              formData={props.alipay}
              mode="alipay"
              name={t("Alipay")}
              title={t("Configure Alipay")}
            />
          </TabPane>
          <TabPane tab="Paypal" key="2">
            <PaymentMethod
              formData={props.paypal}
              mode="paypal"
              name="PayPal"
              title={t("Configure Paypal")}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    alipay: state.form.alipay,
    paypal: state.form.paypal,
  };
};
const actionCreator = {
  // handleFetchForm
};
export default connect(mapStateToProps, actionCreator)(PaymentPage);
