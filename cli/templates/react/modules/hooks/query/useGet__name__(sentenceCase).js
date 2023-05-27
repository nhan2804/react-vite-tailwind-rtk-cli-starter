import { get__name__(sentenceCase) } from "../../services/index";
import { useQuery } from "react-query";

const useGet__name__(sentenceCase) = (query) => {
  return useQuery({
    queryKey:["__name__s", query],
    queryFn:async () => {
      return await get__name__(sentenceCase)(query);
    }
  });
};

export default useGet__name__(sentenceCase);
