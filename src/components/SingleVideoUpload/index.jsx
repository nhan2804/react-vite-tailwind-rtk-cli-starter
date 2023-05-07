import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import FFMPEG from "react-ffmpeg";
import { BASE_URL, BASE_URL_UPLOAD } from "@config/axios";
// import convertImage2Jpg, { convertImage2JpgV2 } from "@helper/image2jpg";
import { useAppSelector } from "@hooks/reduxHook";
import Form from "antd/es/form";
import message from "antd/es/message";
import Upload from "antd/es/upload";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useParams } from "react-router";
import Compress from "compress.js";
import { Button, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CustomModal from "@components/CustomModal";
async function resizeImageFn(file) {
  const compress = new Compress();
  const resizedImage = await compress.compress([file], {
    size: 2, // the max size in MB, defaults to 2MB
    quality: 1, // the quality of the image, max is 1,
    maxWidth: 800, // the max width of the output image, defaults to 1920px
    maxHeight: 600, // the max height of the output image, defaults to 1920px
    resize: true, // defaults to true, set false if you do not want to resize the image width and height
  });
  const img = resizedImage[0];
  const base64str = img.data;

  // const resizedFiile = dataURLtoFile(base64str, file?.name);
  return base64str;
}
const SingleVideoUpload = (
  {
    label,
    name,
    maxWidth,
    maxHeight,
    resize = true,
    preview = false,
    projectId: projectIdProp,
    ...rest
  },
  ref
) => {
  const { projectId = projectIdProp } = useParams();
  const token = useAppSelector((state) => state.auth?.token);

  const [loading, setLoading] = useState(false);

  useImperativeHandle(
    ref,
    () => ({
      loadingUpload: loading,
    }),
    [loading]
  );
  const [urlImage, setImageUrl] = useState("");
  const getLink = (event) => {
    return event?.fileList[0]?.response?.newFile?.urlPublic;
  };
  async function beforeUpload(file) {
    // setLoading(true);
    return file;
    // const prom = () => {
    //   return new Promise((resolve) => {
    //     FFMPEG.process(
    //       file,
    //       '-metadata location="" -metadata location-eng="" -metadata author="" -c:v copy -c:a copy',
    //       function (e) {
    //         const video = e.result;
    //         resolve(video);
    //       }
    //     );
    //   });
    // };
    // return await prom();
  }
  const uploadButton = (
    <div className="mb-1">
      <Button
        danger={!!urlImage}
        type="primary"
        icon={<UploadOutlined />}
        loading={loading}
      >
        Upload {urlImage && "Lại"}
      </Button>
    </div>
  );
  const handleChange = async (info) => {
    if (info.file.status === "uploading") {
      // setImageUrl("");
      setLoading(true);

      return;
    }
    if (info.file.status === "done") {
      setImageUrl(info?.file?.response?.newFile?.urlPublic);
      message.success(`${info.file.name} Upload thành công`);

      setLoading(false);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} Upload thất bại`);
      setLoading(false);
    }
  };
  const imgURL = urlImage ? new URL(urlImage)?.pathname : "";
  const imgArr = imgURL?.split("bsc-qc/");
  const oldMedia = imgArr?.[imgArr?.length - 1];
  return (
    <Form.Item
      getValueFromEvent={getLink}
      {...{ name, label }}
      getValueProps={(value) => setImageUrl(value)}
    >
      <Upload
        {...rest}
        method="POST"
        maxCount={1}
        value="video"
        accept="video/*"
        action={`${BASE_URL}v1/api/upload/s3`}
        data={{
          projectId,
          oldUrl: oldMedia,
        }}
        name="file"
        headers={{ Authorization: `Bearer ${token}` }}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {!preview && uploadButton}
        {urlImage && (
          <div
            aria-hidden
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <CustomModal
              title={"Xem video"}
              width={600}
              button={({ open }) => (
                <Button
                  onClick={(e) => {
                    open();
                  }}
                >
                  Xem video
                </Button>
              )}
            >
              {() => (
                <video width={"100%"} height="350px" controls>
                  <source src={urlImage} type="video/mp4" />
                  <track
                    src="captions_es.vtt"
                    kind="captions"
                    srclang="es"
                    label="spanish_captions"
                  />
                </video>
              )}
            </CustomModal>
          </div>
        )}
      </Upload>
    </Form.Item>
  );
};

export default forwardRef(SingleVideoUpload);
