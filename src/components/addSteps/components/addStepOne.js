import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Radio, InputNumber, Tooltip } from "antd";
import { handleForm } from "../../../redux/actions/form";
import { connect } from "react-redux";
import { restoreFormData } from "../../../utils/productUtil";
import { isMobile } from "react-device-detect";
import _ from "underscore";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const AddStepOne = (props) => {
  const [levels, setLevels] = useState(
    props.formData ? props.formData.memberLevel : 0
  );
  const [onSale, setOnSale] = useState("yes");
  const [allowBalance, setAllowBalance] = useState("yes");
  const [formData, setFormData] = useState(
    props.formData ? props.formData : null
  );
  const [productType, setProductType] = useState(
    props.formData ? props.formData.productType : 1
  );
  const { t } = useTranslation();

  let formRef = React.createRef();
  useEffect(() => {
    let id = document.location.href.split("/").reverse()[0];
    if (!isNaN(parseInt(id))) {
      //解决被调用两次的问题，导致productUitl报错
      formRef.current.setFieldsValue(
        restoreFormData(
          props.allProducts[
            _.findLastIndex(props.allProducts, {
              _id: id,
            })
          ]
        )
      );
      setFormData(
        restoreFormData(
          props.allProducts[
            _.findLastIndex(props.allProducts, {
              _id: id,
            })
          ]
        )
      );
      setLevels(
        props.allProducts[
          _.findLastIndex(props.allProducts, {
            _id: id,
          })
        ].memberLevel
      );
      setProductType(
        props.allProducts[
          _.findLastIndex(props.allProducts, {
            _id: id,
          })
        ].productType
      );
    }
    // eslint-disable-next-line
  }, []);
  const onLevelChange = (value) => {
    setLevels(parseInt(value));
  };

  const onSaleChange = (e) => {
    setOnSale(e.target.value);
  };
  const onAllowBalanceChange = (e) => {
    setAllowBalance(e.target.value);
  };

  const onFinish = (values) => {
    props.handleFormData(values);
    props.handleForm(values);
    props.handleNext();
    setFormData(values);
  };

  const renderLevelDesc = () => {
    let arr = [];
    for (let i = 1; i <= levels; i++) {
      arr.push(i);
    }
    return arr.map((item) => {
      return (
        <div key={item}>
          <Form.Item
            name={`levelName${item}`}
            label={t("Level name", { item })}
            rules={[
              {
                required: true,
                message: t("Please enter level name", { item }),
              },
            ]}
          >
            <Input placeholder={t("Starter, Premium, Team, Enterprise")} />
          </Form.Item>
          <Form.Item label={t("Level price", { item })}>
            <Input.Group compact>
              <Form.Item
                name={[`levelPrice${item}`, `price${item}`]}
                noStyle
                rules={[
                  { type: "number", message: t("Please enter number") },
                  {
                    required: true,
                    message: t("Please enter level price", { item }),
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  step={1}
                  style={{
                    width: "calc(100% - 100px)",
                  }}
                  placeholder={t("Please enter level price", { item })}
                />
              </Form.Item>
              <Form.Item
                name={[`levelPrice${item}`, `unit${item}`]}
                noStyle
                rules={[
                  {
                    required: true,
                    message: t("Please enter level price unit", {
                      level: item,
                    }),
                  },
                ]}
              >
                <Select
                  style={{
                    width: 100,
                  }}
                  placeholder={t("Please choose unit")}
                >
                  <Option value={t("Per month")}>{t("Per month")}</Option>
                  <Option value={t("Per quarter")}>{t("Per quarter")}</Option>
                  <Option value={t("Per year")}>{t("Per year")}</Option>
                  <Option value={t("For life")}>{t("For life")}</Option>
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            name={`levelDesc${item}`}
            label={t("Level description", { item })}
            rules={[
              {
                required: true,
                message: t("Please enter level description"),
              },
            ]}
          >
            <Input.TextArea
              id="desc"
              placeholder={t("Press enter after each description")}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <Form.Item
            label={t("Level limit", { item })}
            name={`levelLimit${item}`}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={1}
              placeholder={t("Unlimited if empty")}
            />
          </Form.Item>
          <Form.Item
            name={`levelNote${item}`}
            label={t("Level remark", { item })}
          >
            <Input.TextArea
              id="note"
              placeholder={t("No remarks if empty")}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
        </div>
      );
    });
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 11 },
    },
  };
  const formItemLayout = {
    labelCol: {
      sm: { span: 8 },
    },
    wrapperCol: {
      sm: { span: 8 },
    },
  };
  return (
    <div className="shadow-radius" style={{ marginTop: "50px" }}>
      <Form
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={formData ? formData : null}
        ref={formRef}
      >
        <Form.Item label={t("Subscription type")} name="productType">
          <Radio.Group>
            <Radio.Button
              value={1}
              onClick={() => {
                setProductType(1);
              }}
            >
              {t("Type 1")}
            </Radio.Button>
            <Radio.Button
              value={2}
              onClick={() => {
                setProductType(2);
              }}
            >
              {t("Type 2")}
            </Radio.Button>
            <Radio.Button
              value={3}
              onClick={() => {
                setProductType(3);
              }}
            >
              {t("Type 3")}
            </Radio.Button>
            {!isMobile && (
              <Tooltip title={t("How to choose subscription type")}>
                <a
                  href="https://www.notion.so/troyeguo/The-difference-of-three-product-types-76a8998eb7da4f95888dfd895d19e9bf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ margin: "0 8px", lineHeight: "20px" }}
                >
                  {t("Need help?")}
                </a>
              </Tooltip>
            )}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t("Subscription name")}
          name="productName"
          rules={[
            {
              required: true,
              message: t("Please enter subscription name"),
            },
          ]}
        >
          <Input placeholder={t("Please enter subscription name")} />
        </Form.Item>
        <Form.Item
          name="productInfo"
          label={t("Subscription introduction")}
          rules={[
            {
              required: true,
              message: t("Please enter subscription introduction"),
            },
          ]}
        >
          <Input.TextArea
            placeholder={t(
              "Letters of subscription introduction should be shorted than 20"
            )}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>

        <Form.Item
          label={t("Level number")}
          name="memberLevel"
          rules={[
            {
              required: true,
              message: t("Please enter level number"),
            },
          ]}
        >
          <Select
            placeholder={t("Please enter level number")}
            onChange={onLevelChange}
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
          </Select>
        </Form.Item>
        {renderLevelDesc()}
        {productType === 2 ? (
          <Form.Item
            label={t("Please enter callback url for order")}
            name="callbackUrl"
            rules={[
              {
                type: "url",
                required: productType === 1 ? false : true,
                message: t("Please enter callback url for order"),
              },
            ]}
          >
            <Input placeholder={t("Callback url for order")} />
          </Form.Item>
        ) : null}
        {productType === 3 ? (
          <Form.Item
            label={t("Pay with balance")}
            name="allowBalance"
            rules={[
              {
                required: true,
                message: t("Allow payment with balance"),
              },
            ]}
          >
            <Radio.Group onChange={onAllowBalanceChange} value={allowBalance}>
              <Radio value="yes">{t("Permitted")}</Radio>
              <Radio value="no">{t("Forbidden")}</Radio>
            </Radio.Group>
          </Form.Item>
        ) : null}
        <Form.Item
          label={t("Whether on sale")}
          name="onSale"
          rules={[
            {
              required: true,
              message: t("Please choose whether to sale this subscription"),
            },
          ]}
        >
          <Radio.Group onChange={onSaleChange} value={onSale}>
            <Radio value="yes">{t("On sale")}</Radio>
            <Radio value="no">{t("Discontinued")}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name={`contact`}
          label={t("Contact information")}
          rules={[
            {
              required: true,
              message: t("Please enter contact information"),
            },
          ]}
        >
          <Input.TextArea
            id="contact"
            placeholder={t("Website, Twitter, Facebook, Email")}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="primary" htmlType="submit">
            {t("Next step")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    formData: state.form.formData,
    allProducts: state.product.allProducts,
  };
};
const actionCreator = {
  handleForm,
};
export default connect(mapStateToProps, actionCreator)(AddStepOne);
