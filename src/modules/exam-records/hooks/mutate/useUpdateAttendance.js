import { updateAttendance } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useUpdateAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, arrived }) => {
      return await updateAttendance({ id, arrived });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries(["exam-records"]);
      qc.invalidateQueries(["exam-records-summary"]);
      qc.invalidateQueries(["exam-records", variables.id]);
      toast.success(variables.arrived ? "Điểm danh thành công" : "Đã hủy điểm danh");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Cập nhật điểm danh thất bại");
    },
  });
};

export default useUpdateAttendance;
