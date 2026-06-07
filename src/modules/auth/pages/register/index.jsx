import React from "react";
import { useAppSelector } from "@hooks/reduxHook";
import useGoogleLogin from "@modules/auth/hooks/useGoogleLogin";

import useRegister from "@modules/auth/hooks/useRegister";

import { Button, Form, Input } from "antd";
const Register = () => {
  const { mutate: registerAccount, isLoading } = useRegister();

  const onFinish = (values) => {
    registerAccount(values);
  };
  const { mutate: loginWithGoogle } = useGoogleLogin();

  const isAuth = useAppSelector((state) => state?.auth?.isAuth);
  const responseGoogle = (res) => {
    console.log(res);
    loginWithGoogle({ id_token: res?.tokenId });
  };
  // useRedirect([{ condition: isAuth, to: "/" }]);

  const [form] = Form.useForm();

  return (
    <div className="flex items-center justify-center h-full">
      <Form
        form={form}
        className="max-w-lg p-12 space-y-10 bg-white rounded-lg shadow-lg"
        onFinish={onFinish}
      >
        <div className="text-4xl font-bold">Đăng ký</div>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-1/6 h-0.5 bg-gray-500"></div>
            <div className="font-semibold text-gray-600 font-actor">
              Sign up with
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="flex-auto p-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg shadow">
              Sign up with facebook
            </div>
          </div>
        </div>
        <div className="space-y-6">
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
          {/* <div className="font-medium">
            <label>
              <input type="checkbox" className="rounded" /> I aggree with policy
            </label>
          </div> */}
        </div>

        <div className="grid place-content-center">
          <Button htmlType="submit">Đăng ký</Button>
        </div>
      </Form>
    </div>
  );
};
export default Register;
