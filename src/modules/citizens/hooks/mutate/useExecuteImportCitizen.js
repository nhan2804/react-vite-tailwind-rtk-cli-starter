import { executeImportCitizen } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useExecuteImportCitizen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      return await executeImportCitizen(input);
    },
    onSuccess: () => {
      qc.invalidateQueries(["citizens"]);
      qc.invalidateQueries(["exam-records"]);
      qc.invalidateQueries(["exam-records-summary"]);
      toast.success("Import dữ liệu công dân thành công");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Import công dân thất bại");
    },
  });
};

export default useExecuteImportCitizen;
