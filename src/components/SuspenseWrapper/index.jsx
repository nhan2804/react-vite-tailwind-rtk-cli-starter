import { Spin } from "antd";
import React, { Suspense } from "react";

const SuspenseWrapper = ({ children }) => {
  return <Suspense fallback={<Spin spinning></Spin>}>{children}</Suspense>;
};

export default SuspenseWrapper;
