import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import useCreateLog from "../hooks/mutate/useCreateLog";
import useCreateBulkLog from "../hooks/mutate/useCreateBulkLog";
import useUpdateLog from "../hooks/mutate/useUpdateLog";
import useDeleteLog from "../hooks/mutate/useDeleteLog";
import useDeleteBulkLog from "../hooks/mutate/useDeleteBulkLog";
import useGetLog from "../hooks/query/useGetLog";
import LogFormCreate from "../components/Form";

import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import usePagination from "@hooks/usePagination";
import useSearchQuery from "@hooks/useSearchQuery";
import { useParams } from "react-router";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  DatePicker,
} from "antd";
import CustomModal from "@components/CustomModal";
import ImportFileModal from "@components/ImportFileModal";
import CustomPageHeader from "@components/CustomPageHeader";
import ExportExcelCommon from "@components/ExportExcel";
import ShowLogs from "../components/Show";
const LogHomePage = () => {
  const {} = useParams();
  const [formSearch] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery();

  const [selectedRecord, setSelected] = useState();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const refForm = useRef();
  const pagination = usePagination({ reset: Object.values(search) });
  const query = {
    ...search,
    page: pagination.current,
    perPage: pagination.pageSize,

    startTime: search?.range?.[0]?.valueOf(),
    endTime: search?.range?.[1]?.valueOf(),
    range: undefined,
    ...pagination?.sort,
  };

  const { mutate: createLogFn, isLoading: isLoadingCreate } = useCreateLog();
  const { data: Logs, isLoading: loadingFetch } = useGetLog(query);
  const { mutate: updateLogFn, isLoading: isLoadingUpdate } = useUpdateLog();
  const { mutateAsync: deleteLogFn, isLoading: isLoadingDelete } =
    useDeleteLog();
  const { mutateAsync: deleteBulkLogFn, isLoading: isLoadingBulkDelete } =
    useDeleteBulkLog();
  const { mutate: createBulkLogFn, isLoading: isLoadingCreateBulk } =
    useCreateBulkLog();

  const onDelete = (id) => {
    return deleteLogFn(id);
  };
  const onUpdate = (values) => {
    updateLogFn(
      { _id: selectedRecord?._id, formData: values },
      {
        onSuccess: () => {
          refForm?.current?.close();
        },
      }
    );
  };
  const onCreate = (value, c) => {
    createLogFn(value, {
      onSuccess: c,
    });
  };

  const onCreateBulk = (data, c) => {
    const raw = data?.map((e) => ({
      name: e?.[0]?.trim(),
    }));
    // console.log({ raw });
    createBulkLogFn(raw, {
      onSuccess: c,
    });
  };
  const onDeleteBulk = () => {
    return deleteBulkLogFn(selectedRowKeys, {
      onSuccess: () => {
        setSelectedRowKeys([]);
      },
    });
  };
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "App",
      dataIndex: "app",
      key: "app",
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
    },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      render: (t, r) => {
        if (!t) return "";
        return (
          <Button
            onClick={() => {
              refForm.current?.open();
              setSelected(r);
            }}
            type="primary"
          >
            Xem
          </Button>
        );
      },
    },

    {
      sortOrder: pagination?.tableSortOrder?.createdAt?.order,
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY H:m:s"),
      sorter: {
        multiple: 1,
      },
    },
  ];

  return (
    <div className="p-2">
      <CustomPageHeader title="Log" />

      <div className="flex justify-end mb-1">
        <Form
          onFinish={setSearch}
          form={formSearch}
          layout="inline"
          initialValues={initSearchValues}
          autoComplete="off"
        >
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 [&>*]:!m-0 !space-x-reverse form-no-margin">
            <Form.Item name="name">
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item name="status">
              <Select allowClear placeholder="Status">
                {[].map((e) => {
                  return (
                    <Select.Option value={e?.value}>{e?.label}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item name="range">
              <DatePicker.RangePicker />
            </Form.Item>

            <Form.Item>
              <Button
                disabled={loadingFetch}
                icon={<SearchOutlined />}
                type="primary"
                htmlType="submit"
              >
                Tìm
              </Button>
              <ExportExcelCommon
                type="log"
                columns={columns}
                dataSource={Logs?.data}
              ></ExportExcelCommon>
            </Form.Item>
          </div>
        </Form>
      </div>

      <Table
        rowKey={"_id"}
        onChange={pagination.onChangeTable}
        pagination={{ ...pagination, total: Logs?.paginate?.count }}
        loading={loadingFetch}
        columns={columns}
        dataSource={Logs?.data || []}
      ></Table>

      <CustomModal
        width={800}
        footer={false}
        ref={refForm}
        noButton={true}
        title={"Xem log"}
      >
        {() => <ShowLogs log={selectedRecord} />}
      </CustomModal>
    </div>
  );
};

export default LogHomePage;
