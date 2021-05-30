import React from "react";
import "./index.css";
import { useTranslation } from "react-i18next";
import { Modal } from "antd";

const Contact = (props) => {
  const { t } = useTranslation();

  const renderContact = () => {
    return props.productInfo.contact.map((item, index) => {
      return (
        <div className="contact-info" key={index}>
          {item}
        </div>
      );
    });
  };
  console.log(props.showContact);
  return (
    <Modal
      title={t("Contact us")}
      visible={props.showContact}
      onOk={() => {
        props.handleContact(false);
      }}
      onCancel={() => {
        props.handleContact(false);
      }}
      closable={false}
      footer={[]}
    >
      {renderContact()}
    </Modal>
  );
};

export default Contact;
