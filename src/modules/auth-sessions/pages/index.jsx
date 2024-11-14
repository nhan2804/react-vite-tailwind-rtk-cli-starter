import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import useCreateAuthSession from "../hooks/mutate/useCreateAuthSession";
import useCreateBulkAuthSession from "../hooks/mutate/useCreateBulkAuthSession";
import useUpdateAuthSession from "../hooks/mutate/useUpdateAuthSession";
import useDeleteAuthSession from "../hooks/mutate/useDeleteAuthSession";
import useDeleteBulkAuthSession from "../hooks/mutate/useDeleteBulkAuthSession";
import useGetAuthSession from "../hooks/query/useGetAuthSession";
import AuthSessionFormCreate from "../components/Form";

import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
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
  Tag,
} from "antd";
import CustomModal from "@components/CustomModal";
import ImportFileModal from "@components/ImportFileModal";
import CustomPageHeader from "@components/CustomPageHeader";
import ExportExcelCommon from "@components/ExportExcel";
import useGetProfile from "@modules/auth/hooks/useGetProfile";
import useLogout from "@modules/auth/hooks/useLogout";
import useLogoutAuthSession from "@modules/auth/hooks/mutate/useLogoutAuthSession";
const AuthSessionHomePage = () => {
  const {} = useParams();
  const [formSearch] = Form.useForm();
  const { initSearchValues, search, setSearch } = useSearchQuery();

  const [selectedRecord, setSelected] = useState();
  const { data: profile } = useGetProfile();
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

  const { mutate: createAuthSessionFn, isLoading: isLoadingCreate } =
    useCreateAuthSession();
  const { mutateAsync: logout, isLoading: loadingLogout } = useLogout();
  const { data: AuthSessions, isLoading: loadingFetch } =
    useGetAuthSession(query);
  const { mutate: updateAuthSessionFn, isLoading: isLoadingUpdate } =
    useUpdateAuthSession();
  const { mutateAsync: deleteAuthSessionFn, isLoading: isLoadingDelete } =
    useDeleteAuthSession();
  const {
    mutateAsync: deleteBulkAuthSessionFn,
    isLoading: isLoadingBulkDelete,
  } = useDeleteBulkAuthSession();
  const { mutate: createBulkAuthSessionFn, isLoading: isLoadingCreateBulk } =
    useCreateBulkAuthSession();
  const { mutateAsync: logoutSession } = useLogoutAuthSession();

  // const onDelete = (id) => {
  //   return deleteAuthSessionFn(id);
  // };
  // const onUpdate = (values) => {
  //   updateAuthSessionFn(
  //     { _id: selectedRecord?._id, formData: values },
  //     {
  //       onSuccess: () => {
  //         refForm?.current?.close();
  //       },
  //     }
  //   );
  // };
  // const onCreate = (value, c) => {
  //   createAuthSessionFn(value, {
  //     onSuccess: c,
  //   });
  // };

  // const onCreateBulk = (data, c) => {
  //   const raw = data?.map((e) => ({
  //     name: e?.[0]?.trim(),
  //   }));
  //   // console.log({ raw });
  //   createBulkAuthSessionFn(raw, {
  //     onSuccess: c,
  //   });
  // };
  // const onDeleteBulk = () => {
  //   return deleteBulkAuthSessionFn(selectedRowKeys, {
  //     onSuccess: () => {
  //       setSelectedRowKeys([]);
  //     },
  //   });
  // };
  const columns = [
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      excelRender: (t) => t,
      render: (ip, row) => {
        return (
          <div>
            {ip}{" "}
            {row?.authSessionKey === profile?.authSessionKey ? (
              <Tag color="green">Bạn</Tag>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      title: "User Agent",
      dataIndex: "userAgent",
      key: "userAgent",
    },
    {
      title: "Chi tiết",
      dataIndex: "geoInfo",
      key: "geoInfo",
      excelRender: (t) => {
        return ` ${t?.city} - ${t?.country} IPS : ${t?.isp}`;
      },
      render: (t) => {
        return (
          <div>
            <img
              src={t?.country_flag}
              alt="flag"
              className="w-4 float-left mr-1"
            ></img>
            <div>
              {t?.city} - {t?.country}
            </div>
            <div>[IPS : {t?.isp}]</div>
          </div>
        );
      },
    },
    {
      title: "Source",
      dataIndex: "type",
      key: "type",
    },
    {
      sortOrder: pagination?.tableSortOrder?.createdAt?.order,
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      excelRender: (text) => dayjs(text).format("DD/MM/YYYY H:m:s"),
      render: (text) => dayjs(text).format("DD/MM/YYYY H:m:s"),
      sorter: {
        multiple: 1,
      },
    },
    {
      title: "Hiệu lực",
      key: "expired",
      dataIndex: "expired",
      excelRender: (text) => (!text ? "Còn" : "Không"),
      render: (text) =>
        !text ? <Tag color="green">Còn</Tag> : <Tag color="red">Không</Tag>,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (txt, record) => (
        <div className="flex gap-x-1">
          <Popconfirm
            disabled={record?.authSessionKey === profile?.authSessionKey}
            placement="topLeft"
            title={"Bạn có chắc muốn đăng xuất thiết bị này?"}
            onConfirm={async () => {
              await logoutSession({ authSessionKey: record?.authSessionKey });
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              disabled={record?.authSessionKey === profile?.authSessionKey}
              danger
              type="primary"
              icon={<LogoutOutlined />}
            >
              Đăng xuất
            </Button>
            {/* </Popconfirm>
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
            </Button> */}
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-2">
      <CustomPageHeader title="Phiên đăng nhập" />

      <div className="flex justify-end mb-1">
        <Form
          onFinish={setSearch}
          form={formSearch}
          layout="inline"
          initialValues={initSearchValues}
          autoComplete="off"
        >
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 [&>*]:!m-0 !space-x-reverse form-no-margin">
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
              type="auth-session"
              columns={columns}
              dataSource={AuthSessions}
            ></ExportExcelCommon>
            <Popconfirm
              placement="topLeft"
              title={"Bạn có chắc đăng xuất tất cả, bạn cần đăng nhập lại?"}
              onConfirm={async () => {
                await logoutSession({
                  authSessionKey: undefined,
                  logOutAll: true,
                });
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button danger type="primary" icon={<LogoutOutlined />}>
                Đăng xuất tất cả
              </Button>
            </Popconfirm>
          </div>
        </Form>
      </div>

      <Table
        // rowSelection={rowSelection}
        rowKey={"_id"}
        onChange={pagination.onChangeTable}
        pagination={{ ...pagination, total: AuthSessions?.paginate?.count }}
        loading={loadingFetch}
        columns={columns}
        dataSource={AuthSessions || []}
      ></Table>

      {/* <CustomModal
        footer={false}
        ref={refForm}
        noButton={true}
        title={"Sửa auth-session"}
      >
        {() => (
          <AuthSessionFormCreate
            okText="Lưu thay đổi"
            initialValues={selectedRecord}
            onFinish={onUpdate}
            loading={isLoadingUpdate}
          />
        )}
      </CustomModal> */}
    </div>
  );
};

export default AuthSessionHomePage;
