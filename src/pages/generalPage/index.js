import React, { useState } from "react";
import { List } from "antd";
import { handleVerifyDialog } from "../../redux/actions/form";
import { connect } from "react-redux";
import GeneralModal from "../../components/GeneralModal";

const GeneralPage = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState(false);
  const data = [
    {
      title: "Telegram bot token",
      label: "Telegram bot token",
      name: "telegramToken",
      placeholder: "请输入Telegram bot token",
      description: "您的 Telegram bot 凭证",
      target: "/user/telegram_token",
    },
    {
      title: "Telegram user id",
      label: "Telegram user id",
      name: "telegramId",
      placeholder: "请输入Telegram user id",
      description: "您的 Telegram 用户id",
      target: "/user/telegram_id",
    },
    {
      title: "smms 图床 Api Key",
      label: "smms 图床 Api Key",
      name: "smmsKey",
      target: "/user/smms",
      placeholder: "请输入 smms 图床 Api Key",
      description: "您的 smms 图床的开发者凭证",
    },
  ];
  return (
    <>
      <GeneralModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        {...item}
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
                设置
              </a>,
            ]}
          >
            <List.Item.Meta
              title={
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {item.title}
                </span>
              }
              description={<p>{item.description}</p>}
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
