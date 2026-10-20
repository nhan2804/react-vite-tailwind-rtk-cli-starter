import React, { useState, useRef, useEffect, useCallback } from "react";
import { Modal, Button, message } from "antd";
import {
  CameraOutlined,
  ReloadOutlined,
  UploadOutlined,
  SwapOutlined,
  CloseOutlined,
} from "@ant-design/icons";

export const CameraCaptureModal = ({ open, onClose, onCapture, isUploading }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [facingMode, setFacingMode] = useState("environment"); // default rear camera
  const [cameraError, setCameraError] = useState(null);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async (facing) => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Trình duyệt không hỗ trợ Camera API trực tiếp. Vui lòng sử dụng nút chọn tệp / máy ảnh hệ thống.");
        return;
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.warn("getUserMedia error:", err);
      setCameraError(
        "Không thể mở camera (yêu cầu quyền truy cập hoặc HTTPS). Hãy sử dụng máy ảnh hệ thống bên dưới."
      );
    }
  }, [stream]);

  useEffect(() => {
    if (open && !capturedImage) {
      startCamera(facingMode);
    } else if (!open) {
      stopStream();
      setCapturedImage(null);
      setCapturedBlob(null);
      setCameraError(null);
    }
    return () => {
      stopStream();
    };
  }, [open, facingMode]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" });
          const previewUrl = URL.createObjectURL(blob);
          setCapturedImage(previewUrl);
          setCapturedBlob(file);
          stopStream();
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const handleRetake = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setCapturedBlob(null);
    startCamera(facingMode);
  };

  const handleConfirmUpload = () => {
    if (capturedBlob) {
      onCapture(capturedBlob);
    }
  };

  const handleSwitchCamera = () => {
    const nextFacing = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextFacing);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCapturedImage(previewUrl);
      setCapturedBlob(file);
      stopStream();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        stopStream();
        onClose();
      }}
      footer={null}
      width={480}
      centered
      destroyOnClose
      title={
        <div className="flex items-center justify-between pr-6">
          <span className="font-semibold text-gray-800">
            {capturedImage ? "Xem lại ảnh chụp" : "Chụp ảnh công dân"}
          </span>
          {!capturedImage && !cameraError && (
            <Button
              size="small"
              icon={<SwapOutlined />}
              onClick={handleSwitchCamera}
              className="text-xs"
            >
              Đổi camera
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col items-center">
        {/* Live Video / Captured Preview */}
        <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden flex items-center justify-center">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Ảnh vừa chụp"
              className="w-full h-full object-cover"
            />
          ) : cameraError ? (
            <div className="p-4 text-center text-white">
              <CameraOutlined className="text-4xl text-gray-400 mb-2" />
              <p className="text-sm text-yellow-300 mb-4">{cameraError}</p>
              <Button
                type="primary"
                icon={<CameraOutlined />}
                size="large"
                onClick={() => fileInputRef.current?.click()}
              >
                Mở máy ảnh điện thoại
              </Button>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Guide Overlay Grid */}
          {!capturedImage && !cameraError && (
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white/30 rounded-lg m-4" />
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Hidden File Input Fallback with capture="environment" for smartphones */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {/* Controls */}
        <div className="mt-4 w-full flex items-center justify-center gap-3">
          {capturedImage ? (
            <>
              <Button
                size="large"
                icon={<ReloadOutlined />}
                onClick={handleRetake}
                disabled={isUploading}
                className="flex-1"
              >
                Chụp lại
              </Button>
              <Button
                size="large"
                type="primary"
                icon={<UploadOutlined />}
                onClick={handleConfirmUpload}
                loading={isUploading}
                className="flex-1 btn-emerald"
              >
                Tải ảnh lên
              </Button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-2">
              <Button
                size="large"
                icon={<UploadOutlined />}
                onClick={() => fileInputRef.current?.click()}
                className="text-xs sm:text-sm"
              >
                Chọn tệp / Máy ảnh ngoài
              </Button>

              {!cameraError && (
                <Button
                  size="large"
                  type="primary"
                  icon={<CameraOutlined />}
                  onClick={handleCapture}
                  className="bg-[#18392B] hover:bg-[#204e3b] px-6 font-semibold"
                >
                  Chụp
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CameraCaptureModal;
