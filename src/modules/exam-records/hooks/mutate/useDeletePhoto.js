import { deletePhoto } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useDeletePhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, photoId }) => {
      return await deletePhoto({ id, photoId });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries(["exam-records"]);
      qc.invalidateQueries(["exam-records-summary"]);
      qc.invalidateQueries(["exam-records-deleted-photos"]);
      qc.invalidateQueries(["exam-records", variables.id]);
      toast.success("Đã chuyển ảnh vào thùng rác");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Xóa ảnh thất bại");
    },
  });
};

export default useDeletePhoto;
