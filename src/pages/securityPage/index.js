import React, { useState } from "react";
import { List } from "antd";
import { handleVerifyDialog } from "../../redux/actions/form";
import { connect } from "react-redux";
import SecurtyModal from "../../components/securtyModal";

const SecurityPage = (props) => {
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const data = [
    {
      title: "修改邮箱",
      label: "新邮箱",
      name: "email",
      placeholder: "请输入邮箱",
      description: props.user.email,
    },
    {
      title: "修改密码",
      label: "新密码",
      name: "password",
      placeholder: "请输入密码",
      description: "已设置",
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
                修改
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
