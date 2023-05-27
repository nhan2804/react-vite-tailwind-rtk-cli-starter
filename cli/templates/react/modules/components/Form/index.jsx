
import { Button, Form, Input } from "antd";
import React, { useState } from "react";

const __name__(sentenceCase)FormCreate = ({
  loading,
  onFinish,
  initialValues,
  okText="Tạo"

}) => {
  const [form] = Form.useForm();
 
  const _onFinish =(values)=>{
    onFinish(values)
  }
  const onFinishFailed = (errorInfo) => {
    console.log("Form onFinishFailed:", errorInfo);
  };
  return (
    <Form
      disabled={loading}
      form={form}
      
      labelCol={{ span: 6 }}
      // wrapperCol={{ span: 16 }}
      initialValues={initialValues}
      autoComplete="off"
      onFinish={_onFinish}
      onFinishFailed={onFinishFailed}
    >
    <Form.Item name={"name"}>
      <Input/>
    </Form.Item> 
    <Form.Item>
      <Button
        type="default"
        htmlType="submit"
        loading={loading}
      >
        Update
      </Button>
    </Form.Item>
    </Form>
  );
};

export default __name__(sentenceCase)FormCreate;
