import React from "react";
import { List, Modal, message } from "antd";
import { handleVerifyDialog } from "../../redux/actions/form";
import { connect } from "react-redux";
import $axios from "../../axios/$axios";
import { useTranslation } from "react-i18next";

const DevelopPage = (props) => {
  const { t } = useTranslation();

  const data = [
    {
      id: 1,
      title: "Memberly Token",
      subtitle: t(
        "Token has been successfully generated, please keep it in safe place"
      ),
      option: t("Generate"),
      description: t("Your memberly development token"),
    },
    {
      id: 2,
      title: "Memberly uid",
      subtitle: t("This is your developer id, please keep it in safe place"),
      option: t("Check"),
      description: t("Your memberly developer id"),
    },
  ];
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      style={{ margin: "20px", marginTop: "0px" }}
      renderItem={(item) => (
        // eslint-disable-next-line
        <List.Item
          actions={[
            // eslint-disable-next-line
            <a
              key="list-loadmore-edit"
              onClick={async () => {
                if (item.id === 1) {
                  try {
                    const { data } = await $axios.post("/user/createToken", {
                      uid: props.user._id,
                    });
                    Modal.success({
                      title: item.subtitle,
                      content: <p style={{ userSelect: "text" }}>{data}</p>,
                    });
                  } catch (error) {
                    message.error(t("Generating token failed"));
                  }
                } else {
                  Modal.success({
                    title: item.subtitle,
                    content: (
                      <p style={{ userSelect: "text" }}>{props.user._id}</p>
                    ),
                  });
                }
              }}
            >
              {item.option}
            </a>,
          ]}
        >
          <List.Item.Meta
            title={
              // eslint-disable-next-line
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
