import { showExamSession } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useShowExamSession = (query) => {
  return useQuery(["detail-exam-sessions",query], async () => {
    return await showExamSession(query);
  });
};

export default useShowExamSession;
