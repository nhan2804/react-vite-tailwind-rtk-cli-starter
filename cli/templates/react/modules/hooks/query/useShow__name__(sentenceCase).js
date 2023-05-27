import { show__name__(sentenceCase) } from "../../services/index";
import { useQuery } from "react-query";

const useShow__name__(sentenceCase) = (query) => {
  return useQuery(["detail-__name__s", query], async () => {
    return await show__name__(sentenceCase)(query);
  });
};

export default useShow__name__(sentenceCase);
