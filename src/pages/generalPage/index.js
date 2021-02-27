import React, { useState } from "react";
import { List } from "antd";
import { handleVerifyDialog } from "../../redux/actions/form";
import { connect } from "react-redux";

const SecurityPage = (props) => {
  const data = [
    {
      title: "Coodo Pay Token",
      label: " ",
      name: " ",
      placeholder: " ",
      description: "您的 Coodo Pay 开发者凭证",
    },
    {
      title: "Telegram Api Key",
      label: "Telegram Api Key",
      name: "telegram",
      placeholder: "请输入Telegram Api Key",
      description: "您的 Telegram 开发者凭证",
    },
  ];
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      style={{ margin: "20px", marginTop: "0px" }}
      renderItem={(item) => (
        <List.Item
          actions={[
            <a key="list-loadmore-edit" onClick={() => {}}>
              设置
            </a>,
          ]}
        >
          <List.Item.Meta
            title={
              <a style={{ fontSize: "16px", fontWeight: "bold" }}>
                {item.title}
              </a>
            }
            description={<p>{item.description}</p>}
          />
        </List.Item>
      )}
    />
  );
};
const mapStateToProps = (state) => {
  return { user: state.form.user };
};
const actionCreator = {
  handleVerifyDialog,
};
export default connect(mapStateToProps, actionCreator)(SecurityPage);
