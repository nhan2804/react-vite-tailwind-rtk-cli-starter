import React, { useState, useEffect, useRef } from "react";
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
} from "antd";
import {
  CheckCircleOutlined,
  CameraOutlined,
  PictureOutlined,
  StarOutlined,
  StarFilled,
  DeleteOutlined,
  SaveOutlined,
  HistoryOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import useShowExamRecord from "../hooks/query/useShowExamRecord";
import useUpdateAttendance from "../hooks/mutate/useUpdateAttendance";
import useUpdateNote from "../hooks/mutate/useUpdateNote";
import useUploadPhoto from "../hooks/mutate/useUploadPhoto";
import useSetPrimaryPhoto from "../hooks/mutate/useSetPrimaryPhoto";
import useDeletePhoto from "../hooks/mutate/useDeletePhoto";
import useGetAuditLog from "@modules/audit-logs/hooks/query/useGetAuditLog";
import CustomModal from "@components/CustomModal";

const { TextArea } = Input;

export const CitizenDetailModal = ({ recordId, open, onClose }, ref) => {
  // 1. Fetch Exam Record with 3s polling
  const { data: record, isLoading: isRecordLoading } = useShowExamRecord(
    recordId,
    {
      enabled: !!recordId && open,
      refetchInterval: open ? 3000 : false,
    },
  );

  // 2. Fetch Audit Logs for this record
  const { data: auditData, isLoading: isAuditLoading } = useGetAuditLog(
    { entityId: recordId, perPage: 30 },
    { enabled: !!recordId && open },
  );

  const auditLogs = auditData?.data || [];

  // Mutations
  const { mutate: updateAttendance, isLoading: isUpdatingAttendance } =
    useUpdateAttendance();
  const { mutate: updateNote, isLoading: isSavingNote } = useUpdateNote();
  const { mutate: uploadPhoto, isLoading: isUploadingPhoto } = useUploadPhoto();
  const { mutate: setPrimaryPhoto, isLoading: isSettingPrimary } =
    useSetPrimaryPhoto();
  const { mutate: deletePhoto, isLoading: isDeletingPhoto } = useDeletePhoto();

  // Local state for examination note
  const [noteDraft, setNoteDraft] = useState("");
  const [isNoteEdited, setIsNoteEdited] = useState(false);

  useEffect(() => {
    if (record && !isNoteEdited) {
      setNoteDraft(record.note || "");
    }
  }, [record?.note, isNoteEdited]);

  // Reset note state when modal opens with new recordId
  useEffect(() => {
    setIsNoteEdited(false);
  }, [recordId, open]);

  // Hidden inputs & state for inline camera capture & photo library selection
  const cameraInputRef = useRef(null);
  const libraryInputRef = useRef(null);
  const [uploadSource, setUploadSource] = useState(null); // 'camera' | 'library'

  const citizen = record?.citizen || {};
  const session = record?.sessionId || {};
  const isArrived = !!record?.attendance?.arrived;
  const activePhotos = record?.activePhotos || [];

  const handleToggleAttendance = () => {
    if (!record) return;
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
    if (!record) return;
    updateNote(
      { id: record._id, note: noteDraft },
      {
        onSuccess: () => {
          setIsNoteEdited(false);
        },
      },
    );
  };

  const handleFileInputChange = (e, source) => {
    const file = e.target.files?.[0];
    if (!file || !record) return;

    setUploadSource(source);
    uploadPhoto(
      { id: record._id, file },
      {
        onSettled: () => {
          setUploadSource(null);
        },
      },
    );

    e.target.value = "";
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
    <CustomModal
      ref={ref}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
      width={"100%"}
      title={
        <div className="flex items-center justify-between pr-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-900"></span>
            <span className="text-xs bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded">
              STT: {citizen.idx || citizen.index || "---"}
            </span>
          </div>
          {session?.name && (
            <Tag color="blue" className="text-xs m-0">
              {session.phase === "preliminary" ? "Sơ tuyển" : "Chính thức"}
            </Tag>
          )}
        </div>
      }
    >
      {() => {
        return (
          <div>
            <div className="max-h-[80vh] overflow-y-auto space-y-3 pr-1 pt-1">
              {isRecordLoading && !record ? (
                <div className="py-12 text-center">
                  <Spin size="large" />
                  <div className="text-gray-500 mt-3 text-sm">
                    Đang tải hồ sơ công dân...
                  </div>
                </div>
              ) : !record ? (
                <div className="py-8 text-center">
                  <Empty description="Không tìm thấy hồ sơ khám tuyển" />
                </div>
              ) : (
                <>
                  {/* 1. Citizen Information Card */}
                  <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 space-y-2.5">
                    <div className="border-b border-gray-200/60 pb-2 flex items-start justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">
                          {citizen.fullName || "Chưa có tên"}
                        </h2>
                        <div className="text-xs text-gray-600 mt-1 flex flex-wrap items-center gap-2">
                          <span>
                            Năm sinh:{" "}
                            <b className="text-gray-900">
                              {citizen.birthDate || "---"}
                            </b>
                          </span>
                          <span>•</span>
                          <span>
                            Thôn:{" "}
                            <b className="text-emerald-800">
                              {record.village || citizen.village || "---"}
                            </b>
                          </span>
                          <span>•</span>
                          <span>
                            Ngày khám:{" "}
                            <b className="text-blue-800">
                              {record.scheduledDate || "---"}
                            </b>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Số CCCD:</span>
                        <div className="font-mono font-bold text-gray-900 text-sm mt-0.5">
                          {citizen._id || "---"}
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400">Địa chỉ:</span>
                        <div className="font-medium text-gray-800 mt-0.5 line-clamp-2">
                          {citizen.address || "---"}
                        </div>
                      </div>

                      {citizen.carrer && (
                        <div>
                          <span className="text-gray-400">Nghề nghiệp:</span>
                          <div className="font-medium text-gray-800 mt-0.5">
                            {citizen.carrer}
                          </div>
                        </div>
                      )}

                      {citizen.workplace && (
                        <div>
                          <span className="text-gray-400">Nơi làm việc:</span>
                          <div className="font-medium text-gray-800 mt-0.5">
                            {citizen.workplace}
                          </div>
                        </div>
                      )}

                      {citizen.father && (
                        <div>
                          <span className="text-gray-400">Thông tin cha:</span>
                          <div className="font-medium text-gray-800 mt-0.5">
                            {citizen.father}
                          </div>
                        </div>
                      )}

                      {citizen.mother && (
                        <div>
                          <span className="text-gray-400">Thông tin mẹ:</span>
                          <div className="font-medium text-gray-800 mt-0.5">
                            {citizen.mother}
                          </div>
                        </div>
                      )}

                      {citizen.originalNote && (
                        <div className="col-span-2 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60">
                          <span className="text-[11px] font-semibold text-amber-800">
                            Ghi chú ban đầu từ file import:
                          </span>
                          <div className="text-amber-900 mt-0.5 whitespace-pre-wrap text-xs">
                            {citizen.originalNote}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. Attendance Section */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-xs uppercase tracking-wide">
                        Trạng thái điểm danh
                      </span>
                      {isArrived ? (
                        <Tag
                          color="success"
                          className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                        >
                          <CheckCircleOutlined /> ĐÃ ĐẾN
                        </Tag>
                      ) : (
                        <Tag
                          color="default"
                          className="text-xs px-2.5 py-0.5 rounded-full font-semibold text-gray-500"
                        >
                          CHƯA ĐẾN
                        </Tag>
                      )}
                    </div>

                    {isArrived && record.attendance?.arrivedAt && (
                      <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200/60 text-xs text-emerald-900 flex flex-col gap-0.5">
                        <div>
                          Thời gian đến:{" "}
                          <b>
                            {new Date(
                              record.attendance.arrivedAt,
                            ).toLocaleString("vi-VN")}
                          </b>
                        </div>
                        {record.attendance?.arrivedBy && (
                          <div>
                            Cán bộ xác nhận:{" "}
                            <b>{record.attendance.arrivedBy}</b>
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      type={isArrived ? "default" : "primary"}
                      size="middle"
                      block
                      icon={<CheckCircleOutlined />}
                      onClick={handleToggleAttendance}
                      loading={isUpdatingAttendance}
                      className={
                        isArrived
                          ? "text-red-600 border-red-300 hover:bg-red-50 font-semibold text-xs"
                          : "btn-emerald font-semibold text-xs text-white"
                      }
                    >
                      {isArrived
                        ? "Hủy điểm danh công dân này"
                        : "Điểm danh công dân đã đến"}
                    </Button>
                  </div>

                  {/* 3. Photo Management Section */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm space-y-2.5">
                    <div className="font-bold text-gray-800 text-xs uppercase tracking-wide">
                      Hình ảnh khám tuyển{" "}
                      <span className="text-xs text-gray-400 ml-1.5">
                        ({activePhotos.length} ảnh)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div></div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          type="primary"
                          size="small"
                          icon={<CameraOutlined />}
                          onClick={() => cameraInputRef.current?.click()}
                          loading={
                            isUploadingPhoto && uploadSource === "camera"
                          }
                          className="btn-army font-semibold text-xs"
                        >
                          Chụp ảnh máy
                        </Button>
                        <Button
                          size="small"
                          icon={<PictureOutlined />}
                          onClick={() => libraryInputRef.current?.click()}
                          loading={
                            isUploadingPhoto && uploadSource === "library"
                          }
                          className="font-semibold text-xs text-gray-700 hover:text-emerald-700 hover:border-emerald-700"
                        >
                          Thư viện
                        </Button>
                      </div>
                    </div>

                    {activePhotos.length === 0 ? (
                      <div className="border border-dashed border-gray-200 rounded-xl p-5 text-center bg-gray-50/50">
                        <CameraOutlined className="text-2xl text-gray-300 mb-1" />
                        <div className="text-xs text-gray-500">
                          Chưa có ảnh chụp cho công dân này
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-2.5">
                          <Button
                            type="primary"
                            size="small"
                            icon={<CameraOutlined />}
                            onClick={() => cameraInputRef.current?.click()}
                            loading={
                              isUploadingPhoto && uploadSource === "camera"
                            }
                            className="btn-army text-xs font-semibold"
                          >
                            Chụp ảnh máy
                          </Button>
                          <Button
                            size="small"
                            icon={<PictureOutlined />}
                            onClick={() => libraryInputRef.current?.click()}
                            loading={
                              isUploadingPhoto && uploadSource === "library"
                            }
                            className="text-xs font-semibold text-gray-700"
                          >
                            Chọn từ thư viện
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Image.PreviewGroup
                        items={activePhotos.map(
                          (p) =>
                            `/v1/api/exam-records/${record._id}/photos/${p.id}`,
                        )}
                      >
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {activePhotos.map((photo) => {
                            const photoUrl = `/v1/api/exam-records/${record._id}/photos/${photo.id}`;
                            const isPrimary = !!photo.isPrimary;

                            return (
                              <div
                                key={photo.id}
                                className={`relative rounded-lg overflow-hidden border bg-gray-50 group flex flex-col ${
                                  isPrimary
                                    ? "border-amber-400 ring-2 ring-amber-400/30"
                                    : "border-gray-200"
                                }`}
                              >
                                {/* Photo Preview Container */}
                                <div className="relative aspect-[3/4] w-full bg-black/10 overflow-hidden flex items-center justify-center">
                                  <Image
                                    src={photoUrl}
                                    alt="Ảnh công dân"
                                    width="100%"
                                    height="100%"
                                    className="!w-full !h-full !object-cover"
                                    rootClassName="w-full h-full flex items-center justify-center"
                                  />

                                  {/* Primary Badge */}
                                  {isPrimary && (
                                    <div className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm pointer-events-none z-10">
                                      <StarFilled className="text-[9px]" />{" "}
                                      Chính
                                    </div>
                                  )}
                                </div>

                                {/* Photo Actions Bar */}
                                <div className="p-1 bg-white border-t border-gray-100 flex items-center justify-between text-[11px]">
                                  {!isPrimary ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPrimaryPhoto({
                                          id: record._id,
                                          photoId: photo.id,
                                        })
                                      }
                                      disabled={isSettingPrimary}
                                      className="text-[10px] text-gray-600 hover:text-amber-600 flex items-center gap-0.5 cursor-pointer"
                                    >
                                      <StarOutlined /> Chính
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-amber-600 font-medium">
                                      Chính
                                    </span>
                                  )}

                                  <Popconfirm
                                    title="Chuyển ảnh vào thùng rác?"
                                    description="Ảnh có thể khôi phục từ trang Quản trị."
                                    okText="Xóa ảnh"
                                    cancelText="Hủy"
                                    okType="danger"
                                    onConfirm={() =>
                                      deletePhoto({
                                        id: record._id,
                                        photoId: photo.id,
                                      })
                                    }
                                  >
                                    <button
                                      type="button"
                                      disabled={isDeletingPhoto}
                                      className="icon-btn-clean text-gray-400 hover:text-red-600 p-0.5"
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
                      </Image.PreviewGroup>
                    )}
                  </div>

                  {/* 4. Examination Notes Section */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-xs uppercase tracking-wide">
                        Ghi chú khám tuyển
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
                      className="rounded-lg text-xs"
                    />

                    <div className="flex justify-end pt-1">
                      <Button
                        type="primary"
                        size="small"
                        icon={<SaveOutlined />}
                        onClick={handleSaveNote}
                        loading={isSavingNote}
                        className="btn-army text-xs font-semibold"
                      >
                        Lưu ghi chú
                      </Button>
                    </div>
                  </div>

                  {/* 5. Activity / Audit History Section */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                        <HistoryOutlined /> Lịch sử thao tác
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {auditLogs.length} thao tác
                      </span>
                    </div>

                    {isAuditLoading ? (
                      <div className="text-center py-3 text-xs text-gray-400">
                        Đang tải lịch sử...
                      </div>
                    ) : auditLogs.length === 0 ? (
                      <div className="text-center py-3 text-xs text-gray-400">
                        Chưa có lịch sử thao tác nào
                      </div>
                    ) : (
                      <div className="pt-2 max-h-52 overflow-y-auto pr-1">
                        <Timeline
                          items={auditLogs.map((log) => ({
                            color:
                              log.action.includes("undo") ||
                              log.action.includes("delete")
                                ? "red"
                                : "green",
                            children: (
                              <div className="text-xs">
                                <div className="font-semibold text-gray-800">
                                  {translateAuditAction(log.action)}
                                </div>
                                <div className="text-[11px] text-gray-500 mt-0.5">
                                  Thực hiện bởi:{" "}
                                  <b>
                                    {log.actorName || log.actorId || "Hệ thống"}
                                  </b>
                                </div>
                                <div className="text-[10px] text-gray-400 mt-0.5">
                                  {new Date(log.createdAt).toLocaleString(
                                    "vi-VN",
                                  )}
                                </div>
                              </div>
                            ),
                          }))}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

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
          </div>
        );
      }}
    </CustomModal>
  );
};

export default React.forwardRef(CitizenDetailModal);
