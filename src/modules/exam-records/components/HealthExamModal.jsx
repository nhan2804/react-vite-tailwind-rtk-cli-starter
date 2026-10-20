import React, { useState, useEffect, useImperativeHandle, forwardRef, useMemo } from "react";
import {
  Modal,
  Button,
  Input,
  InputNumber,
  Tag,
  Radio,
  Space,
  Divider,
  Alert,
} from "antd";
import {
  HeartFilled,
  HeartOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  MedicineBoxOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import useUpdateHealthExam from "../hooks/mutate/useUpdateHealthExam";

const { TextArea } = Input;

const SUGGESTED_EXEMPT_REASONS = [
  "Bệnh tâm thần",
  "Khuyết tật đặc biệt nặng",
  "Nhiễm chất độc da cam",
  "Bệnh hiểm nghèo",
  "Dị tật, dị dạng bẩm sinh",
  "Suy giảm khả năng lao động > 61%",
];

export const HealthExamModal = (
  { record: externalRecord, recordId: externalRecordId, open: externalOpen, onClose: externalOnClose },
  ref
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // Form states
  const [height, setHeight] = useState(null); // Cao (cm)
  const [weight, setWeight] = useState(null); // cân nặng (kg)
  const [chest, setChest] = useState(null); // vòng ngực trung bình (cm)
  const [healthStatus, setHealthStatus] = useState(""); // Tình trạng sức khỏe và bệnh tật
  const [qualification, setQualification] = useState(null); // 'qualified' | 'disqualified' | null
  const [exemptCategory, setExemptCategory] = useState(""); // Thuộc diện miễn làm NVQS
  const [otherReason, setOtherReason] = useState(""); // Lý do khác (ghi cụ thể)
  const [healthNote, setHealthNote] = useState(""); // Ghi chú sức khỏe

  const { mutate: updateHealthExam, isLoading: isSubmitting } = useUpdateHealthExam();

  // Initialize form from a record object
  const initForm = (rec) => {
    setCurrentRecord(rec);
    const h = rec?.healthExam || {};
    const phys = h.physical || {};

    setHeight(phys.height ?? null);
    setWeight(phys.weight ?? null);
    setChest(phys.chest ?? null);
    setHealthStatus(h.healthStatus || "");

    if (h.isQualified === true) {
      setQualification("qualified");
    } else if (h.isDisqualified === true) {
      setQualification("disqualified");
    } else {
      setQualification(null);
    }

    setExemptCategory(h.exemptCategory || "");
    setOtherReason(h.otherReason || "");
    setHealthNote(h.healthNote || "");
  };

  // Sync with external props
  useEffect(() => {
    if (externalOpen !== undefined) {
      setIsOpen(externalOpen);
    }
  }, [externalOpen]);

  useEffect(() => {
    if (externalRecord) {
      initForm(externalRecord);
    }
  }, [externalRecord]);

  // Imperative handle for ref
  useImperativeHandle(ref, () => ({
    open: (rec) => {
      if (rec) {
        initForm(rec);
      }
      setIsOpen(true);
    },
    close: () => {
      setIsOpen(false);
      externalOnClose?.();
    },
  }));

  const handleClose = () => {
    setIsOpen(false);
    externalOnClose?.();
  };

  // BMI Calculation
  const bmiInfo = useMemo(() => {
    if (!height || !weight || height <= 0 || weight <= 0) return null;
    const hMeter = height / 100;
    const val = (weight / (hMeter * hMeter)).toFixed(1);
    const n = Number(val);
    let category = "Bình thường";
    let color = "success";
    if (n < 18.5) {
      category = "Thiếu cân / Gầy";
      color = "warning";
    } else if (n >= 18.5 && n < 23) {
      category = "Thể lực tốt / Chuẩn";
      color = "success";
    } else if (n >= 23 && n < 25) {
      category = "Tiền béo phì";
      color = "processing";
    } else {
      category = "Thừa cân / Béo phì";
      color = "error";
    }
    return { value: val, category, color };
  }, [height, weight]);

  const handleSave = () => {
    const recordId = currentRecord?._id || externalRecordId;
    if (!recordId) return;

    const isQualified = qualification === "qualified";
    const isDisqualified = qualification === "disqualified";

    const payload = {
      id: recordId,
      physical: {
        height: height !== null && height !== "" ? Number(height) : null,
        weight: weight !== null && weight !== "" ? Number(weight) : null,
        chest: chest !== null && chest !== "" ? Number(chest) : null,
      },
      healthStatus: healthStatus || "",
      isQualified: qualification ? isQualified : null,
      isDisqualified: qualification ? isDisqualified : null,
      exemptCategory: isDisqualified ? (exemptCategory || "") : "",
      otherReason: isDisqualified ? (otherReason || "") : "",
      healthNote: healthNote || "",
    };

    updateHealthExam(payload, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const citizen = currentRecord?.citizen || {};

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      destroyOnClose
      width={560}
      title={
        <div className="flex items-center gap-2 pr-4 text-emerald-900">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 text-base">
            <MedicineBoxOutlined />
          </div>
          <div>
            <div className="font-bold text-base text-gray-900 leading-tight">
              Khám sức khỏe sơ tuyển NVQS
            </div>
            <div className="text-xs text-gray-500 font-normal mt-0.5">
              Nhập và tổng hợp thông tin thể lực & điều kiện sức khỏe
            </div>
          </div>
        </div>
      }
    >
      <div className="max-h-[75vh] overflow-y-auto pr-1 space-y-4 pt-1">
        {/* Citizen Quick Header */}
        <div className="bg-emerald-50/70 border border-emerald-100/80 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <span>{citizen.fullName || currentRecord?.citizenName || "Công dân"}</span>
              <span className="text-[11px] bg-white border border-emerald-200 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                STT: {citizen.idx || citizen.index || "---"}
              </span>
            </div>
            <div className="text-xs text-emerald-800 mt-1 flex flex-wrap items-center gap-2">
              <span>Năm sinh: <b>{citizen.birthDate || "---"}</b></span>
              <span>•</span>
              <span>Thôn: <b>{currentRecord?.village || citizen.village || "---"}</b></span>
              <span>•</span>
              <span>CCCD: <b className="font-mono">{citizen._id || "---"}</b></span>
            </div>
          </div>
        </div>

        {/* Section 1: Thể lực */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
              <ThunderboltOutlined className="text-amber-500" />
              1. Thể lực
            </div>
            {bmiInfo && (
              <Tag color={bmiInfo.color} className="text-xs font-semibold m-0 px-2 py-0.5 rounded-full">
                BMI: {bmiInfo.value} ({bmiInfo.category})
              </Tag>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cao (cm) <span className="text-red-500">*</span>
              </label>
              <InputNumber
                className="w-full rounded-lg"
                min={100}
                max={250}
                precision={1}
                step={0.5}
                placeholder="VD: 168"
                value={height}
                onChange={(val) => setHeight(val)}
                addonAfter="cm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cân nặng (kg) <span className="text-red-500">*</span>
              </label>
              <InputNumber
                className="w-full rounded-lg"
                min={30}
                max={200}
                precision={1}
                step={0.5}
                placeholder="VD: 60"
                value={weight}
                onChange={(val) => setWeight(val)}
                addonAfter="kg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Vòng ngực TB (cm)
              </label>
              <InputNumber
                className="w-full rounded-lg"
                min={50}
                max={150}
                precision={1}
                step={0.5}
                placeholder="VD: 82"
                value={chest}
                onChange={(val) => setChest(val)}
                addonAfter="cm"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Tình trạng sức khỏe và bệnh tật */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 space-y-2 shadow-xs">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide">
            2. Tình trạng sức khỏe và bệnh tật
          </label>
          <TextArea
            rows={2}
            className="rounded-lg text-xs"
            placeholder="Ghi nhận tình trạng sức khỏe hiện tại, tiền sử bệnh, dị tật nếu có..."
            value={healthStatus}
            onChange={(e) => setHealthStatus(e.target.value)}
          />
        </div>

        {/* Section 3: Kết luận điều kiện sức khỏe NVQS */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 space-y-3 shadow-xs">
          <div className="text-xs font-bold text-gray-900 uppercase tracking-wide">
            3. Phân loại điều kiện khám NVQS
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Option 1: Đủ điều kiện */}
            <button
              type="button"
              onClick={() =>
                setQualification(qualification === "qualified" ? null : "qualified")
              }
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                qualification === "qualified"
                  ? "border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20"
                  : "border-gray-200 hover:border-gray-300 bg-gray-50/50 text-gray-700"
              }`}
            >
              <CheckCircleFilled
                className={`text-lg mt-0.5 ${
                  qualification === "qualified" ? "text-emerald-600" : "text-gray-300"
                }`}
              />
              <div>
                <div className="font-bold text-xs leading-snug">
                  Đủ điều kiện sức khỏe khám NVQS
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Đạt chỉ số thể lực và sức khỏe cho kỳ khám tuyển
                </div>
              </div>
            </button>

            {/* Option 2: Không đủ điều kiện */}
            <button
              type="button"
              onClick={() =>
                setQualification(qualification === "disqualified" ? null : "disqualified")
              }
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                qualification === "disqualified"
                  ? "border-rose-600 bg-rose-50/80 text-rose-950 shadow-sm ring-2 ring-rose-500/20"
                  : "border-gray-200 hover:border-gray-300 bg-gray-50/50 text-gray-700"
              }`}
            >
              <CloseCircleFilled
                className={`text-lg mt-0.5 ${
                  qualification === "disqualified" ? "text-rose-600" : "text-gray-300"
                }`}
              />
              <div>
                <div className="font-bold text-xs leading-snug">
                  Không đủ điều kiện sức khỏe khám NVQS
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Không đạt tiêu chuẩn hoặc thuộc diện miễn/hoãn
                </div>
              </div>
            </button>
          </div>

          {/* Conditional Sub-fields when "Không đủ điều kiện sức khỏe khám NVQS" is selected */}
          {qualification === "disqualified" && (
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 space-y-3 animate-fadeIn">
              <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <InfoCircleOutlined className="text-rose-600" />
                Chi tiết lý do không đủ điều kiện
              </div>

              {/* Field 1: Thuộc diện miễn làm NVQS */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Thuộc diện miễn làm NVQS
                </label>
                <Input
                  className="rounded-lg text-xs"
                  placeholder="VD: Bệnh hiểm nghèo, khuyết tật, tâm thần..."
                  value={exemptCategory}
                  onChange={(e) => setExemptCategory(e.target.value)}
                />

                {/* Quick suggestions chips */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="text-[10px] text-gray-500 mr-1 self-center">
                    Gợi ý nhanh:
                  </span>
                  {SUGGESTED_EXEMPT_REASONS.map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setExemptCategory(reason)}
                      className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                        exemptCategory === reason
                          ? "bg-rose-600 text-white border-rose-600 font-semibold"
                          : "bg-white text-gray-700 border-gray-200 hover:border-rose-400"
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 2: Lý do khác (ghi cụ thể) */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  Lý do khác (ghi cụ thể)
                </label>
                <TextArea
                  rows={2}
                  className="rounded-lg text-xs"
                  placeholder="Ghi rõ lý do thể lực không đạt, bệnh lý cụ thể, tật khúc xạ..."
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Ghi chú sức khỏe */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 space-y-2 shadow-xs">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wide">
            4. Ghi chú sức khỏe
          </label>
          <TextArea
            rows={2}
            className="rounded-lg text-xs"
            placeholder="Ghi chú thêm của bác sĩ hoặc hội đồng sơ tuyển..."
            value={healthNote}
            onChange={(e) => setHealthNote(e.target.value)}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
        <Button onClick={handleClose} disabled={isSubmitting}>
          Đóng
        </Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={isSubmitting}
          className="btn-emerald font-semibold text-white px-5"
        >
          Lưu kết quả khám
        </Button>
      </div>
    </Modal>
  );
};

export default forwardRef(HealthExamModal);
