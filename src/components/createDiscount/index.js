import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  message,
  Select,
  Form,
  Input,
  Radio,
  Cascader,
  DatePicker,
  InputNumber,
} from "antd";
import { connect } from "react-redux";
import { handleFetchDiscount } from "../../redux/actions/form";
import $axios from "../../axios/$axios";
import moment from "moment";
import { useTranslation } from "react-i18next";

const copy = require("copy-text-to-clipboard");
const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const tailLayout = {
  wrapperCol: {
    xs: { span: 16, offset: 0 },
    sm: { span: 16, offset: 10 },
  },
};
const CreateDiscount = (props) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("one_time");
  const [codes, setCodes] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!props.title) return;
    setType(
      props.title === t("Edit") ? props.discountInfo.discountType : "one_time"
    );
    // eslint-disable-next-line
  }, [props.title]);
  const handleCancel = () => {
    props.setShowCreate(false);
  };
  const onFinish = async (values) => {
    setLoading(true);
    if (props.title === t("Create") && values.discountType === "reusable") {
      let codeArr = [];
      for (let item in props.allDiscount) {
        codeArr.push(item.code);
      }
      if (codeArr.indexOf(values.code) > -1) {
        setLoading(false);
        message.warn(t("This discount has been used"));
        return;
      }
    }
    // return;

    $axios
      .post(
        props.title === t("Edit")
          ? `/discount/update/${props.discountInfo._id}`
          : values.discountType === "one_time"
          ? "/discount/one_time"
          : "/discount/reusable",
        {
          ...values,
          productName: values.product[0],
          levelName: values.product[0] === "all" ? "all" : values.product[1],
          validUntil: values.validUntil
            ? values.validUntil._d.getTime()
            : 99999999999999,
          code:
            props.title === t("Edit")
              ? props.discountInfo.code
              : values.code
              ? values.code
              : Math.random().toString(36).substr(4, 8).toUpperCase() +
                Math.random().toString(36).substr(4, 8).toUpperCase(),
          number: values.number ? values.number : 9999,
          uid: props.setting.uid,
        }
      )
      .then((res) => {
        if (values.discountType === "one_time" && Array.isArray(res.data)) {
          props.handleFetchDiscount(props.setting.uid);
          let codeArray = [];
          for (let i = 0; i < res.data.length; i++) {
            codeArray.push(res.data[i].code + "\n");
          }

          setCodes(codeArray.join(""));
        } else {
          props.handleFetchDiscount(props.setting.uid);
          setCodes(res.data.code);
        }
        message.success(props.title + t("Successfully"));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error, "error");
        message.error(t("Editing failed"));
        setLoading(false);
      });
  };
  if (codes) {
    return (
      <Modal
        visible={props.isShowCreate}
        title={t("Create Discount")}
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
        style={{ width: "200px" }}
        afterClose={() => {
          setCodes(null);
        }}
      >
        <Input.TextArea rows={8} value={codes} />

        <Button
          type="primary"
          onClick={() => {
            copy(codes);
            message.success(t("Copy successfully"));
            setCodes(null);
            props.setShowCreate(false);
          }}
          style={{ marginTop: 15 }}
          block
        >
          {t("Copy")}
        </Button>
      </Modal>
    );
  }
  return (
    <Modal
      visible={props.isShowCreate}
      title={props.title + t("discount")}
      // onOk={handleOk}
      onCancel={handleCancel}
      footer={[]}
      afterClose={() => {
        setCodes(null);
      }}
    >
      <Form
        {...layout}
        onFinish={onFinish}
        initialValues={
          props.title === t("Edit")
            ? {
                ...props.discountInfo,
                validUntil: moment(props.discountInfo.validUntil),
                product: [
                  props.discountInfo.productName,
                  props.discountInfo.levelName,
                ],
              }
            : {}
        }
      >
        <Form.Item
          label={t("Discount type")}
          name="discountType"
          rules={[
            {
              required: true,
              message: t("Please choose discount type"),
            },
          ]}
        >
          <Radio.Group disabled={props.title === t("Edit")}>
            <Radio.Button
              value="one_time"
              onClick={() => {
                setType("one_time");
              }}
            >
              {t("One time")}
            </Radio.Button>
            <Radio.Button
              value="reusable"
              onClick={() => {
                setType("reusable");
              }}
            >
              {t("Reusable")}
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label={t("Applicable range")}
          name="product"
          rules={[
            {
              required: true,
              message: t("Please choose applicable range"),
            },
          ]}
        >
          <Cascader
            options={[
              { value: "all", label: t("All subscriptions") },
              ...props.allProducts.map((item) => {
                return {
                  value: item.productName,
                  label: item.productName,
                  children: [
                    { value: "all", label: t("All levels") },
                    ...item.levelName.map((item) => {
                      return {
                        value: item,
                        label: item,
                      };
                    }),
                  ],
                };
              }),
            ]}
          />
        </Form.Item>
        <Form.Item label={t("Discount amount")}>
          <Input.Group compact>
            <Form.Item
              name="amountType"
              noStyle
              rules={[
                { required: true, message: t("Please choose discount type") },
              ]}
            >
              <Select placeholder={t("Discount type")}>
                <Option value="price">{t("Deduct from price")}</Option>
                <Option value="percentage">{t("Percentage of price")}</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="amount"
              rules={[
                {
                  required: true,
                  message: t("Please enter discount amount"),
                },
              ]}
              noStyle
            >
              <InputNumber />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label={
            type === "reusable" ? t("Reusable times") : t("Discount number")
          }
          min={1}
          step={1}
          name="number"
          rules={[
            {
              required: type === "reusable" ? false : true,
              message: t("Please enter discount number"),
            },
          ]}
        >
          <InputNumber
            placeholder={type === "reusable" ? t("Unlimited if empty") : ""}
            style={{ width: "100%" }}
            disabled={
              props.title === t("Edit") &&
              props.discountInfo.discountType === "one_time"
            }
          />
        </Form.Item>
        {type === "reusable" ? (
          <Form.Item label={t("Customize discount code")} name="code">
            <Input placeholder={t("Generated by Memberly if empty")} />
          </Form.Item>
        ) : null}

        <Form.Item label={t("Expiration date")} name="validUntil">
          <DatePicker placeholder={t("No expiration if empty")} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t("Submit")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const mapStateToProps = (state) => {
  return {
    allProducts: state.product.allProducts,
    allDiscount: state.form.allDiscount,
    setting: state.product.setting,
  };
};
const actionCreator = { handleFetchDiscount };
export default connect(mapStateToProps, actionCreator)(CreateDiscount);
