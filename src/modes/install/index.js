import React, { useState } from "react";
import WelcomePage from "./components/wecomePage";
import CollectInfo from "./components/collectInfo";
import "./index.css";
import { connect } from "react-redux";
import { Result, Button } from "antd";
import { useTranslation } from "react-i18next";

const Install = (props) => {
  const [currentStep, setCurrentStep] = useState("welcome");
  const handleCurrent = (step) => {
    setCurrentStep(step);
  };
  const { setting } = props;
  const { t } = useTranslation();

  return (
    <div>
      {setting ? (
        currentStep === "welcome" ? (
          <WelcomePage handleCurrent={handleCurrent} />
        ) : (
          <CollectInfo handleCurrent={handleCurrent} />
        )
      ) : (
        <Result
          status="warning"
          title={t("Wrong database configuration")}
          extra={
            <Button type="primary" key="console">
              <a
                href="https://www.yuque.com/docs/share/5d0fd4df-7de6-424c-a389-6e187e764966?#%20《Coodo%20Pay%20搭建教程（宝塔面板篇）》"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("I need help")}
              </a>
            </Button>
          }
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    setting: state.product.setting,
  };
};
const actionCreator = {};

export default connect(mapStateToProps, actionCreator)(Install);
