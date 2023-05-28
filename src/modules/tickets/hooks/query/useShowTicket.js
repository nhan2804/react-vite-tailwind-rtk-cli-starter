import { showTicket } from "../../services/index";
import { useQuery } from "react-query";

const useShowTicket = (query) => {
  return useQuery(["detail-tickets",query], async () => {
    return await showTicket(query);
  });
};

export default useShowTicket;
