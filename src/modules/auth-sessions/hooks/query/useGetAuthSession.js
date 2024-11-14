import { getAuthSession } from "../../services/index";
import { useQuery } from "react-query";

const useGetAuthSession = (query) => {
  return useQuery({
    queryKey:["auth-sessions",query],
    queryFn:async () => {
      return await getAuthSession(query);
    }
  });
};

export default useGetAuthSession;
