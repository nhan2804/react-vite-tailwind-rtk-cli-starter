import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Tag,
  Spin,
  Modal,
  Input,
  Timeline,
  Image,
  Empty,
  Popconfirm,
  Descriptions,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CameraOutlined,
  PictureOutlined,
  StarOutlined,
  StarFilled,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SaveOutlined,
  HistoryOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useShowExamRecord from "../../hooks/query/useShowExamRecord";
import useUpdateAttendance from "../../hooks/mutate/useUpdateAttendance";
import useUpdateNote from "../../hooks/mutate/useUpdateNote";
import useUploadPhoto from "../../hooks/mutate/useUploadPhoto";
import useSetPrimaryPhoto from "../../hooks/mutate/useSetPrimaryPhoto";
import useDeletePhoto from "../../hooks/mutate/useDeletePhoto";
import useGetAuditLog from "@modules/audit-logs/hooks/query/useGetAuditLog";

const { TextArea } = Input;

export const CitizenDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Fetch Exam Record with 3s polling for operator sync
  const {
    data: record,
    isLoading: isRecordLoading,
    refetch: refetchRecord,
  } = useShowExamRecord(id, { refetchInterval: 3000 });

  // 2. Fetch Audit Logs for this record
  const {
    data: auditData,
    isLoading: isAuditLoading,
    refetch: refetchAudit,
  } = useGetAuditLog({ entityId: id, perPage: 30 }, { enabled: !!id });

  const auditLogs = auditData?.data || [];

  // Mutations
  const { mutate: updateAttendance, isLoading: isUpdatingAttendance } = useUpdateAttendance();
  const { mutate: updateNote, isLoading: isSavingNote } = useUpdateNote();
  const { mutate: uploadPhoto, isLoading: isUploadingPhoto } = useUploadPhoto();
  const { mutate: setPrimaryPhoto, isLoading: isSettingPrimary } = useSetPrimaryPhoto();
  const { mutate: deletePhoto, isLoading: isDeletingPhoto } = useDeletePhoto();

  // Local state for examination note (preserves unsaved edits while polling)
  const [noteDraft, setNoteDraft] = useState("");
  const [isNoteEdited, setIsNoteEdited] = useState(false);

  useEffect(() => {
    if (record && !isNoteEdited) {
      setNoteDraft(record.note || "");
    }
  }, [record?.note, isNoteEdited]);

  // Masked CCCD state
  const [revealedCCCD, setRevealedCCCD] = useState(false);

  // Hidden inputs & state for inline camera capture & photo library selection
  const cameraInputRef = useRef(null);
  const libraryInputRef = useRef(null);
  const [uploadSource, setUploadSource] = useState(null); // 'camera' | 'library'

  // Fullscreen preview photo
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState(null);

  if (isRecordLoading && !record) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Spin size="large" />
        <div className="text-gray-500 mt-3 text-sm">Đang tải hồ sơ công dân...</div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Empty description="Không tìm thấy hồ sơ khám tuyển" />
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const citizen = record.citizen || {};
  const session = record.sessionId || {};
  const isArrived = !!record.attendance?.arrived;
  const activePhotos = record.activePhotos || [];

  const handleToggleAttendance = () => {
    if (isArrived) {
      Modal.confirm({
        title: "Hủy điểm danh?",
        content: `Xác nhận hủy điểm danh cho công dân ${citizen.fullName || ""}?`,
        okText: "Hủy điểm danh",
        okType: "danger",
        cancelText: "Đóng",
        onOk: () => {
          updateAttendance({ id: record._id, arrived: false });
        },
      });
    } else {
      updateAttendance({ id: record._id, arrived: true });
    }
  };

  const handleSaveNote = () => {
    updateNote(
      { id: record._id, note: noteDraft },
      {
        onSuccess: () => {
          setIsNoteEdited(false);
        },
      }
    );
  };

  const handleFileInputChange = (e, source) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadSource(source);
    uploadPhoto(
      { id: record._id, file },
      {
        onSettled: () => {
          setUploadSource(null);
        },
      }
    );

    e.target.value = "";
  };

  const maskCCCD = (cccd, isRevealed) => {
    if (!cccd) return "---";
    if (isRevealed || cccd.length < 12) return cccd;
    return `${cccd.slice(0, 4)}******${cccd.slice(10)}`;
  };

  const translateAuditAction = (action) => {
    const map = {
      "attendance.check_in": "Điểm danh đến",
      "attendance.undo": "Hủy điểm danh",
      "photo.upload": "Tải ảnh lên",
      "photo.delete": "Xóa ảnh vào thùng rác",
      "photo.restore": "Khôi phục ảnh",
      "photo.set_primary": "Đặt làm ảnh chính",
      "record.note_update": "Cập nhật ghi chú",
      "citizen.import": "Nhập dữ liệu công dân",
    };
    return map[action] || action;
  };

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-4 py-3 space-y-3 pb-24">
      {/* 1. Header with Back Button */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="font-medium text-gray-700"
        >
          Quay lại
        </Button>
        <div className="text-right">
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-bold text-gray-700">
            STT: {citizen.idx || citizen.index || "---"}
          </span>
        </div>
      </div>

      {/* 2. Citizen Information Card */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
        <div className="border-b border-gray-100 pb-2 flex items-start justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              {citizen.fullName || "Chưa có tên"}
            </h1>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <span>Năm sinh: <b>{citizen.birthDate || "---"}</b></span>
              <span>•</span>
              <span>Thôn: <b className="text-emerald-800">{record.village || citizen.village || "---"}</b></span>
            </div>
          </div>
          <Tag color="blue" className="text-xs m-0">
            {session.phase === "preliminary" ? "Sơ tuyển" : "Chính thức"}
          </Tag>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-400">Số CCCD:</span>
            <div className="font-mono font-medium text-gray-800 flex items-center gap-1.5 mt-0.5">
              <span>{maskCCCD(citizen._id, revealedCCCD)}</span>
              <Button
                type="text"
                size="small"
                shape="circle"
                onClick={() => setRevealedCCCD(!revealedCCCD)}
                className="text-gray-400 hover:text-gray-700 inline-flex items-center justify-center h-5 w-5 min-w-[20px]"
                title={revealedCCCD ? "Ẩn số CCCD" : "Xem số CCCD"}
                icon={revealedCCCD ? <EyeInvisibleOutlined className="text-xs" /> : <EyeOutlined className="text-xs" />}
              />
            </div>
          </div>

          <div>
            <span className="text-gray-400">Ngày khám:</span>
            <div className="font-medium text-gray-800 mt-0.5">
              {record.scheduledDate || "Chưa xếp lịch"}
            </div>
          </div>

          <div className="col-span-2">
            <span className="text-gray-400">Địa chỉ:</span>
            <div className="font-medium text-gray-800 mt-0.5">
              {citizen.address || "---"}
            </div>
          </div>

          {citizen.carrer && (
            <div>
              <span className="text-gray-400">Nghề nghiệp:</span>
              <div className="font-medium text-gray-800 mt-0.5">{citizen.carrer}</div>
            </div>
          )}

          {citizen.workplace && (
            <div>
              <span className="text-gray-400">Nơi làm việc:</span>
              <div className="font-medium text-gray-800 mt-0.5">{citizen.workplace}</div>
            </div>
          )}

          {citizen.father && (
            <div className="col-span-2">
              <span className="text-gray-400">Thông tin cha:</span>
              <div className="font-medium text-gray-800 mt-0.5">{citizen.father}</div>
            </div>
          )}

          {citizen.mother && (
            <div className="col-span-2">
              <span className="text-gray-400">Thông tin mẹ:</span>
              <div className="font-medium text-gray-800 mt-0.5">{citizen.mother}</div>
            </div>
          )}

          {citizen.originalNote && (
            <div className="col-span-2 bg-amber-50/70 p-2 rounded-lg border border-amber-200/50">
              <span className="text-[11px] font-semibold text-amber-800">
                Ghi chú ban đầu từ file import:
              </span>
              <div className="text-amber-900 mt-0.5 whitespace-pre-wrap">
                {citizen.originalNote}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Attendance Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">
            Trạng thái điểm danh
          </span>
          {isArrived ? (
            <Tag color="success" className="text-xs px-2.5 py-0.5 rounded-full font-semibold">
              <CheckCircleOutlined /> ĐÃ ĐẾN
            </Tag>
          ) : (
            <Tag color="default" className="text-xs px-2.5 py-0.5 rounded-full font-semibold text-gray-500">
              CHƯA ĐẾN
            </Tag>
          )}
        </div>

        {isArrived && record.attendance?.arrivedAt && (
          <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200/60 text-xs text-emerald-900 flex flex-col gap-1">
            <div>
              Thời gian đến: <b>{new Date(record.attendance.arrivedAt).toLocaleString("vi-VN")}</b>
            </div>
            {record.attendance?.arrivedBy && (
              <div>
                Cán bộ xác nhận: <b>{record.attendance.arrivedBy}</b>
              </div>
            )}
          </div>
        )}

        <Button
          type={isArrived ? "default" : "primary"}
          size="large"
          block
          icon={<CheckCircleOutlined />}
          onClick={handleToggleAttendance}
          loading={isUpdatingAttendance}
          className={
            isArrived
              ? "text-red-600 border-red-300 hover:bg-red-50 font-semibold"
              : "btn-emerald font-semibold"
          }
        >
          {isArrived ? "Hủy điểm danh công dân này" : "Điểm danh công dân đã đến"}
        </Button>
      </div>

      {/* 4. Photo Management Section (PHASE 6 & 10) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">
              Hình ảnh khám tuyển
            </span>
            <span className="text-xs text-gray-400 ml-2">
              ({activePhotos.length} ảnh)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="primary"
              size="middle"
              icon={<CameraOutlined />}
              onClick={() => cameraInputRef.current?.click()}
              loading={isUploadingPhoto && uploadSource === "camera"}
              className="btn-army font-semibold text-xs"
            >
              Chụp ảnh máy
            </Button>
            <Button
              size="middle"
              icon={<PictureOutlined />}
              onClick={() => libraryInputRef.current?.click()}
              loading={isUploadingPhoto && uploadSource === "library"}
              className="font-semibold text-xs text-gray-700 hover:text-emerald-700 hover:border-emerald-700"
            >
              Chọn từ thư viện
            </Button>
          </div>
        </div>

        {activePhotos.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50/50">
            <CameraOutlined className="text-3xl text-gray-300 mb-2" />
            <div className="text-xs text-gray-500">Chưa có ảnh chụp cho công dân này</div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Button
                type="primary"
                size="middle"
                icon={<CameraOutlined />}
                onClick={() => cameraInputRef.current?.click()}
                loading={isUploadingPhoto && uploadSource === "camera"}
                className="btn-army text-xs font-semibold"
              >
                Chụp ảnh máy
              </Button>
              <Button
                size="middle"
                icon={<PictureOutlined />}
                onClick={() => libraryInputRef.current?.click()}
                loading={isUploadingPhoto && uploadSource === "library"}
                className="text-xs font-semibold text-gray-700"
              >
                Chọn từ thư viện
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {activePhotos.map((photo) => {
              const photoUrl = `/v1/api/exam-records/${record._id}/photos/${photo.id}`;
              const isPrimary = !!photo.isPrimary;

              return (
                <div
                  key={photo.id}
                  className={`relative rounded-xl overflow-hidden border bg-gray-50 group flex flex-col ${
                    isPrimary ? "border-amber-400 ring-2 ring-amber-400/30" : "border-gray-200"
                  }`}
                >
                  {/* Photo Preview Container */}
                  <div
                    onClick={() => setPreviewPhotoUrl(photoUrl)}
                    className="relative cursor-pointer aspect-[3/4] w-full bg-black/10 overflow-hidden"
                  >
                    <img
                      src={photoUrl}
                      alt="Ảnh công dân"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Primary Badge */}
                    {isPrimary && (
                      <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <StarFilled className="text-[10px]" /> Ảnh chính
                      </div>
                    )}
                  </div>

                  {/* Photo Actions Bar */}
                  <div className="p-1.5 bg-white border-t border-gray-100 flex items-center justify-between text-xs">
                    {!isPrimary ? (
                      <button
                        type="button"
                        onClick={() => setPrimaryPhoto({ id: record._id, photoId: photo.id })}
                        disabled={isSettingPrimary}
                        className="text-[11px] text-gray-600 hover:text-amber-600 flex items-center gap-1"
                      >
                        <StarOutlined /> Đặt làm chính
                      </button>
                    ) : (
                      <span className="text-[11px] text-amber-600 font-medium">
                        Ảnh chính
                      </span>
                    )}

                    <Popconfirm
                      title="Chuyển ảnh vào thùng rác?"
                      description="Ảnh sẽ không bị xóa vĩnh viễn và có thể khôi phục từ trang Quản trị."
                      okText="Xóa ảnh"
                      cancelText="Hủy"
                      okType="danger"
                      onConfirm={() => deletePhoto({ id: record._id, photoId: photo.id })}
                    >
                      <button
                        type="button"
                        disabled={isDeletingPhoto}
                        className="icon-btn-clean text-gray-400 hover:text-red-600 p-1"
                        title="Xóa vào thùng rác"
                      >
                        <DeleteOutlined />
                      </button>
                    </Popconfirm>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Examination Notes Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">
            Ghi chú khám tuyển
          </span>
          <span className="text-[11px] text-gray-400">
            (Lưu riêng biệt với ghi chú ban đầu)
          </span>
        </div>

        <TextArea
          rows={3}
          value={noteDraft}
          onChange={(e) => {
            setNoteDraft(e.target.value);
            setIsNoteEdited(true);
          }}
          placeholder="Nhập ghi chú trong quá trình khám..."
          className="rounded-lg text-xs sm:text-sm"
        />

        <div className="flex justify-end pt-1">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSaveNote}
            loading={isSavingNote}
            className="bg-[#18392B] hover:bg-[#204e3b] text-xs font-semibold"
          >
            Lưu ghi chú
          </Button>
        </div>
      </div>

      {/* 6. Activity / Audit History Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-1.5">
            <HistoryOutlined /> Lịch sử thao tác
          </span>
          <span className="text-xs text-gray-400">
            {auditLogs.length} thao tác
          </span>
        </div>

        {isAuditLoading ? (
          <div className="text-center py-4 text-xs text-gray-400">Đang tải lịch sử...</div>
        ) : auditLogs.length === 0 ? (
          <div className="text-center py-4 text-xs text-gray-400">Chưa có lịch sử thao tác nào</div>
        ) : (
          <div className="pt-2 max-h-60 overflow-y-auto pr-1">
            <Timeline
              items={auditLogs.map((log) => ({
                color: log.action.includes("undo") || log.action.includes("delete") ? "red" : "green",
                children: (
                  <div className="text-xs">
                    <div className="font-semibold text-gray-800">
                      {translateAuditAction(log.action)}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Thực hiện bởi: <b>{log.actorName || log.actorId || "Hệ thống"}</b>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(log.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        )}
      </div>

      {/* Hidden file inputs for direct camera & photo library upload */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileInputChange(e, "camera")}
      />
      <input
        ref={libraryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileInputChange(e, "library")}
      />

      {/* Fullscreen Photo Lightbox Modal */}
      <Modal
        open={!!previewPhotoUrl}
        footer={null}
        onCancel={() => setPreviewPhotoUrl(null)}
        centered
        width={600}
        bodyStyle={{ padding: 0, backgroundColor: "black" }}
      >
        {previewPhotoUrl && (
          <img
            src={previewPhotoUrl}
            alt="Xem chi tiết ảnh"
            className="w-full h-auto max-h-[85vh] object-contain mx-auto"
          />
        )}
      </Modal>
    </div>
  );
};

export default CitizenDetailPage;
