import { Button, message } from "antd";
import React from "react";
import { useState } from "react";
import Papa from "papaparse";
import CustomModal from "@components/CustomModal";
import { FileAddOutlined } from "@ant-design/icons";
const ImportFile = ({ onSubmit, loading, link, okText = "Tạo" }) => {
  const [file, setFile] = useState();

  const handleFile = () => {
    if (!file) {
      message.error("Vui lòng chọn file");
    }
    Papa.parse(file, {
      complete: async (results, file) => {
        const rs = results?.data;
        return onSubmit?.(rs);
      },
      error: async (err) => {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      },
    });
  };
  return (
    <div>
      <h2>
        {"File mẫu "}
        <a
          target={"_blank"}
          rel="noreferrer"
          href={
            link ||
            "https://drive.google.com/file/d/1xDwjRHocCkiinYemWg3ZJNScH3NjMuyp/view?usp=sharing"
          }
        >
          {"đây"}
        </a>
      </h2>
      <input
        accept=".csv"
        onChange={(e) => {
          if (e?.target?.files?.[0]) {
            setFile(e?.target?.files?.[0]);
          }
        }}
        type={"file"}
      />
      <div className="flex justify-end">
        <Button loading={loading} type="primary" onClick={handleFile}>
          {okText}
        </Button>
      </div>
    </div>
  );
};

const ImportFileModal = ({
  text = "Tạo nhiều",
  onSubmit,
  loading,
  link,
  okText = "Tạo",
  title = "Tạo nhiều",
}) => {
  return (
    <CustomModal
      title={title}
      footer={false}
      button={({ open }) => (
        <Button type="primary" icon={<FileAddOutlined />} onClick={open}>
          {text}
        </Button>
      )}
    >
      {({ close }) => (
        <ImportFile
          onSubmit={(v) => onSubmit(v, close)}
          loading={loading}
          link={link}
          okText={okText}
        ></ImportFile>
      )}
    </CustomModal>
  );
};
export default ImportFileModal;
