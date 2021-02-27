import React, { useState } from "react";
import { Menu, Button, Descriptions, message, Modal } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PageHeader from "../../components/pageHeader";
import axios from "axios";
import { isMobile } from "react-device-detect";
import { version } from "../../../package.json";
import ChangePassword from "../../components/changePassword";
import ChangeEmail from "../../components/changeEmail";
import PaymentPage from "../paymentPage";
import ThemePage from "../themePage";
import MailPage from "../mailPage";

const { Item } = Menu;

const menuMap = {
  info: "账户信息",
  changeEmail: "更改邮箱",
  changePassword: "更改密码",
  payment: "支付设置",
  theme: "主题设置",
  email: "邮箱设置",
  // notification: "New Message Notification"
};
const SettingPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState("info");
  const info = () => {
    Modal.info({
      title: "检查到新版本",
      content: (
        <div>
          <p>快去 Github 更新吧！</p>
        </div>
      ),
      onOk: () => {
        setLoading(false);
      },
    });
  };

  const checkUpdate = async () => {
    setLoading(true);

    const res = await axios.get(
      "https://api.github.com/repos/troyeguo/coodo-pay/releases/latest"
    );
    if (res.status === 200) {
      if (parseInt(res.data.name) > parseInt(version)) {
        info();
      } else {
        message.success("暂无版本更新");
        setLoading(false);
      }
    } else {
      message.error("检查更新失败");
      setLoading(false);
    }
  };
  const getMenu = () => {
    return Object.keys(menuMap).map((item) => (
      <Item key={item}>{menuMap[item]}</Item>
    ));
  };
  const selectKey = (key) => {
    setSelectedKey(key);
  };
  const renderAccountInfo = () => {
    return (
      <Descriptions title="账户信息" style={{ padding: 20 }}>
        <Descriptions.Item label="邮箱">{props.user.email}</Descriptions.Item>
        <Descriptions.Item label="注册日期">
          {props.user.date}
        </Descriptions.Item>
        <Descriptions.Item label="当前版本">
          {props.setting.version}
        </Descriptions.Item>
        <Descriptions.Item label="检查更新">
          <Button type="primary" onClick={checkUpdate} loading={loading}>
            检查更新
          </Button>
          <a
            href="https://github.com/troyeguo/coodo-pay"
            target="_blank"
            rel="noopener noreferrer"
          >
            &nbsp;&nbsp;&nbsp;更新地址
          </a>
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const renderChildren = () => {
    switch (selectedKey) {
      case "info":
        return renderAccountInfo();
      case "changeEmail":
        return <ChangeEmail />;
      case "changePassword":
        return <ChangePassword />;
      case "payment":
        return <PaymentPage />;
      case "theme":
        return <ThemePage />;
      case "email":
        return <MailPage />;
      default:
        break;
    }

    return null;
  };
  return (
    <div className="product-page-container" style={{ position: "relative" }}>
      <PageHeader
        title="系统设置"
        desc="在这里设置账户，支付方式，邮箱，主题"
      />
      <div
        className="main"
        style={
          isMobile
            ? { margin: "5px", height: "100%", position: "relative" }
            : { margin: "20px", height: "100%", position: "relative" }
        }
      >
        <div className={"leftMenu"} style={isMobile ? { width: "100%" } : {}}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={({ key }) => selectKey(key)}
            className="payment-page"
            style={{
              marginTop: "10px",
            }}
          >
            {getMenu()}
          </Menu>
        </div>
        <div className="right" style={{ margin: 10 }}>
          {renderChildren()}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.form.user,
    setting: state.product.setting,
  };
};
const actionCreator = {};
export default connect(mapStateToProps, actionCreator)(withRouter(SettingPage));
