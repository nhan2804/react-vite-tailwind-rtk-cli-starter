import { restorePhoto } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useRestorePhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, photoId }) => {
      return await restorePhoto({ id, photoId });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries(["exam-records"]);
      qc.invalidateQueries(["exam-records-summary"]);
      qc.invalidateQueries(["exam-records-deleted-photos"]);
      qc.invalidateQueries(["exam-records", variables.id]);
      toast.success("Khôi phục ảnh thành công");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Khôi phục ảnh thất bại");
    },
  });
};

export default useRestorePhoto;
