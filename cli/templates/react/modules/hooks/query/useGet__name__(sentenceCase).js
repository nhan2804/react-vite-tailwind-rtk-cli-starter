import { get__name__(sentenceCase) } from "../../services/index";
import { useQuery } from "react-query";

const useGet__name__(sentenceCase) = (query) => {
  return useQuery(["__name__s", query], async () => {
    return await get__name__(sentenceCase)(query);
  });
};

export default useGet__name__(sentenceCase);
