import { showExamRecord } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useShowExamRecord = (id, options = {}) => {
  return useQuery({
    queryKey: ["exam-records", id],
    queryFn: async () => {
      return await showExamRecord(id);
    },
    enabled: !!id,
    ...options,
  });
};

export default useShowExamRecord;
