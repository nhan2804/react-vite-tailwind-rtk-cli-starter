import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import useCreateTicket from "../hooks/mutate/useCreateTicket";
import useCreateBulkTicket from "../hooks/mutate/useCreateBulkTicket";
import useUpdateTicket from "../hooks/mutate/useUpdateTicket";
import useDeleteTicket from "../hooks/mutate/useDeleteTicket";
import useDeleteBulkTicket from "../hooks/mutate/useDeleteBulkTicket";
import useGetTicket from "../hooks/query/useGetTicket";
import TicketFormCreate from "../components/Form";

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

const TicketHomePage = () => {
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

  const { mutate: createTicketFn, isLoading: isLoadingCreate } =
    useCreateTicket();
  const { data: tickets, isLoading: loadingFetch } = useGetTicket(query);
  const { mutate: updateTicketFn, isLoading: isLoadingUpdate } =
    useUpdateTicket();
  const { mutateAsync: deleteTicketFn, isLoading: isLoadingDelete } =
    useDeleteTicket();
  const { mutateAsync: deleteBulkTicketFn, isLoading: isLoadingBulkDelete } =
    useDeleteBulkTicket();
  const { mutate: createBulkTicketFn, isLoading: isLoadingCreateBulk } =
    useCreateBulkTicket();

  const onDelete = (id) => {
    return deleteTicketFn(id);
  };
  const onUpdate = (values) => {
    updateTicketFn(
      { _id: selectedRecord?._id, formData: values },
      {
        onSuccess: () => {
          refForm?.current?.close();
        },
      }
    );
  };
  const onCreate = (value, c) => {
    createTicketFn(value, {
      onSuccess: c,
    });
  };

  const onCreateBulk = (data, c) => {
    const raw = data?.map((e) => ({
      name: e?.[0]?.trim(),
    }));
    // console.log({ raw });
    createBulkTicketFn(raw, {
      onSuccess: c,
    });
  };
  const onDeleteBulk = () => {
    return deleteBulkTicketFn(selectedRowKeys, {
      onSuccess: () => {
        setSelectedRowKeys([]);
      },
    });
  };
  const columns = [
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Author",
      dataIndex: "authorId",
      key: "authorId",
    },
    {
      title: "Ref Tracking",
      dataIndex: "refId",
      key: "refId",
    },
    {
      title: "Ghim",
      dataIndex: "pinned",
      key: "pinned",
    },
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
    <div>
      <h3>Ticket</h3>
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
            title={`Tạo nhiều ticket`}
            onSubmit={onCreateBulk}
          />
          <CustomModal
            footer={false}
            button={({ open }) => (
              <Button onClick={open} icon={<PlusOutlined />} type="primary">
                Tạo mới
              </Button>
            )}
            title={"Tạo ticket"}
          >
            {({ close }) => (
              <TicketFormCreate
                okText={"Tạo"}
                onFinish={(v) => onCreate(v, close)}
                loading={isLoadingCreate}
              />
            )}
          </CustomModal>
        </div>
      </div>
      <div className="flex justify-end">
        <Form
          onFinish={setSearch}
          form={formSearch}
          layout="inline"
          initialValues={initSearchValues}
          autoComplete="off"
        >
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 [&>*]:!m-0 !space-x-reverse form-no-margin">
            <Form.Item name="note">
              <Input placeholder="Note" />
            </Form.Item>
            <Form.Item name="pinned">
              <Select allowClear placeholder="Ghim">
                {[].map((e) => {
                  return (
                    <Select.Option value={e?.value}>{e?.label}</Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
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
            </Form.Item>
          </div>
        </Form>
      </div>

      <Table
        rowSelection={rowSelection}
        rowKey={"_id"}
        onChange={pagination.onChangeTable}
        pagination={{ ...pagination, total: tickets?.paginate?.count }}
        loading={loadingFetch}
        columns={columns}
        dataSource={tickets?.data || []}
      ></Table>

      <CustomModal
        footer={false}
        ref={refForm}
        noButton={true}
        title={"Sửa ticket"}
      >
        {() => (
          <TicketFormCreate
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

export default TicketHomePage;
