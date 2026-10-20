import { setPrimaryPhoto } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useSetPrimaryPhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, photoId }) => {
      return await setPrimaryPhoto({ id, photoId });
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries(["exam-records"]);
      qc.invalidateQueries(["exam-records", variables.id]);
      toast.success("Đã chọn làm ảnh chính");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Đặt ảnh chính thất bại");
    },
  });
};

export default useSetPrimaryPhoto;
