import React from "react";
import { Descriptions } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AboutPage = (props) => {
  const { t } = useTranslation();

  return (
    <Descriptions title={t("Account Info")} style={{ padding: 20 }}>
      <Descriptions.Item label={t("Email")}>
        {props.user.email}
      </Descriptions.Item>
      <Descriptions.Item label={t("Register date")}>
        {props.user.date}
      </Descriptions.Item>
      <Descriptions.Item label={t("Github Repo")}>
        <a
          href="https://github.com/troyeguo/memberly"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </Descriptions.Item>
    </Descriptions>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.form.user,
    setting: state.product.setting,
  };
};
const actionCreator = {};
export default connect(mapStateToProps, actionCreator)(withRouter(AboutPage));
