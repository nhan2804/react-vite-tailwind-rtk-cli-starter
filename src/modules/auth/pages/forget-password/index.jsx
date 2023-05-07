// import { Form, Input, Button, Checkbox, Tooltip, Alert } from "antd";
// import React from "react";
// import {
//   InfoCircleOutlined,
//   UserOutlined,
//   LockOutlined,
// } from "@ant-design/icons";
// import useLogin from "@modules/auth/hooks/useLogin";
// import useResetPassword from "@modules/auth/hooks/useResetPassword";
// const ForgetPassword = () => {
//   const { mutate: reset, isLoading, data } = useResetPassword();
//   const onFinish = (values) => {
//     reset(values);
//   };

//   const onFinishFailed = (errorInfo) => {};

//   return (
//     <div className="flex items-center h-full">
//       <Form
//         name="basic"
//         initialValues={{
//           remember: true,
//         }}
//         className="max-w-sm !m-auto !p-2 w-full"
//         layout="vertical"
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//         autoComplete="off"
//       >
//         <div className="text-2xl font-bold text-center">Quên mật khẩu</div>
//         <Form.Item
//           rules={[
//             {
//               type: "email",
//               message: "Email không chính xác",
//             },
//             {
//               required: true,
//               message: "Bạn cần nhập email",
//             },
//           ]}
//           label="Email"
//           name="email"
//         >
//           <Input
//             placeholder="Email của bạn"
//             prefix={<UserOutlined className="site-form-item-icon" />}
//             suffix={
//               <Tooltip title="Extra information">
//                 <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
//               </Tooltip>
//             }
//           />
//         </Form.Item>

//         <Form.Item>
//           <div className="flex justify-center">
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="!font-semibold"
//               loading={isLoading}
//             >
//               Quên mật khẩu
//             </Button>
//           </div>
//         </Form.Item>
//         {data && <Alert message={data?.message} type="success" />}
//       </Form>
//     </div>
//   );
// };
// export default ForgetPassword;
