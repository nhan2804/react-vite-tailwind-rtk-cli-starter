import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import useCreateProject from "../hooks/mutate/useCreateProject";
import useCreateBulkProject from "../hooks/mutate/useCreateBulkProject";
import useUpdateProject from "../hooks/mutate/useUpdateProject";
import useDeleteProject from "../hooks/mutate/useDeleteProject";
import useDeleteBulkProject from "../hooks/mutate/useDeleteBulkProject";
import useGetProject from "../hooks/query/useGetProject";
import ProjectFormCreate from "../components/Form";

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
const ProjectHomePage = () => {
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

  const { mutate: createProjectFn, isLoading: isLoadingCreate } =
    useCreateProject();
  const { data: Projects, isLoading: loadingFetch } = useGetProject(query);
  const { mutate: updateProjectFn, isLoading: isLoadingUpdate } =
    useUpdateProject();
  const { mutateAsync: deleteProjectFn, isLoading: isLoadingDelete } =
    useDeleteProject();
  const { mutateAsync: deleteBulkProjectFn, isLoading: isLoadingBulkDelete } =
    useDeleteBulkProject();
  const { mutate: createBulkProjectFn, isLoading: isLoadingCreateBulk } =
    useCreateBulkProject();

  const onDelete = (id) => {
    return deleteProjectFn(id);
  };
  const onUpdate = (values) => {
    updateProjectFn(
      { _id: selectedRecord?._id, formData: values },
      {
        onSuccess: () => {
          refForm?.current?.close();
        },
      }
    );
  };
  const onCreate = (value, c) => {
    createProjectFn(value, {
      onSuccess: c,
    });
  };

  const onCreateBulk = (data, c) => {
    const raw = data?.map((e) => ({
      name: e?.[0]?.trim(),
    }));
    // console.log({ raw });
    createBulkProjectFn(raw, {
      onSuccess: c,
    });
  };
  const onDeleteBulk = () => {
    return deleteBulkProjectFn(selectedRowKeys, {
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
      sortOrder: pagination?.tableSortOrder?.createdAt?.order,
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY H:m:s"),
      sorter: {
        multiple: 1,
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (txt, record) => (
        <div className="flex gap-x-1">
          <Popconfirm
            placement="topLeft"
            title={
              "Bạn có chắc muốn xóa record này, điều này không thể hoàn tác?"
            }
            onConfirm={async () => {
              await onDelete(record._id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="primary" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelected(record);
              refForm?.current?.open();
            }}
            type="primary"
          >
            Chỉnh sửa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-2">
      <CustomPageHeader title="Project" />
      <div className="flex justify-end">
        <div className="mb-2 flex space-x-2">
          {hasSelected && (
            <Popconfirm
              title="Xóa các record này, sẽ không thể hoàn tác được!"
              onConfirm={onDeleteBulk}
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Xóa nhiều
              </Button>
            </Popconfirm>
          )}
          <ImportFileModal
            loading={isLoadingCreateBulk}
            title={`Tạo nhiều project`}
            onSubmit={onCreateBulk}
          />
          <CustomModal
            footer={false}
            button={({ open }) => (
              <Button onClick={open} icon={<PlusOutlined />} type="primary">
                Tạo mới
              </Button>
            )}
            title={"Tạo project"}
          >
            {({ close }) => (
              <ProjectFormCreate
                okText={"Tạo"}
                onFinish={(v) => onCreate(v, close)}
                loading={isLoadingCreate}
              />
            )}
          </CustomModal>
        </div>
      </div>
      <div className="flex justify-end mt-1">
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
            {/* 
            <Form.Item name="status">
              <Select allowClear placeholder="Status">
                {[].map((e) => {
                  return (
                    <Select.Option value={e?.value}>{e?.label}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item> */}

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
            </Form.Item>
            <ExportExcelCommon
              type="project"
              columns={columns}
              dataSource={Projects?.data}
            ></ExportExcelCommon>
          </div>
        </Form>
      </div>

      <Table
        rowSelection={rowSelection}
        rowKey={"_id"}
        onChange={pagination.onChangeTable}
        pagination={{ ...pagination, total: Projects?.paginate?.count }}
        loading={loadingFetch}
        columns={columns}
        dataSource={Projects?.data || []}
      ></Table>

      <CustomModal
        footer={false}
        ref={refForm}
        noButton={true}
        title={"Sửa project"}
      >
        {() => (
          <ProjectFormCreate
            okText="Lưu thay đổi"
            initialValues={selectedRecord}
            onFinish={onUpdate}
            loading={isLoadingUpdate}
          />
        )}
      </CustomModal>
    </div>
  );
};

export default ProjectHomePage;
