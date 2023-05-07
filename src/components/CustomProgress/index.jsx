import { Progress } from "antd";
import React from "react";

const CustomProgress = ({ isLoading }) => {
  return <>{isLoading && <Progress percent={100} status="active" />}</>;
};

export default CustomProgress;
