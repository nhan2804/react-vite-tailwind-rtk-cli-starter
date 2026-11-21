import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Modal, Button, Input, Radio, Typography, Space, Alert, Spin, Tag } from "antd";
import {
  FileZipOutlined,
  DownloadOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  ClearOutlined,
  CheckCircleFilled,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { exportPhotosZip, countExportPhotos } from "../services/index";

const { TextArea } = Input;
const { Text } = Typography;

export const ExportPhotosModal = (
  { sessionId, currentSession, selectedDate, selectedVillage },
  ref
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cccdText, setCccdText] = useState("");
  const [scope, setScope] = useState("all_session"); // 'all_session' | 'current_filter'
  const [isExporting, setIsExporting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [countResult, setCountResult] = useState(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
    },
  }));

  const handleClose = () => {
    if (isExporting) return;
    setIsOpen(false);
  };

  // Parse lines of CCCD
  const parsedCccds = cccdText
    .split(/[\r\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Auto calculate exportable photos count whenever inputs change (debounced)
  useEffect(() => {
    if (!isOpen || !sessionId) {
      setCountResult(null);
      return;
    }

    let isMounted = true;
    setIsCalculating(true);

    const timer = setTimeout(async () => {
      try {
        const payload = {
          sessionId,
          scope,
          scheduledDate: selectedDate,
          village: selectedVillage,
          cccds: parsedCccds,
        };
        const res = await countExportPhotos(payload);
        if (isMounted) {
          setCountResult(res);
        }
      } catch (err) {
        console.error("Count photos error:", err);
      } finally {
        if (isMounted) {
          setIsCalculating(false);
        }
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, sessionId, scope, selectedDate, selectedVillage, cccdText]);

  const handleDownload = async () => {
    if (!sessionId) {
      toast.warning("Vui lòng chọn phiên khám trước khi xuất ảnh");
      return;
    }

    if (!countResult || countResult.totalExportable === 0) {
      toast.warning("Không có ảnh nào thỏa mãn điều kiện để xuất ZIP");
      return;
    }

    try {
      setIsExporting(true);

      const payload = {
        sessionId,
        scope,
        scheduledDate: selectedDate,
        village: selectedVillage,
        cccds: parsedCccds,
      };

      const blobData = await exportPhotosZip(payload);

      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const fileName = `Anh_cong_dan_${currentSession?.name ? currentSession.name.replace(/\s+/g, "_") : "kham_tuyen"}_${dateStr}.zip`;

      const blob = new Blob([blobData], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        parsedCccds.length > 0
          ? `Xuất ZIP thành công ${countResult.totalExportable} ảnh!`
          : `Xuất ZIP tất cả ${countResult.totalExportable} ảnh thành công!`
      );

      handleClose();
    } catch (err) {
      // In axios with responseType: 'blob', error body is also a Blob
      if (err?.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          toast.error(json.message || "Xuất file ảnh thất bại");
        } catch {
          toast.error("Xuất file ảnh thất bại");
        }
      } else {
        toast.error(
          err?.response?.data?.message || err?.message || "Xuất file ảnh thất bại"
        );
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      destroyOnClose
      width={520}
      title={
        <div className="flex items-center gap-2 pr-4 text-gray-900">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 text-base">
            <FileZipOutlined />
          </div>
          <div>
            <div className="font-bold text-base text-gray-900 leading-tight">
              Xuất tất cả ảnh công dân (File ZIP)
            </div>
            <div className="text-xs text-gray-500 font-normal mt-0.5">
              Phiên: <b>{currentSession?.name || "Chưa chọn phiên"}</b>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4 pt-2">
        {/* Scope selector */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/80 space-y-1.5">
          <div className="text-xs font-semibold text-gray-700">
            Phạm vi xuất ảnh:
          </div>
          <Radio.Group
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="flex flex-col gap-1 text-xs"
          >
            <Radio value="all_session">
              <span className="text-xs">
                Toàn bộ phiên khám{" "}
                <span className="text-gray-400">
                  ({currentSession?.name || "Tất cả ngày/thôn"})
                </span>
              </span>
            </Radio>
            <Radio value="current_filter">
              <span className="text-xs">
                Theo bộ lọc hiện tại:{" "}
                <span className="text-blue-700 font-medium">
                  {selectedVillage !== "all" ? `Thôn ${selectedVillage}` : "Tất cả thôn"} -{" "}
                  {selectedDate !== "all" ? selectedDate : "Tất cả ngày"}
                </span>
              </span>
            </Radio>
          </Radio.Group>
        </div>

        {/* Textarea for CCCD list */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800">
              Lọc theo danh sách số CCCD (mỗi số 1 dòng):
            </label>
            {parsedCccds.length > 0 && (
              <Button
                type="link"
                size="small"
                icon={<ClearOutlined />}
                onClick={() => setCccdText("")}
                className="text-[11px] p-0 h-auto text-red-500 hover:text-red-600"
              >
                Xóa danh sách
              </Button>
            )}
          </div>

          <TextArea
            rows={5}
            value={cccdText}
            onChange={(e) => setCccdText(e.target.value)}
            placeholder="049206007063&#10;049205001234&#10;049204005678&#10;...&#10;(Bỏ trống để xuất tất cả)"
            className="rounded-lg text-xs font-mono"
          />

          <div className="flex items-center justify-between text-xs text-gray-500 pt-0.5">
            <div>
              {parsedCccds.length > 0 ? (
                <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                  Đã nhập: {parsedCccds.length} số CCCD
                </span>
              ) : (
                <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                  Bỏ trống = Xuất tất cả công dân có ảnh
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-400">
              Cách nhau bằng dấu xuống dòng
            </span>
          </div>
        </div>

        {/* Real-time photo count calculation card */}
        <div className="transition-all duration-200">
          {isCalculating ? (
            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-2 text-xs text-gray-500">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
              <span>Đang tính toán số lượng ảnh có thể xuất...</span>
            </div>
          ) : countResult ? (
            countResult.totalExportable > 0 ? (
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-[13px]">
                    <CheckCircleFilled className="text-emerald-600 text-base" />
                    <span>
                      Sẽ xuất được:{" "}
                      <span className="text-emerald-700 text-sm font-extrabold">
                        {countResult.totalExportable}
                      </span>{" "}
                      ảnh
                    </span>
                  </div>
                  <Tag color="success" className="m-0 font-medium text-[11px] px-2 py-0.5">
                    {parsedCccds.length > 0
                      ? `${countResult.matchedCccds.length} / ${countResult.totalInputCccds} CCCD có ảnh`
                      : "Tất cả công dân có ảnh"}
                  </Tag>
                </div>

                {countResult.missingCccds?.length > 0 && (
                  <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-amber-800 space-y-1">
                    <div className="flex items-center gap-1 font-semibold">
                      <ExclamationCircleOutlined className="text-amber-600" />
                      <span>
                        Có {countResult.missingCccds.length} số CCCD không tìm thấy hoặc chưa chụp ảnh:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-white/70 rounded border border-amber-200/60">
                      {countResult.missingCccds.map((c) => (
                        <span
                          key={c}
                          className="font-mono text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <ExclamationCircleOutlined className="text-base text-amber-600 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="font-bold">
                    Không tìm thấy ảnh nào để xuất (0 ảnh)
                  </div>
                  <div className="text-[11px] text-amber-700">
                    {countResult.totalInputCccds > 0
                      ? `Tất cả ${countResult.totalInputCccds} số CCCD đã nhập đều chưa có ảnh hoặc không thuộc phạm vi đã chọn.`
                      : "Không có công dân nào có ảnh chụp trong phạm vi phiên/bộ lọc đã chọn."}
                  </div>
                </div>
              </div>
            )
          ) : null}
        </div>

        {/* Naming specification alert */}
        <Alert
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          message={
            <div className="text-xs space-y-0.5">
              <div className="font-semibold text-gray-800">
                Quy cách đóng gói file ZIP:
              </div>
              <div className="text-gray-600">
                • Chỉ lấy công dân <b>có ít nhất 1 ảnh</b> và lấy <b>ảnh chính (primary)</b>.
              </div>
              <div className="text-gray-600">
                • Định dạng tên ảnh:{" "}
                <code className="text-blue-700 bg-blue-50 px-1 py-0.2 rounded font-semibold">
                  stt - village - fullName.jpg
                </code>
              </div>
              <div className="text-gray-500 text-[11px]">
                (Ví dụ: <i>156 - Phú Yên - Nguyễn Tiến Lợi.jpg</i>)
              </div>
            </div>
          }
          className="rounded-xl bg-blue-50/60 border-blue-200"
        />

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <Button onClick={handleClose} disabled={isExporting}>
            Hủy
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            loading={isExporting}
            disabled={
              isExporting ||
              isCalculating ||
              !countResult ||
              countResult.totalExportable === 0
            }
            className="btn-army font-semibold text-xs"
          >
            {isExporting
              ? "Đang nén & tải ZIP..."
              : isCalculating
              ? "Đang tính toán..."
              : countResult?.totalExportable > 0
              ? `Tải file ZIP (${countResult.totalExportable} ảnh)`
              : "Tải file ZIP (0 ảnh)"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef(ExportPhotosModal);
