import React, { useMemo } from "react";
import { Button, Form, Input } from "antd";
import useLogin from "@modules/auth/hooks/useLogin";
import { useNavigate, useParams } from "react-router";
import useGetInfoGeoIp from "@modules/auth/hooks/useGetInfoGeoIp";

const Login = () => {
  const { mutate: login, isLoading } = useLogin();
  const { projectId } = useParams();
  const { data: geoInfo } = useGetInfoGeoIp();

  const rsGeoInfo = useMemo(
    () => ({
      city: geoInfo?.city,
      country: geoInfo?.country,
      continent: geoInfo?.continent,
      country_code: geoInfo?.country_code,
      country_flag: geoInfo?.country_flag,
      timezone_gmt: geoInfo?.timezone_gmt,
      isp: geoInfo?.isp,
      ip: geoInfo?.ip,
    }),
    [geoInfo]
  );

  const onFinish = (values) => {
    const username = projectId ? values.username + projectId : values.username;

    login({
      ...values,
      username,
      geoInfo: rsGeoInfo,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/vi/d/dd/Vietnam_People%27s_Army_insignia.png"
            alt="Quân đội nhân dân Việt Nam"
            className="w-auto h-40"
          />
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-semibold mb-6">
          ĐĂNG NHẬP HỆ THỐNG
        </h2>

        {/* Form */}
        <Form
          layout="vertical"
          name="login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button loading={isLoading} type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
