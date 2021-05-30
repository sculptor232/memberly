import React, { useState } from "react";
import { Row, Button, Modal } from "antd";
import { useTranslation } from "react-i18next";
const WelcomePage = (props) => {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const showModal = () => {
    setVisible(true);
  };
  const handleOk = () => {
    props.handleCurrent("collectInfo");
  };

  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <div>
      <img src="/assets/theme/tech.svg" alt="" className="welcome-bg" />
      <Row justify="center" className="welcome-title">
        {t("Welcome to Memberly")}
      </Row>
      <Row justify="center" className="welcome-info">
        {t("Since this is your first time using Memberly")}

        <br />
        {t("We need to collect some infomation")}
      </Row>
      <Row justify="center" className="welcome-button">
        <Button type="primary" onClick={showModal} size="large">
          {t("Okay, let's go")}
        </Button>
      </Row>

      <Modal
        visible={visible}
        title={t("Before Registration")}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            {t("I'll think about it")}
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {t("Continue")}
          </Button>,
        ]}
      >
        <p>
          {t(
            "Memberly is an open-source project to help you run your own subscription service, Everything you do with Memberly should fully abide by the law in your resident country. Don't do anything illegal with Memberly"
          )}
        </p>
      </Modal>
    </div>
  );
};

export default WelcomePage;
