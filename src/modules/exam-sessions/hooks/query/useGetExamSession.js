import { getExamSession } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useGetExamSession = (query) => {
  return useQuery({
    queryKey:["exam-sessions",query],
    queryFn:async () => {
      return await getExamSession(query);
    }
  });
};

export default useGetExamSession;
