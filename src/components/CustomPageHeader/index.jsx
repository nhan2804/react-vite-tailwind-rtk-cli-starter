import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
const CustomPageHeader = ({ title = "Tiêu đề", extra }) => {
  const nav = useNavigate();
  const onBack = () => {
    nav(-1);
  };
  return (
    <div>
      <div className="text-xl flex space-x-4">
        <div className="cursor-pointer hover:text-blue-500">
          <ArrowLeftOutlined onClick={onBack} />
        </div>
        <div className="font-semibold text-xl">{title}</div>
      </div>
    </div>
  );
};

export default CustomPageHeader;
