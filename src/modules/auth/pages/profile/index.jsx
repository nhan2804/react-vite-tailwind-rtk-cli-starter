import SingleImageUpload from "@components/SingleImageUpload";
import useUpdateProfile from "@modules/auth/hooks/mutate/useUpdateProfile";
import useGetProfile from "@modules/auth/hooks/useGetProfile";
import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";

const ProfileInfo = () => {
  const { mutate: updateProfile, isLoading } = useUpdateProfile();
  const onFinish = (values) => {
    updateProfile(values);
  };
  const [form] = Form.useForm();
  const { data: profile } = useGetProfile();
  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile);
    }
  }, [form, profile]);
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
          <SingleImageUpload name="avatar" label="Avatar" />
          <Form.Item label="Họ và tên" name="fullName">
            <Input />
          </Form.Item>

          <div className="flex justify-center">
            <Button loading={isLoading} type="primary" htmlType="submit">
              Cập nhật thông tin
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ProfileInfo;
