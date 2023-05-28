import { getTicket } from "../../services/index";
import { useQuery } from "react-query";

const useGetTicket = (query) => {
  return useQuery({
    queryKey:["tickets",query],
    queryFn:async () => {
      return await getTicket(query);
    }
  });
};

export default useGetTicket;
