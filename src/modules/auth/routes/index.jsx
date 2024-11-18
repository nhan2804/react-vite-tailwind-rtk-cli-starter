import LayoutProfile from "@layouts/LayoutProfile";
import { lazy } from "react";
import React from "react";
// import Register from "../pages/register";
// import Login from "../pages/login";
// import Register from "../pages/register";
const LogHomePage = lazy(() => import("@modules/logs/pages"));
const ChangePassword = lazy(() => import("../pages/profile/change-password"));
const ProfileInfo = lazy(() => import("../pages/profile"));
const Login = lazy(() => import("../pages/login"));
const Register = lazy(() => import("../pages/register"));
// const ForgetPassword = lazy(() => import("../pages/forget-password"));

const authRoutes = [
  {
    component: Login,
    path: "/login",
  },
  {
    component: Register,
    path: "/register",
  },
  {
    component: LayoutProfile,
    path: "/profile",
    isPrivate: true,
    exact: true,
    children: [
      {
        isPrivate: true,
        exact: true,
        component: ProfileInfo,
        path: "info",
      },
      {
        isPrivate: true,
        exact: true,
        component: ChangePassword,
        path: "change-password",
      },
      {
        isPrivate: true,
        exact: true,
        component: LogHomePage,
        path: "logs",
      },
    ],
  },
  // {
  //   component: ForgetPassword,
  //   path: "/forget-password",
  //   exact: true,
  // },
];
export default authRoutes;
