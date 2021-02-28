import React, { useState } from "react";
import { List, Modal, message } from "antd";
import { handleVerifyDialog } from "../../redux/actions/form";
import { connect } from "react-redux";
import $axios from "../../axios/$axios";

const DevelopPage = (props) => {
  const data = [
    {
      title: "Coodo Pay Token",
      subtitle: "Token 生成成功，请妥善保管",
      description: "您的 Coodo Pay 开发者凭证",
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
            <a
              key="list-loadmore-edit"
              onClick={async () => {
                try {
                  const { data } = await $axios.post("/user/token");
                  Modal.success({
                    title: item.subtitle,
                    content: <p style={{ userSelect: "text" }}>{data}</p>,
                  });
                } catch (error) {
                  message.error("创建 token 失败");
                }
              }}
            >
              生成
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
export default connect(mapStateToProps, actionCreator)(DevelopPage);
