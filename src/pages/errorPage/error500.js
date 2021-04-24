import React from "react";
import { Button, Result } from "antd";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Error500 = (props) => {
  const { t } = useTranslation();

  const goback = () => {
    props.history.push("/productList");
  };
  return (
    <Result
      status="500"
      title="500"
      subTitle={t("Sorry, Error happens on our server")}
      extra={
        <Button type="primary" onClick={goback}>
          {t("Return home")}
        </Button>
      }
    />
  );
};

export default withRouter(Error500);
