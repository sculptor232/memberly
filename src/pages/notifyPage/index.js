import React from "react";
import { List, Switch, message } from "antd";
import { connect } from "react-redux";
import $axios from "../../axios/$axios";
import { useTranslation } from "react-i18next";

const NotifyPage = (props) => {
  const { t } = useTranslation();

  const data = [
    {
      title: t("Send order with email"),
      name: "isSendOrderByEmail",
      isChecked: props.setting.isSendOrderByEmail,
    },
    {
      title: t("Send login alert with email"),
      name: "isSendLoginByEmail",
      isChecked: props.setting.isSendLoginByEmail,
    },
    {
      title: t("Send order with Telegram"),
      name: "isSendOrderByTele",
      isChecked: props.setting.isSendOrderByTele,
    },
    {
      title: t("Send login alert with Telegram"),
      name: "isSendLoginByTele",
      isChecked: props.setting.isSendLoginByTele,
    },
  ];

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={data}
        style={{ margin: "20px", marginTop: "0px" }}
        renderItem={(item) => {
          return (
            <List.Item
              actions={[
                // eslint-disable-next-line
                <Switch
                  defaultChecked={item.isChecked}
                  onChange={(checked) => {
                    props.setting[item.name] = checked;
                    $axios
                      .post("/setting/update", props.setting)
                      .then((res) => {
                        message.success(t("Set successfully"));
                      })
                      .catch((error) => {
                        message.warning(error.response.data.message);
                        console.log(error, "error");
                      });
                  }}
                />,
              ]}
            >
              <List.Item.Meta
                title={
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {item.title}
                  </span>
                }
              />
            </List.Item>
          );
        }}
      />
    </>
  );
};
const mapStateToProps = (state) => {
  return { setting: state.product.setting };
};
const actionCreator = {};
export default connect(mapStateToProps, actionCreator)(NotifyPage);
