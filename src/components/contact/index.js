import React from "react";
import "./index.css";
import { useTranslation } from "react-i18next";

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
  return (
    <div className="contact-container">
      <div className="contact-talk">{t("Contact us")}</div>
      {renderContact()}
      <img src="/assets/contact-header.png" alt="" className="contact-header" />
      <img src="/assets/contact-footer.png" alt="" className="contact-footer" />
    </div>
  );
};

export default Contact;
