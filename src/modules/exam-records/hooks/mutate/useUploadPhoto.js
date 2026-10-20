import { uploadPhoto } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useUploadPhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file }) => {
      return await uploadPhoto({ id, file });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries(["exam-records"]);
      qc.invalidateQueries(["exam-records-summary"]);
      qc.invalidateQueries(["exam-records", variables.id]);
      toast.success("Tải ảnh lên thành công");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Tải ảnh thất bại");
    },
  });
};

export default useUploadPhoto;
