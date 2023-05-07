import Checkbox from "antd/es/checkbox";
import DatePicker from "antd/es/date-picker";
import Input from "antd/es/input";
import Radio from "antd/es/radio";
import Select from "antd/es/select";
import Form from "antd/es/form";
import InputNumber from "antd/es/input-number";
import React from "react";
import { FormComponentProps } from "antd/lib/form/Form";
import SingleImageUpload from "@components/SingleImageUpload";
import { Rate, Switch } from "antd";

const { Option } = Select;
export interface StructFormItem extends FormComponentProps {
  type:
    | "TEXT"
    | "RATE"
    | "LONG_TEXT"
    | "SWITCH"
    | "NUMBER"
    | "checkbox"
    | "radio"
    | "LIST"
    | "image"
    | "DATE"
    | "DATE_TIME"
    | "single-checkbox";
  label: string;
  placeholder: string;
  options: { name: string; value: string }[] | string[];
  name: string;
  value: string;
  rules: any;
  // validate: {
  //   required:
  // };
}

const WrapFormItem = (
  {
    type,
    options,
    placeholder,
    label,
    name,
    value,
    rules,
    ...rest
  }: StructFormItem,
  ref
) => {
  let component = null;
  switch (type) {
    case "TEXT":
      component = (
        <Input ref={ref} size="small" {...rest} placeholder={placeholder} />
      );
      break;
    case "LONG_TEXT":
      component = (
        <Input.TextArea ref={ref} {...rest} placeholder={placeholder} />
      );
      break;
    case "NUMBER":
      component = <InputNumber ref={ref} {...rest} placeholder={placeholder} />;
      break;
    case "checkbox":
      // let plainOptions;
      // if (options && !options?.[0]?.name) {
      //   plainOptions = options?.map((e) => {
      //     return { value: e, label: e };
      //   });
      // }else{
      //   plainOptions = options?.map((e) => {
      //     return { value: e?.value, label: e?.name };
      //   });
      // }
      let plainOptions = options?.map((e) => {
        return { value: e?.value, label: e?.name };
      });

      component = <Checkbox.Group ref={ref} options={plainOptions} />;
      break;
    case "radio":
      component = (
        <Radio.Group ref={ref} {...rest}>
          {options?.map((e, i) => {
            return (
              <Radio {...rest} key={i} value={e?.value}>
                {e?.name}
              </Radio>
            );
          })}
        </Radio.Group>
      );
      break;
    case "DATE":
      component = <DatePicker ref={ref} {...rest} format={"DD/MM/YYYY"} />;
      break;
    case "DATE_TIME":
      component = (
        <DatePicker ref={ref} format="YYYY-MM-DD HH:mm:ss" showTime {...rest} />
      );
      break;
    case "LIST":
      component = (
        <Select
          ref={ref}
          dropdownStyle={{ zIndex: 20000 }}
          {...rest}
          placeholder={placeholder}
        >
          {options?.map((e, i) => {
            return (
              // <Option {...rest} key={i} value={e?.value}>
              //   {e?.name}
              // </Option>
              <Option {...rest} key={i} value={e}>
                {e}
              </Option>
            );
          })}
        </Select>
      );
      break;
    case "image":
      component = (
        <SingleImageUpload {...rest} name={`${name}`} label={label} />
      );
      break;
    case "single-checkbox":
      component = <Checkbox ref={ref} {...rest}></Checkbox>;
      break;
    case "SWITCH":
      component = <Switch ref={ref} {...rest} />;

      break;
    case "RATE":
      component = <Rate ref={ref} {...rest} />;

      break;
    default:
      break;
  }
  // return (
  //   <Form.Item rules={[]} name={name} label={label}>
  //     {component}
  //   </Form.Item>
  // );
  return type !== "image" ? (
    <Form.Item
      rules={rules || []}
      name={name}
      label={label}
      valuePropName={
        type === "single-checkbox" || type === "SWITCH" ? "checked" : undefined
      }
    >
      {component}
    </Form.Item>
  ) : (
    component
  );
};

export default React.memo(React.forwardRef(WrapFormItem));
