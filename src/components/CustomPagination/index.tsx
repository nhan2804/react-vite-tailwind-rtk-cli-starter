import { Pagination, PaginationProps } from "antd";
import React, { ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
interface Props {
  current: number;
  defaultCurrent: number;
  defaultPageSize: number;
  pageSize: number;
  total: number;
  pageSizeOptions: string[];
  showQuickJumper: boolean | { goButton: ReactNode };
  disabled: boolean;
  showSizeChanger: boolean;
  showTitle: boolean;
  showTotal: (total: number, range: [number, number]) => ReactNode;
  size: "default" | "small";
  onChange: (page: number, pageSize: number) => void;
  onShowSizeChange: (current: number, size: number) => PaginationProps;
}
const CustomPagination = (props: Props) => {
  const { t } = useTranslation();
  return (
    <Pagination
      showTotal={(total, range) =>
        t("pagination.show_total", {
          field1: range[0],
          field2: range[1],
          field3: total,
        })
      }
      showSizeChanger
      showQuickJumper
      {...props}
    />
  );
};

const usePropsTablePagination = () => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(20)
  const pagi = {
    showTotal: (total: number, range: [number, number]) =>
      t("pagination.show_total", {
        field1: range[0],
        field2: range[1],
        field3: total,
      }),
    showSizeChanger: true,
    showQuickJumper: true,
    position: ["bottomLeft"],
    onShowSizeChange: (current: number, size: number) => {
     setPageSize(size)
    },
    pageSize: pageSize,
  };
  return { paginateTableOption: pagi };
};

export default CustomPagination;
export { usePropsTablePagination };
