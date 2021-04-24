import React, { useState } from "react";
import { Card, List, message } from "antd";
import "./index.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import $axios from "../../axios/$axios";
import { isMobile } from "react-device-detect";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const ThemePage = (props) => {
  const [loading, setLoading] = useState(false);
  const [themeIndex, setThemeIndex] = useState(-1);
  const { t } = useTranslation();

  const handleApply = (theme, index) => {
    setLoading(true);
    setThemeIndex(index);
    $axios
      .post(`/setting/update`, {
        ...props.setting,
        themeOption: theme,
      })
      .then(() => {
        setLoading(false);
        setThemeIndex(-1);
        message.success(t("Apply successfully, go to check it out"));
      })
      .catch(() => {
        setLoading(false);
        setThemeIndex(-1);

        message.error(t("Applying failed, retry after a while"));
      });
  };
  const cardList = (
    <List
      rowKey="id"
      // loading={loading}
      grid={{
        gutter: 24,
        xl: 3,
        lg: 3,
        md: 2,
        sm: 2,
        xs: 1,
      }}
      dataSource={[
        {
          id: "default",
          title: t("Default theme"),
          cover: "/assets/theme/default_demo.svg",
          href: "",
        },
        {
          id: "tech",
          title: t("Tech theme"),
          cover: "/assets/theme/tech_demo.svg",
          href: "",
        },
        {
          id: "nostalgic",
          title: t("Nostalgic theme"),
          cover: "/assets/theme/nostalgic_demo.svg",
          href: "",
        },
        {
          id: "blur",
          title: t("Blurry theme"),
          cover: "/assets/theme/blur_demo.svg",
          href: "",
        },
        {
          id: "black_yellow",
          title: t("Yellow-black theme"),
          cover: "/assets/theme/black_yellow_demo.svg",
          href: "",
        },
        {
          id: "blue_white",
          title: t("Blue-white theme"),
          cover: "/assets/theme/blue_white_demo.svg",
          href: "",
        },
        {
          id: "blue_gray",
          title: t("Blue-gray theme"),
          cover: "/assets/theme/blue_gray_demo.svg",
          href: "",
        },

        {
          id: "dark_blue",
          title: t("Dark-blue theme"),
          cover: "/assets/theme/dark_blue_demo.svg",
          href: "",
        },
      ]}
      renderItem={(item, index) => (
        <List.Item>
          <Card
            className={"theme-card"}
            hoverable
            cover={
              <img
                alt={item.title}
                src={item.cover}
                className="theme-card-cover"
              />
            }
            actions={[
              <div
                key="apply"
                onClick={() => {
                  handleApply(item.id, index);
                }}
              >
                {loading && index === themeIndex ? (
                  <LoadingOutlined />
                ) : (
                  <CheckOutlined />
                )}
                &nbsp; {t("Apply theme")}
              </div>,
            ]}
          />
        </List.Item>
      )}
    />
  );

  return (
    <div className="product-page-container">
      <div
        className={"cardList"}
        style={isMobile ? { margin: "5px" } : { margin: "20px" }}
      >
        {cardList}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    setting: state.product.setting,
  };
};
const actionCreator = {};
export default connect(mapStateToProps, actionCreator)(withRouter(ThemePage));
