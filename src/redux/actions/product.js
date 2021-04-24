import $axios from "../../axios/$axios";
import { message, Modal } from "antd";
import i18n from "i18next";
export const handleProductInfo = (data) => {
  return {
    type: "HANLDE_PRODUCT_INFO",
    payload: data,
  };
};
export const handleAllProducts = (data) => {
  return {
    type: "HANLDE_ALL_PRODUCTS",
    payload: data,
  };
};
export const handleSetting = (data) => {
  return {
    type: "HANLDE_SETTING",
    payload: data,
  };
};
export const handleFetchProductInfo = (productId, uid) => {
  return async (dispatch) => {
    $axios
      .post(`/product/fetch`, { productId, uid })
      .then((res) => {
        let productInfo = res.data;
        dispatch(handleProductInfo(productInfo));
      })
      .catch(() => {
        dispatch(handleProductInfo(null));
        message.error(i18n.t("Subscription not exist"));
      });
  };
};
export const handleFetchAllProduct = (uid) => {
  return async (dispatch) => {
    $axios
      .post(`/product/all`, { uid })
      .then((res) => {
        let allProducts = res.data || [];
        dispatch(handleAllProducts(allProducts));
      })
      .catch((error) => {
        if (error.response) {
          const status = error.response.status;
          if (!status) {
            message.error(i18n.t("Fetching data error"));
            return;
          }
          if (status === 403) {
            Modal.warning({
              title: i18n.t("Login credential outdated"),
              content: i18n.t("Please retry"),
            });
          } else {
            message.error(i18n.t("Fetching Subscription error"));
          }
        } else {
          message.error(i18n.t("Fetching data out of time"));
        }
      });
  };
};
export const handleFetchSetting = (uid) => {
  return async (dispatch) => {
    let metadata = await $axios.post(`/setting/fetch`, { uid });
    let setting = metadata.data || null;
    dispatch(handleSetting(setting));
  };
};
