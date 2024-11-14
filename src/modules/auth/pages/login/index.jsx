import React from "react";
import { Button, Form, Input } from "antd";
import useLogin from "@modules/auth/hooks/useLogin";
import { useParams } from "react-router";
const Login = () => {
  const { mutate: login, isLoading } = useLogin();
  const { projectId } = useParams();
  console.log({ projectId });
  const onFinish = (values) => {
    const username = projectId
      ? values?.username + projectId
      : values?.username;
    login({ ...values, username }, {});
  };
  return (
    <div className="text-center">
      <h3>Vui lòng đăng nhập để tiếp tục</h3>
      <div className="flex items-center justify-center h-full ">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <div className="flex justify-center">
            <Button loading={isLoading} type="primary" htmlType="submit">
              Đăng nhập
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Login;
