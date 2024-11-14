import { showAuthSession } from "../../services/index";
import { useQuery } from "react-query";

const useShowAuthSession = (query) => {
  return useQuery(["detail-auth-sessions",query], async () => {
    return await showAuthSession(query);
  });
};

export default useShowAuthSession;
