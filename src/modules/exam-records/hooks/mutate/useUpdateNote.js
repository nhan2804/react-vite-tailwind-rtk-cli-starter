import { updateNote } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useUpdateNote = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }) => {
      return await updateNote({ id, note });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries(["exam-records"]);
      qc.invalidateQueries(["exam-records", variables.id]);
      toast.success("Lưu ghi chú thành công");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Lưu ghi chú thất bại");
    },
  });
};

export default useUpdateNote;
