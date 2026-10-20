import { updateHealthExam } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useUpdateHealthExam = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      return await updateHealthExam({ id, ...payload });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries(["exam-records"]);
      qc.invalidateQueries(["exam-records-summary"]);
      qc.invalidateQueries(["exam-records", variables.id]);
      qc.invalidateQueries(["audit-logs"]);
      toast.success("Lưu kết quả khám sức khỏe thành công!");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Lưu kết quả khám sức khỏe thất bại"
      );
    },
  });
};

export default useUpdateHealthExam;
