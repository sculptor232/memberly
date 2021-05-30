import React from "react";
import { Descriptions, Row, Button } from "antd";
import { parseFormData } from "../../../utils/productUtil";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";

const AddStepTwo = (props) => {
  const { formData } = props;
  const { t } = useTranslation();

  const renderContact = (contact) => {
    return contact.split("\n").map((item, index) => {
      return <div key={index}>{item}</div>;
    });
  };
  const renderLevelTable = (levels, data) => {
    const {
      levelName,
      levelPrice,
      levelDesc,
      levelLimit,
      levelNote,
    } = parseFormData(data, null);
    let arr = [];
    for (let i = 1; i <= levels; i++) {
      arr.push(i);
    }
    const renderLevelDesc = (descArr) => {
      return descArr.map((item, index) => {
        return <div key={index}>{item}</div>;
      });
    };
    return arr.map((item) => {
      return (
        <Descriptions.Item
          label={t("Level plan", { item })}
          span={3}
          key={item}
        >
          {t("Level name", { item })}: {levelName[item - 1]}
          <br />
          {t("Level price", { item })}:
          {`${levelPrice[item - 1].price}/${levelPrice[item - 1].unit}`}
          <br />
          {t("Level description", { item })}:
          <br />
          {renderLevelDesc(levelDesc[item - 1])}
          <br />
          {t("Level limit", { item })}: {levelLimit[item - 1]}
          <br />
          {t("Level remark", { item })}: {levelNote[item - 1]}
          <br />
        </Descriptions.Item>
      );
    });
  };
  return (
    <div
      className="add-step-two"
      style={isMobile ? { padding: "5px" } : { padding: "50px 150px" }}
    >
      <Descriptions
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label={t("Subscription name")}>
          {formData.productName}
        </Descriptions.Item>
        <Descriptions.Item label={t("Subscription introduction")} span={2}>
          {formData.productInfo}
        </Descriptions.Item>
        {renderLevelTable(formData.memberLevel, formData)}
        {formData.productType === 2 ? (
          <Descriptions.Item label={t("Callback url for order")} span={4}>
            {formData.callbackUrl}
          </Descriptions.Item>
        ) : null}
        {formData.productType === 3 ? (
          <Descriptions.Item label={t("Pay with balance")} span={4}>
            {formData.allowBalance === "yes" ? t("Permitted") : t("Forbidden")}
          </Descriptions.Item>
        ) : null}
        <Descriptions.Item label={t("Whether on sale")}></Descriptions.Item>
        <Descriptions.Item label={t("Contact information")}>
          {renderContact(formData.contact)}
        </Descriptions.Item>
      </Descriptions>
      <Row justify="center" style={{ marginTop: "40px" }}>
        <Button onClick={props.handlePrev} style={{ marginRight: "30px" }}>
          {t("Last step")}
        </Button>
        <Button type="primary" onClick={props.handleNext}>
          {t("Submit")}
        </Button>
      </Row>
    </div>
  );
};

export default AddStepTwo;
