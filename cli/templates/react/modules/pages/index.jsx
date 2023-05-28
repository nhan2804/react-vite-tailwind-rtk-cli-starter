import React, { useRef, useState } from "react";
import dayjs from "dayjs";

import useCreate__name__(sentenceCase) from "../hooks/mutate/useCreate__name__(sentenceCase)";
import useCreateBulk__name__(sentenceCase) from "../hooks/mutate/useCreateBulk__name__(sentenceCase)";
import useUpdate__name__(sentenceCase) from "../hooks/mutate/useUpdate__name__(sentenceCase)";
import useDelete__name__(sentenceCase) from "../hooks/mutate/useDelete__name__(sentenceCase)";
import useDeleteBulk__name__(sentenceCase) from "../hooks/mutate/useDeleteBulk__name__(sentenceCase)";
import useGet__name__(sentenceCase) from "../hooks/query/useGet__name__(sentenceCase)";
import __name__(sentenceCase)FormCreate from "../components/Form";

import { SearchOutlined, EditOutlined, DeleteOutlined,PlusOutlined } from "@ant-design/icons";


import usePagination from "@hooks/usePagination";
import useSearchQuery from "@hooks/useSearchQuery";
import{ useParams } from "react-router";
import { Button, Form, Input, Popconfirm, Select, Table ,DatePicker} from "antd";
import CustomModal from "@components/CustomModal";
import ImportFileModal from "@components/ImportFileModal";

const __name__(sentenceCase)HomePage = () => {
  
  const { __params__ } = useParams();
  const [formSearch] = Form.useForm()
  const { initSearchValues, search, setSearch } = useSearchQuery();

  const [selectedRecord,setSelected]= useState()

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;


  const refForm = useRef()
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
 


  const { mutate: create__name__(sentenceCase)Fn, isLoading: isLoadingCreate } = useCreate__name__(sentenceCase)(__params__);
  const { data: __name__s ,isLoading:loadingFetch} = useGet__name__(sentenceCase)(__params__query);
  const { mutate: update__name__(sentenceCase)Fn, isLoading: isLoadingUpdate } = useUpdate__name__(sentenceCase)(__params__);
  const { mutateAsync : delete__name__(sentenceCase)Fn, isLoading: isLoadingDelete } = useDelete__name__(sentenceCase)(__params__);
  const { mutateAsync : deleteBulk__name__(sentenceCase)Fn, isLoading: isLoadingBulkDelete } = useDeleteBulk__name__(sentenceCase)(__params__);
  const { mutate : createBulk__name__(sentenceCase)Fn, isLoading: isLoadingCreateBulk } = useCreateBulk__name__(sentenceCase)(__params__);

 

  const onDelete =  (id)=>{
    return delete__name__(sentenceCase)Fn(id)
  }
  const onUpdate = (values)=>{
    update__name__(sentenceCase)Fn({_id: selectedRecord?._id,formData: values},{
      onSuccess:()=>{
        refForm?.current?.close();
      }
    })
  }
  const onCreate = (value,c)=>{
    create__name__(sentenceCase)Fn(value,{
      onSuccess:c
    })
  }
  
  const onCreateBulk=(data,c)=>{
    const raw = data
      ?.map((e) => ({
        name: e?.[0]?.trim(),
      }))
    // console.log({ raw });
    createBulk__name__(sentenceCase)Fn(raw,{
      onSuccess:c
    });
}
  const onDeleteBulk=()=>{
    return deleteBulk__name__(sentenceCase)Fn(selectedRowKeys,{
      onSuccess:()=>{
        setSelectedRowKeys([])
      }
    });
}
  const columns = [
    __column-table__
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
          icon={<EditOutlined/>}
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
      <div className="mb-2 flex space-x-2">
        {hasSelected &&  <Popconfirm title="Xóa các record này, sẽ không thể hoàn tác được!" onConfirm={onDeleteBulk}><Button type="primary" danger icon={<DeleteOutlined/>} >Xóa nhiều</Button></Popconfirm>}
        <ImportFileModal loading={isLoadingCreateBulk} title={`Tạo nhiều __name__`} onSubmit={onCreateBulk}/>
        <CustomModal footer={false} button={({open})=><Button onClick={open} icon={<PlusOutlined />} type="primary">Tạo mới</Button>} title={"Tạo __name__"}>
          {({close})=> <__name__(sentenceCase)FormCreate okText={"Tạo"} onFinish={(v)=>onCreate(v,close)} loading={isLoadingCreate}/>}
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
          __column-search-able__
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
   
    <Table rowSelection={rowSelection} rowKey={"_id"} onChange={pagination.onChangeTable}  pagination={{...pagination, total:__name__s?.paginate?.count}} loading={loadingFetch} columns={columns} dataSource={__name__s?.data || []}></Table>

    <CustomModal footer={false} ref={refForm} noButton={true} title={"Sửa __name__"}>
      {()=> <__name__(sentenceCase)FormCreate okText="Lưu thay đổi" initialValues={selectedRecord} onFinish={onUpdate} loading={isLoadingUpdate}/>}
    </CustomModal>
  </div>;
};

export default __name__(sentenceCase)HomePage;
