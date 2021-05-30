import React, { useState } from "react";
import { List } from "antd";
import { handleVerifyDialog } from "../../redux/actions/form";
import { connect } from "react-redux";
import SecurtyModal from "../../components/securtyModal";
import { useTranslation } from "react-i18next";

const SecurityPage = (props) => {
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const { t } = useTranslation();

  const data = [
    {
      title: t("Change email"),
      label: t("New email"),
      name: "email",
      placeholder: t("Enter new email"),
      description: props.user.email,
    },
    {
      title: t("Change password"),
      label: t("New password"),
      name: "password",
      placeholder: t("Enter new password"),
      description: "******",
    },
  ];
  return (
    <>
      <SecurtyModal
        title={title}
        name={name}
        label={label}
        placeholder={placeholder}
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
                  setLabel(item.label);
                  setTitle(item.title);
                  setName(item.name);
                  setPlaceholder(item.placeholder);
                  setTimeout(() => {
                    props.handleVerifyDialog(true);
                  }, 100);
                }}
              >
                {t("Edit")}
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
export default connect(mapStateToProps, actionCreator)(SecurityPage);
