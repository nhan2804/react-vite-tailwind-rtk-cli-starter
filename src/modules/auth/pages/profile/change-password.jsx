import useChangePassword from "@modules/auth/hooks/mutate/useChangePassword";
import { Button, Form, Input } from "antd";
import React from "react";

const ChangePassword = () => {
  const { mutate: changePass, isLoading } = useChangePassword();
  const onFinish = (values) => {
    changePass(values);
  };
  const [form] = Form.useForm();
  return (
    <div className=" h-full ">
      <div className="flex items-center justify-center">
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          labelCol={{
            span: 12,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
              {
                min: 6,
                message: "Mật khẩu ít nhất 6 ký tự",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              {
                min: 6,
                message: "Mật khẩu ít nhất 6 ký tự",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Mật lại khẩu mới"
            name="reNewPassword"
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Password mới không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="flex justify-center">
            <Button loading={isLoading} type="primary" htmlType="submit">
              Đổi mật khẩu
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
