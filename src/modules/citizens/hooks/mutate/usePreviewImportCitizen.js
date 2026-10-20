import { previewImportCitizen } from "../../services/index";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const usePreviewImportCitizen = () => {
  return useMutation({
    mutationFn: async (input) => {
      return await previewImportCitizen(input);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Kiểm tra dữ liệu import thất bại");
    },
  });
};

export default usePreviewImportCitizen;
