import { get__name__(sentenceCase) } from "../../services/index";
import { useQuery } from "react-query";

const useGet__name__(sentenceCase) = (__params__query) => {
  return useQuery({
    queryKey:["__name__s",__params__query],
    queryFn:async () => {
      return await get__name__(sentenceCase)(__params__query);
    }
  });
};

export default useGet__name__(sentenceCase);
