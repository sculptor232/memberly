import React, { useState } from "react";
import { Button, Descriptions, message, Modal } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { version } from "../../../package.json";
import axios from "axios";

const AboutPage = (props) => {
  const [loading, setLoading] = useState(false);

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
  return (
    <Descriptions title="账户信息" style={{ padding: 20 }}>
      <Descriptions.Item label="邮箱">{props.user.email}</Descriptions.Item>
      <Descriptions.Item label="注册日期">{props.user.date}</Descriptions.Item>
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
const mapStateToProps = (state) => {
  return {
    user: state.form.user,
    setting: state.product.setting,
  };
};
const actionCreator = {};
export default connect(mapStateToProps, actionCreator)(withRouter(AboutPage));
