import React from "react";
import { useAppSelector } from "./reduxHook";

const useRole = () => {
  const role = useAppSelector((s) => s?.auth?.user?.type);

  return {
    isSupperAdmin: role === "SUPER_ADMIN",
    isUser: role === "QC",
    isAdmin: role === "ADMIN",
  };
};

export default useRole;
