import { show__name__(pascalCase) } from "../../services/index";
import { useQuery } from "react-query";

const useShow__name__(pascalCase) = (__params__query) => {
  return useQuery(["detail-__name__s",__params__query], async () => {
    return await show__name__(pascalCase)(__params__query);
  });
};

export default useShow__name__(pascalCase);
