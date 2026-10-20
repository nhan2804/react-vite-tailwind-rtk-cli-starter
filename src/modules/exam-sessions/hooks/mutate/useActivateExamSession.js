import { activateExamSession } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useActivateExamSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return await activateExamSession(id);
    },
    onSuccess: () => {
      qc.invalidateQueries(["exam-sessions"]);
      toast.success("Kích hoạt phiên khám thành công");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Kích hoạt phiên khám thất bại");
    },
  });
};

export default useActivateExamSession;
