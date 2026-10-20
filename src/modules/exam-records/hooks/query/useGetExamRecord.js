import { getExamRecord } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useGetExamRecord = (query, options = {}) => {
  return useQuery({
    queryKey: ["exam-records", query],
    queryFn: async () => {
      return await getExamRecord(query);
    },
    ...options,
  });
};

export default useGetExamRecord;
