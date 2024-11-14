import CustomDrawer from "@components/CustomDrawer";
import { Button } from "antd";
import React, { lazy } from "react";

import { FileExcelOutlined } from "@ant-design/icons";
import SuspenseWrapper from "@components/SuspenseWrapper";
const ExportExcelLoader = lazy(() => import("./loader"));

const ExportExcelCommon = (props) => {
  return (
    <CustomDrawer
      title={"Xuất ra Excel"}
      footer={false}
      button={({ open }) => (
        <Button icon={<FileExcelOutlined />} onClick={open} type="primary">
          Xuất Excel
        </Button>
      )}
    >
      {() => (
        <SuspenseWrapper>
          <ExportExcelLoader {...props}></ExportExcelLoader>
        </SuspenseWrapper>
      )}
    </CustomDrawer>
  );
};

export default ExportExcelCommon;
