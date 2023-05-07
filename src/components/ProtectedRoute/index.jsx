import React, { memo } from "react";
import { shallowEqual } from "react-redux";
import { Navigate } from "react-router";
import { useAppSelector } from "@hooks/reduxHook";

const ProtectedRoute = ({ children, isPrivate, accessRole, match }) => {
  const auth = useAppSelector((state) => state.auth.isAuth, shallowEqual);
  const role = useAppSelector((state) => state.auth.role, shallowEqual);

  if (!isPrivate) return children;
  if (!auth) return <Navigate to={"/login"} />;
  if (!accessRole) return children;
  if (!accessRole.includes(role)) return <Navigate to={"/"} />;
  // match &&
  //   match.some(({ condition, to, cb }) => {
  //     // console.log(condition, to);
  //     if (condition) {
  //       cb?.();
  //       return <Navigate to={"/" || to} />;
  //     }
  //     return condition;
  //   });
  return children;
};

export default memo(ProtectedRoute);
