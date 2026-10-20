import React, { useState, useMemo, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Input,
  Select,
  Tag,
  Button,
  Spin,
  Empty,
  Badge,
  Card,
  Pagination,
  Modal,
  Image,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CameraOutlined,
  PictureOutlined,
  FileTextOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  SettingOutlined,
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useSelectedSession from "@modules/exam-sessions/hooks/useSelectedSession";
import useGetExamRecord from "../hooks/query/useGetExamRecord";
import useGetExamRecordSummary from "../hooks/query/useGetExamRecordSummary";
import useUpdateAttendance from "../hooks/mutate/useUpdateAttendance";
import useUploadPhoto from "../hooks/mutate/useUploadPhoto";
import CitizenDetailModal from "../components/CitizenDetailModal";

export const ExamRecordsHomePage = () => {
  const navigate = useNavigate();
  const {
    sessions,
    selectedId: sessionId,
    currentSession,
    selectSession,
    isLoading: isSessionLoading,
  } = useSelectedSession();

  // Filters state
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all"); // 'all' | 'arrived' | 'not_arrived' | 'photographed' | 'not_photographed'
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  // Masked CCCD toggle state { [citizenId]: boolean }
  const [revealedCCCDs, setRevealedCCCDs] = useState({});

  // Selected Record ID for Detail Popup Modal
  const [selectedDetailRecordId, setSelectedDetailRecordId_] = useState(null);
  const refDetailModal = useRef();
  const setSelectedDetailRecordId = useCallback(
    (v) => {
      setSelectedDetailRecordId_(v);
      refDetailModal.current?.open();
    },
    [setSelectedDetailRecordId_],
  );

  const toggleMaskCCCD = (id) => {
    setRevealedCCCDs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. Fetch summary stats & distinct chips with 10s polling
  const {
    data: summary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useGetExamRecordSummary(
    { sessionId, scheduledDate: selectedDate, village: selectedVillage },
    { refetchInterval: 10000, enabled: !!sessionId },
  );

  // 2. Fetch records list with 5s polling for multi-operator sync
  const queryParams = useMemo(
    () => ({
      sessionId,
      scheduledDate: selectedDate,
      village: selectedVillage,
      status: selectedStatus,
      search,
      page,
      perPage,
    }),
    [
      sessionId,
      selectedDate,
      selectedVillage,
      selectedStatus,
      search,
      page,
      perPage,
    ],
  );

  const {
    data: recordsData,
    isLoading: isRecordsLoading,
    isFetching,
    refetch: refetchRecords,
  } = useGetExamRecord(queryParams, {
    refetchInterval: 5000,
    enabled: !!sessionId,
  });

  const records = recordsData?.data || [];
  const paginate = recordsData?.paginate || { count: 0, totalPages: 1 };

  // Mutations
  const { mutate: updateAttendance, isLoading: isUpdatingAttendance } =
    useUpdateAttendance();
  const { mutate: uploadPhoto } = useUploadPhoto();

  // Hidden inputs & state for inline camera capture & photo library selection
  const cameraInputRef = useRef(null);
  const libraryInputRef = useRef(null);
  const [targetRecordId, setTargetRecordId] = useState(null);
  const [uploadingRecordId, setUploadingRecordId] = useState(null);
  const [uploadSource, setUploadSource] = useState(null); // 'camera' | 'library'

  const handleTriggerCamera = (recordId) => {
    setTargetRecordId(recordId);
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
      cameraInputRef.current.click();
    }
  };

  const handleTriggerLibrary = (recordId) => {
    setTargetRecordId(recordId);
    if (libraryInputRef.current) {
      libraryInputRef.current.value = "";
      libraryInputRef.current.click();
    }
  };

  const handleFileInputChange = (e, source) => {
    const file = e.target.files?.[0];
    if (!file || !targetRecordId) return;

    setUploadingRecordId(targetRecordId);
    setUploadSource(source);

    uploadPhoto(
      { id: targetRecordId, file },
      {
        onSettled: () => {
          setUploadingRecordId(null);
          setUploadSource(null);
          setTargetRecordId(null);
        },
      },
    );

    e.target.value = "";
  };

  const handleToggleAttendance = (record) => {
    const isArrived = record.attendance?.arrived;
    if (isArrived) {
      Modal.confirm({
        title: "Hủy điểm danh?",
        content: `Bạn có chắc muốn hủy điểm danh cho công dân ${record.citizen?.fullName || ""}?`,
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

  const maskCCCD = (cccd, isRevealed) => {
    if (!cccd) return "---";
    if (isRevealed || cccd.length < 12) return cccd;
    return `${cccd.slice(0, 4)}******${cccd.slice(10)}`;
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return dateStr;
  };

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-4 py-3 space-y-3 pb-20">
      {/* 1. Header Bar: Session Selector & Quick Nav */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex-1">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
            Phiên khám tuyển sinh
          </div>
          <Select
            value={sessionId || undefined}
            onChange={(val) => {
              selectSession(val);
              setSelectedDate("all");
              setSelectedVillage("all");
              setPage(1);
            }}
            placeholder="Chọn phiên khám"
            className="w-full font-medium"
            loading={isSessionLoading}
            options={sessions.map((s) => ({
              value: s._id,
              label: (
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{s.name}</span>
                  <span className="text-xs text-gray-400 ml-2">
                    ({s.serviceType === "military" ? "QS" : "CA"} -{" "}
                    {s.phase === "preliminary" ? "Sơ tuyển" : "Chính thức"})
                  </span>
                </div>
              ),
            }))}
          />
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Button
            icon={<ReloadOutlined spin={isFetching} />}
            onClick={() => {
              refetchRecords();
              refetchSummary();
            }}
            title="Làm mới dữ liệu"
          />
          <Link to="/admin">
            <Button icon={<SettingOutlined />} type="default">
              Quản trị
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Session Summary Stats Cards */}
      {currentSession && summary && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-2.5 rounded-xl border border-blue-200/60 text-center">
            <div className="text-[11px] text-blue-700 font-medium">
              Tổng công dân
            </div>
            <div className="text-xl font-bold text-blue-900 mt-0.5">
              {summary.totalCitizens || 0}
            </div>
            <div className="text-[10px] text-blue-600 mt-0.5">
              {summary.totalPhotos || 0} ảnh chụp
            </div>
          </div>

          <div
            onClick={() =>
              setSelectedStatus(
                selectedStatus === "arrived" ? "all" : "arrived",
              )
            }
            className={`cursor-pointer p-2.5 rounded-xl border text-center transition-all ${
              selectedStatus === "arrived"
                ? "bg-green-100 border-green-500 shadow-sm"
                : "bg-green-50/70 border-green-200/60 hover:bg-green-100/50"
            }`}
          >
            <div className="text-[11px] text-green-700 font-medium">Đã đến</div>
            <div className="text-xl font-bold text-green-800 mt-0.5">
              {summary.arrivedCount || 0}
            </div>
            <div className="text-[10px] text-green-600 mt-0.5">
              {summary.totalCitizens
                ? Math.round(
                    (summary.arrivedCount / summary.totalCitizens) * 100,
                  )
                : 0}
              %
            </div>
          </div>

          <div
            onClick={() =>
              setSelectedStatus(
                selectedStatus === "photographed" ? "all" : "photographed",
              )
            }
            className={`cursor-pointer p-2.5 rounded-xl border text-center transition-all ${
              selectedStatus === "photographed"
                ? "bg-indigo-100 border-indigo-500 shadow-sm"
                : "bg-indigo-50/70 border-indigo-200/60 hover:bg-indigo-100/50"
            }`}
          >
            <div className="text-[11px] text-indigo-700 font-medium">
              Đã chụp ảnh
            </div>
            <div className="text-xl font-bold text-indigo-800 mt-0.5">
              {summary.photographedCount || 0}
            </div>
            <div className="text-[10px] text-indigo-600 mt-0.5">
              Chưa chụp: {summary.notPhotographedCount || 0}
            </div>
          </div>
        </div>
      )}

      {/* 3. Filter Chips: Priority 1 = Date & Village Chips */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 space-y-2.5">
        {/* Date chips */}
        <div>
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Ngày khám</span>
            {selectedDate !== "all" && (
              <Button
                size="small"
                type="link"
                onClick={() => {
                  setSelectedDate("all");
                  setPage(1);
                }}
                className="text-xs p-0 h-auto text-blue-600 hover:text-blue-700"
              >
                Đặt lại
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <Button
              shape="round"
              size="small"
              type={selectedDate === "all" ? "primary" : "default"}
              onClick={() => {
                setSelectedDate("all");
                setPage(1);
              }}
              className={
                selectedDate === "all"
                  ? "btn-army text-xs font-medium"
                  : "text-xs font-medium"
              }
            >
              Tất cả
            </Button>
            {(summary?.distinctDates || []).map((dateStr) => {
              const isActive = selectedDate === dateStr;
              return (
                <Button
                  key={dateStr}
                  shape="round"
                  size="small"
                  type={isActive ? "primary" : "default"}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setPage(1);
                  }}
                  className={
                    isActive
                      ? "btn-army text-xs font-medium"
                      : "text-xs font-medium"
                  }
                >
                  {formatDateDisplay(dateStr)}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Village chips */}
        <div>
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Thôn / Tổ dân phố</span>
            {selectedVillage !== "all" && (
              <Button
                size="small"
                type="link"
                onClick={() => {
                  setSelectedVillage("all");
                  setPage(1);
                }}
                className="text-xs p-0 h-auto text-blue-600 hover:text-blue-700"
              >
                Đặt lại
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <Button
              shape="round"
              size="small"
              type={selectedVillage === "all" ? "primary" : "default"}
              onClick={() => {
                setSelectedVillage("all");
                setPage(1);
              }}
              className={
                selectedVillage === "all"
                  ? "btn-army text-xs font-medium"
                  : "text-xs font-medium"
              }
            >
              Tất cả
            </Button>
            {(summary?.distinctVillages || []).map((v) => {
              const isActive = selectedVillage === v;
              return (
                <Button
                  key={v}
                  shape="round"
                  size="small"
                  type={isActive ? "primary" : "default"}
                  onClick={() => {
                    setSelectedVillage(v);
                    setPage(1);
                  }}
                  className={
                    isActive
                      ? "btn-army text-xs font-medium"
                      : "text-xs font-medium"
                  }
                >
                  {v || "Chưa rõ"}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Status chips */}
        <div>
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Trạng thái
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "Tất cả" },
              { id: "arrived", label: "Đã đến" },
              { id: "not_arrived", label: "Chưa đến" },
              { id: "photographed", label: "Đã chụp ảnh" },
              { id: "not_photographed", label: "Chưa chụp" },
            ].map((st) => {
              const isActive = selectedStatus === st.id;
              return (
                <Button
                  key={st.id}
                  shape="round"
                  size="small"
                  type={isActive ? "primary" : "default"}
                  onClick={() => {
                    setSelectedStatus(st.id);
                    setPage(1);
                  }}
                  className={
                    isActive
                      ? "btn-amber text-xs font-medium"
                      : "text-xs font-medium"
                  }
                >
                  {st.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Search input */}
        <div className="pt-1">
          <Input
            prefix={<SearchOutlined className="text-gray-400 mr-1" />}
            placeholder="Tìm theo họ tên, CCCD, STT..."
            value={search}
            allowClear
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-lg py-1.5"
          />
        </div>
      </div>

      {/* 4. Citizen List Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs text-gray-500">
          <span>
            Tìm thấy <b>{paginate.count}</b> công dân
          </span>
          <span>
            Trang {paginate.page} / {paginate.totalPages || 1}
          </span>
        </div>

        {isRecordsLoading && records.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center shadow-sm border border-gray-100">
            <Spin size="large" />
            <div className="text-gray-400 text-sm mt-3">
              Đang tải danh sách công dân...
            </div>
          </div>
        ) : records.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center shadow-sm border border-gray-100">
            <Empty description="Không có công dân nào phù hợp điều kiện lọc" />
          </div>
        ) : (
          records.map((record) => {
            const citizen = record.citizen || {};
            const isArrived = !!record.attendance?.arrived;
            const photoCount = record.activePhotos?.length || 0;
            const isRevealed = !!revealedCCCDs[citizen._id];
            const primaryPhoto = record.primaryPhoto;

            return (
              <div
                key={record._id}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:border-gray-200 transition-all flex flex-col gap-2.5"
              >
                {/* Top Row: Index Badge, Village & Date */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded text-[11px]">
                      STT: {citizen.idx || citizen.index || "---"}
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded text-[11px] border border-emerald-200/50">
                      Thôn: {record.village || citizen.village || "---"}
                    </span>
                  </div>
                  <span className="text-gray-400 text-[11px]">
                    Ngày: {formatDateDisplay(record.scheduledDate)}
                  </span>
                </div>

                {/* Middle Row: Name, CCCD, Thumbnail */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span
                      onClick={() => setSelectedDetailRecordId(record._id)}
                      className="text-lg font-bold text-gray-900 hover:text-emerald-700 line-clamp-1 cursor-pointer"
                    >
                      {citizen.fullName || "Chưa có tên"}
                    </span>

                    <div className="text-lg text-gray-500 mt-0.5 flex items-center gap-2">
                      <span>
                        Năm sinh: <b>{citizen.birthDate || "---"}</b>
                      </span>
                    </div>

                    <div className="text-lg text-gray-600 mt-1 flex items-center gap-1.5 font-mono">
                      <span>CCCD: {citizen._id}</span>
                    </div>

                    {/* Status Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {isArrived ? (
                        <Tag
                          color="success"
                          className="text-[11px] m-0 flex items-center gap-1"
                        >
                          <CheckCircleOutlined /> Đã đến
                          {record.attendance?.arrivedAt && (
                            <span className="text-[10px] opacity-80">
                              (
                              {new Date(
                                record.attendance.arrivedAt,
                              ).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              )
                            </span>
                          )}
                        </Tag>
                      ) : (
                        <Tag
                          color="default"
                          className="text-[11px] m-0 text-gray-500"
                        >
                          Chưa đến
                        </Tag>
                      )}

                      {photoCount > 0 ? (
                        <Tag color="processing" className="text-[11px] m-0">
                          Đã chụp ({photoCount})
                        </Tag>
                      ) : (
                        <Tag color="warning" className="text-[11px] m-0">
                          Chưa chụp ảnh
                        </Tag>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail with Ant Design Image Preview */}
                  <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center relative">
                    {primaryPhoto ? (
                      <Image.PreviewGroup
                        items={(record.activePhotos || [primaryPhoto]).map(
                          (p) =>
                            `/v1/api/exam-records/${record._id}/photos/${p.id}`,
                        )}
                      >
                        <Image
                          src={`/v1/api/exam-records/${record._id}/photos/${primaryPhoto.id}`}
                          alt={citizen.fullName || "Ảnh chính"}
                          width="100%"
                          height="100%"
                          className="!w-full !h-full !object-cover"
                          rootClassName="w-full h-full flex items-center justify-center"
                          preview={{
                            mask: (
                              <div className="text-[10px] text-white font-medium">
                                Xem
                              </div>
                            ),
                          }}
                        />
                      </Image.PreviewGroup>
                    ) : (
                      <div
                        onClick={() => setSelectedDetailRecordId(record._id)}
                        className="cursor-pointer text-center text-gray-300 w-full h-full flex flex-col items-center justify-center hover:bg-gray-200/50 transition-colors"
                        title="Chưa có ảnh, bấm để xem chi tiết"
                      >
                        <CameraOutlined className="text-2xl" />
                        <div className="text-[9px] mt-0.5">Chưa có</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* New Image Upload Section with 2 buttons */}
                <div className="bg-gray-50/80 p-2 rounded-lg border border-gray-100 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span className="font-semibold text-gray-700 flex items-center gap-1">
                      <CameraOutlined className="text-emerald-700" /> Tải ảnh
                      khám tuyển:
                    </span>
                    {photoCount > 0 && (
                      <span
                        onClick={() => setSelectedDetailRecordId(record._id)}
                        className="text-blue-600 hover:underline text-[11px] cursor-pointer"
                      >
                        Đã có {photoCount} ảnh
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="primary"
                      size="middle"
                      icon={<CameraOutlined />}
                      onClick={() => handleTriggerCamera(record._id)}
                      loading={
                        uploadingRecordId === record._id &&
                        uploadSource === "camera"
                      }
                      className="btn-army text-xs font-semibold"
                    >
                      Chụp ảnh máy
                    </Button>

                    <Button
                      size="middle"
                      icon={<PictureOutlined />}
                      onClick={() => handleTriggerLibrary(record._id)}
                      loading={
                        uploadingRecordId === record._id &&
                        uploadSource === "library"
                      }
                      className="text-xs font-semibold text-gray-700 hover:text-emerald-700 hover:border-emerald-700"
                    >
                      Chọn từ thư viện
                    </Button>
                  </div>
                </div>

                {/* Bottom Row: Quick Action Buttons for Attendance & Detail */}
                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <Button
                    type={isArrived ? "default" : "primary"}
                    size="middle"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleToggleAttendance(record)}
                    loading={isUpdatingAttendance}
                    className={
                      isArrived
                        ? "text-red-600 border-red-300 hover:bg-red-50 text-xs font-semibold flex-1"
                        : "btn-emerald text-xs font-semibold flex-1"
                    }
                  >
                    {isArrived ? "Hủy điểm danh" : "Điểm danh"}
                  </Button>

                  <Button
                    size="middle"
                    icon={<FileTextOutlined />}
                    onClick={() => setSelectedDetailRecordId(record._id)}
                    className="text-xs font-medium text-gray-700"
                  >
                    Chi tiết
                  </Button>
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        {paginate.totalPages > 1 && (
          <div className="flex justify-center pt-2">
            <Pagination
              current={page}
              pageSize={perPage}
              total={paginate.count}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
              size="small"
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

      {/* Citizen Detail Popup Modal */}
      <CitizenDetailModal
        ref={refDetailModal}
        recordId={selectedDetailRecordId}
        onClose={() => setSelectedDetailRecordId(null)}
      />
    </div>
  );
};

export default ExamRecordsHomePage;
