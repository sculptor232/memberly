import React, { useState } from "react";
import { List } from "antd";
import { handleVerifyDialog } from "../../redux/actions/form";
import { connect } from "react-redux";
import GeneralModal from "../../components/GeneralModal";
import { useTranslation } from "react-i18next";

const GeneralPage = (props) => {
  const { t } = useTranslation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState(false);
  const data = [
    {
      title: "Telegram bot token",
      label: "Telegram bot token",
      name: "telegramToken",
      placeholder: t("Please enter Telegram bot token"),
      description: props.user.telegramToken,
      target: "/user/updateSetting",
    },
    {
      title: "Telegram user id",
      label: "Telegram user id",
      name: "telegramId",
      placeholder: t("Please enter Telegram user id"),
      description: props.user.telegramId,
      target: "/user/updateSetting",
    },
    {
      title: "SMMS Api Key",
      label: "SMMS Api Key",
      name: "smmsKey",
      target: "/user/updateSetting",
      placeholder: t("Please enter SMMS token"),
      description: props.user.smmsKey,
    },
  ];
  return (
    <>
      <GeneralModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        {...item}
        user={props.user}
      />
      <List
        itemLayout="horizontal"
        dataSource={data}
        style={{ margin: "20px", marginTop: "0px" }}
        renderItem={(item) => (
          <List.Item
            actions={[
              // eslint-disable-next-line
              <a
                key="list-loadmore-edit"
                onClick={() => {
                  setItem(item);
                  setModalVisible(true);
                }}
              >
                {t("Set")}
              </a>,
            ]}
          >
            <List.Item.Meta
              title={
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {item.title}
                </span>
              }
              description={
                <p style={{ userSelect: "text" }}>
                  {item.description || t("Empty")}
                </p>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};
const mapStateToProps = (state) => {
  return { user: state.form.user };
};
const actionCreator = {
  handleVerifyDialog,
};
export default connect(mapStateToProps, actionCreator)(GeneralPage);
