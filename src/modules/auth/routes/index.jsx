import { lazy } from "react";
import React from "react";
// import Login from "../pages/login";
// import Register from "../pages/register";
const Login = lazy(() => import("../pages/login"));
// const Register = lazy(() => import("../pages/register"));
// const ForgetPassword = lazy(() => import("../pages/forget-password"));

const authRoutes = [
  {
    component: Login,
    path: "/login",
  },
  // {
  //   component: Register,
  //   path: "/register",
  // },
  // {
  //   component: ForgetPassword,
  //   path: "/forget-password",
  //   exact: true,
  // },
];
export default authRoutes;
