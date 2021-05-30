import React from "react";
import { Result, Button } from "antd";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Error404 = (props) => {
  const { t } = useTranslation();

  const goback = () => {
    props.history.push("/productList");
  };
  return (
    <Result
      status="404"
      title="404"
      subTitle={t("Sorry, the page you're visiting is gone")}
      extra={
        <Button type="primary" onClick={goback}>
          {t("Return home")}
        </Button>
      }
    />
  );
};

export default withRouter(Error404);
