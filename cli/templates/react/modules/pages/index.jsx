import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import useCreate__name__(sentenceCase) from "../hooks/mutate/useCreate__name__(sentenceCase)";
import useUpdate__name__(sentenceCase) from "../hooks/mutate/useUpdate__name__(sentenceCase)";
import useDelete__name__(sentenceCase) from "../hooks/mutate/useDelete__name__(sentenceCase)";
import useGet__name__(sentenceCase) from "../hooks/query/useGet__name__(sentenceCase)";
import __name__(sentenceCase)FormCreate from "../components/Form";

import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";


import usePagination from "@hooks/usePagination";
import useSearchQuery from "@hooks/useSearchQuery";
import{ useParams } from "react-router";
import { Button, Form, Input, Popconfirm, Select, Table ,DatePicker} from "antd";
import CustomModal from "@components/CustomModal";

const __name__(sentenceCase)HomePage = () => {
  
  const { projectId } = useParams();
  const [formSearch] = Form.useForm()
  const { initSearchValues, search, setSearch } = useSearchQuery();
  const pagination = usePagination({ reset: Object.values(search) });
  const query = {
    ...search,
    page: pagination.current,
    perPage: pagination.pageSize,

    startTime: search?.range?.[0]?.valueOf(),
    endTime: search?.range?.[1]?.valueOf(),
    range: undefined,
  };
 


  const { mutate: create__name__(sentenceCase)Fn, isLoading: isLoadingCreate } = useCreate__name__(sentenceCase)();
  const { data: __name__s ,isLoading:loadingFetch} = useGet__name__(sentenceCase)(query);
  const { mutate: update__name__(sentenceCase)Fn, isLoading: isLoadingUpdate } = useUpdate__name__(sentenceCase)();
  const { mutateAsync : delete__name__(sentenceCase)Fn, isLoading: isLoadingDelete } = useDelete__name__(sentenceCase)();


  const [selectedRecord,setSelected]= useState()
  const refForm = useRef()

  const onDelete =  (id)=>{
    return delete__name__(sentenceCase)Fn(id)
  }
  const onUpdate = (values)=>{
    update__name__(sentenceCase)Fn({_id: selectedRecord?._id,formData: values})
  }
  const onCreate = (value)=>{
    create__name__(sentenceCase)Fn(value)
  }
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY H:m:s"),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (txt,record) => (
        <div className="flex gap-x-1">
          <Popconfirm
            placement="topLeft"
            title={"Bạn có chắc muốn xóa record này, điều này không thể hoàn tác?"}
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
  return <div>
    <h3>__name__(sentenceCase)</h3>
   <div className="flex justify-end">
    <div>
      <div className="mb-2">
        <CustomModal title={"Tạo __name__"}>
          {()=> <__name__(sentenceCase)FormCreate onFinish={onCreate} loading={isLoadingCreate}/>}
        </CustomModal>
      </div>
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
   </div>
   
    <Table loading={loadingFetch} columns={columns} dataSource={__name__s || []}></Table>

    <CustomModal ref={refForm} noButton={true} title={"Sửa __name__"}>
      {()=> <__name__(sentenceCase)FormCreate okText="Lưu thay đổi" initialValues={selectedRecord} onFinish={onUpdate} loading={isLoadingUpdate}/>}
    </CustomModal>
  </div>;
};

export default __name__(sentenceCase)HomePage;
