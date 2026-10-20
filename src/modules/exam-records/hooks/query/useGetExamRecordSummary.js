import { getExamRecordSummary } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useGetExamRecordSummary = (query, options = {}) => {
  return useQuery({
    queryKey: ["exam-records-summary", query],
    queryFn: async () => {
      return await getExamRecordSummary(query);
    },
    enabled: !!query?.sessionId,
    ...options,
  });
};

export default useGetExamRecordSummary;
