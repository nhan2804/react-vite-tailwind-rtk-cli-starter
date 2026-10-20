import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Upload,
  message,
  Popconfirm,
  Alert,
  Card,
  Spin,
  Pagination,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  UndoOutlined,
  EyeOutlined,
  FileTextOutlined,
  HistoryOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import useSelectedSession from "@modules/exam-sessions/hooks/useSelectedSession";
import useCreateExamSession from "@modules/exam-sessions/hooks/mutate/useCreateExamSession";
import useActivateExamSession from "@modules/exam-sessions/hooks/mutate/useActivateExamSession";
import useDeleteExamSession from "@modules/exam-sessions/hooks/mutate/useDeleteExamSession";
import usePreviewImportCitizen from "@modules/citizens/hooks/mutate/usePreviewImportCitizen";
import useExecuteImportCitizen from "@modules/citizens/hooks/mutate/useExecuteImportCitizen";
import useGetDeletedPhotos from "../../hooks/query/useGetDeletedPhotos";
import useRestorePhoto from "../../hooks/mutate/useRestorePhoto";
import useGetAuditLog from "@modules/audit-logs/hooks/query/useGetAuditLog";

export const AdminManagementPage = () => {
  const navigate = useNavigate();
  const {
    sessions,
    selectedId: activeSessionId,
    selectSession,
    refetch: refetchSessions,
    isLoading: isSessionsLoading,
  } = useSelectedSession();

  const [activeTab, setActiveTab] = useState("sessions");

  // --- TAB 1: SESSIONS ---
  const [isCreateSessionModalOpen, setIsCreateSessionModalOpen] = useState(false);
  const [sessionForm] = Form.useForm();
  const { mutate: createSession, isLoading: isCreatingSession } = useCreateExamSession();
  const { mutate: activateSession, isLoading: isActivatingSession } = useActivateExamSession();
  const { mutate: deleteSession, isLoading: isDeletingSession } = useDeleteExamSession();

  const handleCreateSession = (values) => {
    createSession(
      {
        ...values,
        year: Number(values.year),
        isActive: false,
      },
      {
        onSuccess: () => {
          setIsCreateSessionModalOpen(false);
          sessionForm.resetFields();
          refetchSessions();
        },
      }
    );
  };

  // --- TAB 2: IMPORT JSON ---
  const [targetSessionId, setTargetSessionId] = useState("");
  const [targetYear, setTargetYear] = useState(new Date().getFullYear());
  const [targetMonth, setTargetMonth] = useState(new Date().getMonth() + 1);
  const [jsonText, setJsonText] = useState("");
  const [previewResult, setPreviewResult] = useState(null);
  const [importResult, setImportResult] = useState(null);

  const { mutate: previewImport, isLoading: isPreviewing } = usePreviewImportCitizen();
  const { mutate: executeImport, isLoading: isImporting } = useExecuteImportCitizen();

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setJsonText(e.target.result);
    };
    reader.readAsText(file);
    return false; // Prevent automatic upload
  };

  const handlePreviewImport = () => {
    if (!targetSessionId) {
      message.error("Vui lòng chọn phiên khám đích");
      return;
    }
    let parsedRecords;
    try {
      parsedRecords = JSON.parse(jsonText);
      if (!Array.isArray(parsedRecords)) {
        message.error("Dữ liệu JSON phải là một mảng [] các công dân");
        return;
      }
    } catch (err) {
      message.error("Cú pháp JSON không hợp lệ: " + err.message);
      return;
    }

    setImportResult(null);
    previewImport(
      {
        sessionId: targetSessionId,
        year: Number(targetYear),
        month: Number(targetMonth),
        records: parsedRecords,
      },
      {
        onSuccess: (data) => {
          setPreviewResult(data);
        },
      }
    );
  };

  const handleConfirmImport = () => {
    if (!previewResult) return;
    let parsedRecords = JSON.parse(jsonText);
    executeImport(
      {
        sessionId: targetSessionId,
        year: Number(targetYear),
        month: Number(targetMonth),
        records: parsedRecords,
      },
      {
        onSuccess: (data) => {
          setImportResult(data);
          setPreviewResult(null);
          setJsonText("");
        },
      }
    );
  };

  // --- TAB 3: TRASH MANAGEMENT ---
  const {
    data: deletedPhotos = [],
    isLoading: isDeletedLoading,
    refetch: refetchDeleted,
  } = useGetDeletedPhotos(activeSessionId, { enabled: activeTab === "trash" && !!activeSessionId });

  const { mutate: restorePhoto, isLoading: isRestoring } = useRestorePhoto();
  const [previewTrashPhotoUrl, setPreviewTrashPhotoUrl] = useState(null);

  // --- TAB 4: AUDIT LOGS ---
  const [auditPage, setAuditPage] = useState(1);
  const [auditActionFilter, setAuditActionFilter] = useState("");
  const { data: auditData, isLoading: isAuditLoading } = useGetAuditLog(
    {
      page: auditPage,
      perPage: 20,
      action: auditActionFilter || undefined,
    },
    { enabled: activeTab === "logs" }
  );

  const auditLogs = auditData?.data || [];
  const auditPaginate = auditData?.paginate || { count: 0, totalPages: 1 };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 space-y-3 pb-24">
      {/* Top Header */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
          className="font-medium text-gray-700"
        >
          Trang Khám Tuyển
        </Button>
        <span className="font-bold text-gray-800 text-sm sm:text-base">
          TRUNG TÂM QUẢN TRỊ & NHẬP LIỆU
        </span>
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={[
            {
              key: "sessions",
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <FolderOpenOutlined /> Phiên khám
                </span>
              ),
              children: (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      Danh sách các phiên khám nghĩa vụ
                    </span>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setIsCreateSessionModalOpen(true)}
                      className="bg-[#18392B] hover:bg-[#204e3b] text-xs font-semibold"
                    >
                      Tạo phiên khám mới
                    </Button>
                  </div>

                  <Table
                    loading={isSessionsLoading}
                    dataSource={sessions}
                    rowKey="_id"
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: "Tên phiên khám",
                        dataIndex: "name",
                        render: (name, record) => (
                          <div>
                            <div className="font-bold text-gray-900">{name}</div>
                            {record.description && (
                              <div className="text-xs text-gray-400">{record.description}</div>
                            )}
                          </div>
                        ),
                      },
                      {
                        title: "Năm",
                        dataIndex: "year",
                        width: 70,
                      },
                      {
                        title: "Giai đoạn",
                        dataIndex: "phase",
                        render: (phase) => (
                          <Tag color={phase === "preliminary" ? "blue" : "purple"}>
                            {phase === "preliminary" ? "Sơ tuyển" : "Chính thức"}
                          </Tag>
                        ),
                      },
                      {
                        title: "Nghĩa vụ",
                        dataIndex: "serviceType",
                        render: (type) => (
                          <Tag color={type === "military" ? "green" : "orange"}>
                            {type === "military" ? "Quân sự (NVQS)" : "Công an (NVCA)"}
                          </Tag>
                        ),
                      },
                      {
                        title: "Trạng thái",
                        dataIndex: "isActive",
                        render: (isActive) =>
                          isActive ? (
                            <Tag color="success" className="font-semibold">
                              Đang hoạt động
                            </Tag>
                          ) : (
                            <Tag color="default">Không hoạt động</Tag>
                          ),
                      },
                      {
                        title: "Thao tác",
                        render: (_, record) => (
                          <div className="flex items-center gap-2">
                            {!record.isActive && (
                              <Button
                                size="small"
                                type="primary"
                                onClick={() => activateSession(record._id)}
                                loading={isActivatingSession}
                                className="bg-emerald-600 hover:bg-emerald-500 text-xs"
                              >
                                Kích hoạt
                              </Button>
                            )}
                            <Popconfirm
                              title="Xóa phiên khám này?"
                              onConfirm={() => deleteSession(record._id)}
                              okText="Xóa"
                              cancelText="Hủy"
                              okType="danger"
                            >
                              <Button
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                loading={isDeletingSession}
                              />
                            </Popconfirm>
                          </div>
                        ),
                      },
                    ]}
                  />
                </div>
              ),
            },
            {
              key: "import",
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <UploadOutlined /> Nhập dữ liệu (JSON)
                </span>
              ),
              children: (
                <div className="space-y-4 pt-2">
                  <Alert
                    type="info"
                    showIcon
                    message="Quy tắc nhập dữ liệu công dân:"
                    description="CCCD là khóa chính (12 số). Trường 'day' trong file JSON sẽ được kết hợp với Tháng/Năm bạn chọn bên dưới để tạo ngày khám (YYYY-MM-DD). Việc import lại file sẽ an toàn và giữ nguyên điểm danh, ảnh chụp và ghi chú đã có."
                  />

                  {/* Import Configuration */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Phiên khám đích:
                      </label>
                      <Select
                        className="w-full"
                        placeholder="Chọn phiên khám"
                        value={targetSessionId || activeSessionId}
                        onChange={(val) => setTargetSessionId(val)}
                        options={sessions.map((s) => ({
                          value: s._id,
                          label: `${s.name} (${s.year})`,
                        }))}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Tháng khám:
                      </label>
                      <Select
                        className="w-full"
                        value={targetMonth}
                        onChange={(val) => setTargetMonth(val)}
                        options={Array.from({ length: 12 }, (_, i) => ({
                          value: i + 1,
                          label: `Tháng ${i + 1}`,
                        }))}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Năm khám:
                      </label>
                      <Input
                        type="number"
                        value={targetYear}
                        onChange={(e) => setTargetYear(e.target.value)}
                        placeholder="2025"
                      />
                    </div>
                  </div>

                  {/* File Upload or Paste JSON */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700">
                        Nội dung mảng JSON công dân:
                      </span>
                      <Upload
                        beforeUpload={handleFileUpload}
                        showUploadList={false}
                        accept=".json"
                      >
                        <Button size="small" icon={<UploadOutlined />}>
                          Tải lên tệp .json
                        </Button>
                      </Upload>
                    </div>

                    <Input.TextArea
                      rows={8}
                      value={jsonText}
                      onChange={(e) => setJsonText(e.target.value)}
                      placeholder='[ { "CCCD": "049206007063", "fullName": "Nguyễn Tiến Lợi", "day": 22, "village": "Phú Yên" ... } ]'
                      className="font-mono text-xs"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button
                      type="primary"
                      onClick={handlePreviewImport}
                      loading={isPreviewing}
                      disabled={!jsonText.trim()}
                      className="bg-[#18392B] hover:bg-[#204e3b] font-semibold"
                    >
                      Kiểm tra dữ liệu (Preview)
                    </Button>
                  </div>

                  {/* Preview Results */}
                  {previewResult && (
                    <Card
                      title={
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-800">
                            Kết quả kiểm tra trước khi Import
                          </span>
                          <Button
                            type="primary"
                            onClick={handleConfirmImport}
                            loading={isImporting}
                            className="bg-emerald-700 hover:bg-emerald-600 font-semibold"
                          >
                            Xác nhận Import vào hệ thống
                          </Button>
                        </div>
                      }
                      className="border border-emerald-300 bg-emerald-50/20"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="bg-white p-2 rounded border">
                          <div className="text-gray-500">Tổng dòng</div>
                          <div className="text-lg font-bold text-gray-900">
                            {previewResult.totalRows}
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded border border-green-200">
                          <div className="text-green-700 font-medium">Hợp lệ</div>
                          <div className="text-lg font-bold text-green-700">
                            {previewResult.validCount}
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded border border-red-200">
                          <div className="text-red-600 font-medium">Lỗi / Bị loại</div>
                          <div className="text-lg font-bold text-red-600">
                            {previewResult.invalidCount}
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <div className="text-blue-700 font-medium">Công dân mới</div>
                          <div className="text-lg font-bold text-blue-700">
                            {previewResult.newCitizensCount}
                          </div>
                        </div>
                      </div>

                      {previewResult.invalidCount > 0 && (
                        <div className="mt-3">
                          <div className="text-xs font-semibold text-red-700 mb-1">
                            Chi tiết các dòng bị lỗi:
                          </div>
                          <div className="max-h-40 overflow-y-auto bg-white p-2 rounded border border-red-200 text-xs text-red-600 space-y-1">
                            {previewResult.invalidRows.map((item, idx) => (
                              <div key={idx}>
                                • Dòng {item.index}: {item.error}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  )}

                  {/* Import Success Message */}
                  {importResult && (
                    <Alert
                      type="success"
                      showIcon
                      message="Import dữ liệu thành công!"
                      description={
                        <div className="text-xs space-y-0.5 mt-1">
                          <div>• Công dân thêm mới: <b>{importResult.importedCitizens}</b></div>
                          <div>• Công dân cập nhật: <b>{importResult.updatedCitizens}</b></div>
                          <div>• Hồ sơ khám tạo mới: <b>{importResult.createdRecords}</b></div>
                          <div>• Hồ sơ khám đã bảo lưu điểm danh/ảnh: <b>{importResult.preservedRecords}</b></div>
                        </div>
                      }
                    />
                  )}
                </div>
              ),
            },
            {
              key: "trash",
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <DeleteOutlined /> Thùng rác ảnh
                </span>
              ),
              children: (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">
                        Danh sách ảnh đã xóa trong phiên hiện tại
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        ({deletedPhotos.length} ảnh)
                      </span>
                    </div>
                    <Button size="small" onClick={() => refetchDeleted()}>
                      Làm mới
                    </Button>
                  </div>

                  {isDeletedLoading ? (
                    <div className="text-center py-8">
                      <Spin />
                    </div>
                  ) : deletedPhotos.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 border border-dashed rounded-xl">
                      Thùng rác trống. Không có ảnh nào bị xóa.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {deletedPhotos.map((item) => {
                        const trashUrl = `/v1/api/exam-records/${item.recordId}/photos/${item.photo.id}/trash`;

                        return (
                          <div
                            key={item.photo.id}
                            className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex flex-col"
                          >
                            <div
                              onClick={() => setPreviewTrashPhotoUrl(trashUrl)}
                              className="aspect-[3/4] cursor-pointer bg-black/10 overflow-hidden relative"
                            >
                              <img
                                src={trashUrl}
                                alt="Ảnh đã xóa"
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>

                            <div className="p-2 bg-white flex flex-col gap-1 text-xs border-t border-gray-100 flex-1 justify-between">
                              <div>
                                <div className="font-bold text-gray-900 line-clamp-1">
                                  {item.citizenName || item.citizenId}
                                </div>
                                <div className="text-[10px] text-gray-400">
                                  Xóa: {new Date(item.photo.deletedAt).toLocaleString("vi-VN")}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  Bởi: {item.photo.deletedBy || "---"}
                                </div>
                              </div>

                              <Button
                                size="small"
                                type="primary"
                                icon={<UndoOutlined />}
                                onClick={() =>
                                  restorePhoto(
                                    { id: item.recordId, photoId: item.photo.id },
                                    { onSuccess: () => refetchDeleted() }
                                  )
                                }
                                loading={isRestoring}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-xs mt-1"
                              >
                                Khôi phục
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: "logs",
              label: (
                <span className="flex items-center gap-1.5 font-medium">
                  <HistoryOutlined /> Nhật ký thao tác
                </span>
              ),
              children: (
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Toàn bộ nhật ký kiểm toán hệ thống
                    </span>

                    <Select
                      className="w-48 text-xs"
                      placeholder="Lọc theo hành động"
                      allowClear
                      value={auditActionFilter || undefined}
                      onChange={(val) => {
                        setAuditActionFilter(val);
                        setAuditPage(1);
                      }}
                      options={[
                        { value: "attendance.check_in", label: "Điểm danh đến" },
                        { value: "attendance.undo", label: "Hủy điểm danh" },
                        { value: "photo.upload", label: "Tải ảnh lên" },
                        { value: "photo.delete", label: "Xóa ảnh" },
                        { value: "photo.restore", label: "Khôi phục ảnh" },
                        { value: "photo.set_primary", label: "Đặt ảnh chính" },
                        { value: "record.note_update", label: "Cập nhật ghi chú" },
                        { value: "citizen.import", label: "Import công dân" },
                      ]}
                    />
                  </div>

                  <Table
                    loading={isAuditLoading}
                    dataSource={auditLogs}
                    rowKey="_id"
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: "Thời gian",
                        dataIndex: "createdAt",
                        width: 150,
                        render: (t) => new Date(t).toLocaleString("vi-VN"),
                      },
                      {
                        title: "Hành động",
                        dataIndex: "action",
                        render: (act) => {
                          const map = {
                            "attendance.check_in": { text: "Điểm danh đến", color: "green" },
                            "attendance.undo": { text: "Hủy điểm danh", color: "red" },
                            "photo.upload": { text: "Tải ảnh", color: "blue" },
                            "photo.delete": { text: "Xóa ảnh", color: "volcano" },
                            "photo.restore": { text: "Khôi phục ảnh", color: "cyan" },
                            "photo.set_primary": { text: "Đặt ảnh chính", color: "gold" },
                            "record.note_update": { text: "Cập nhật ghi chú", color: "purple" },
                            "citizen.import": { text: "Import công dân", color: "geekblue" },
                          };
                          const info = map[act] || { text: act, color: "default" };
                          return <Tag color={info.color}>{info.text}</Tag>;
                        },
                      },
                      {
                        title: "Người thực hiện",
                        dataIndex: "actorName",
                        render: (name, rec) => name || rec.actorId || "Hệ thống",
                      },
                      {
                        title: "Mã đối tượng",
                        dataIndex: "entityId",
                        render: (id, rec) => (
                          <span className="font-mono text-xs">{id} ({rec.entityType})</span>
                        ),
                      },
                    ]}
                  />

                  {auditPaginate.totalPages > 1 && (
                    <div className="flex justify-center pt-2">
                      <Pagination
                        current={auditPage}
                        pageSize={20}
                        total={auditPaginate.count}
                        onChange={(p) => setAuditPage(p)}
                        size="small"
                      />
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Modal Create Session */}
      <Modal
        open={isCreateSessionModalOpen}
        onCancel={() => setIsCreateSessionModalOpen(false)}
        title="Tạo phiên khám tuyển mới"
        onOk={() => sessionForm.submit()}
        confirmLoading={isCreatingSession}
        okText="Tạo phiên"
        cancelText="Hủy"
      >
        <Form form={sessionForm} layout="vertical" onFinish={handleCreateSession}>
          <Form.Item
            name="name"
            label="Tên phiên khám"
            rules={[{ required: true, message: "Vui lòng nhập tên phiên khám" }]}
          >
            <Input placeholder="Ví dụ: Khám sơ tuyển NVQS 2027" />
          </Form.Item>

          <Form.Item
            name="year"
            label="Năm"
            initialValue={new Date().getFullYear()}
            rules={[{ required: true, message: "Vui lòng nhập năm" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="phase"
            label="Giai đoạn khám"
            initialValue="preliminary"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "preliminary", label: "Khám sơ tuyển" },
                { value: "official", label: "Khám chính thức" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="serviceType"
            label="Loại nghĩa vụ"
            initialValue="military"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "military", label: "Nghĩa vụ quân sự (NVQS)" },
                { value: "police", label: "Nghĩa vụ công an (NVCA)" },
              ]}
            />
          </Form.Item>

          <Form.Item name="description" label="Mô tả thêm">
            <Input.TextArea rows={2} placeholder="Ghi chú thêm về địa điểm, đợt khám..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Fullscreen Photo Lightbox Modal for Trash */}
      <Modal
        open={!!previewTrashPhotoUrl}
        footer={null}
        onCancel={() => setPreviewTrashPhotoUrl(null)}
        centered
        width={600}
        bodyStyle={{ padding: 0, backgroundColor: "black" }}
      >
        {previewTrashPhotoUrl && (
          <img
            src={previewTrashPhotoUrl}
            alt="Xem ảnh thùng rác"
            className="w-full h-auto max-h-[85vh] object-contain mx-auto"
          />
        )}
      </Modal>
    </div>
  );
};

export default AdminManagementPage;
