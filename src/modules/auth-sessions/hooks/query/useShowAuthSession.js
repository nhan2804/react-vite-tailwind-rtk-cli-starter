import { showAuthSession } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useShowAuthSession = (query) => {
  return useQuery({
    queryKey: ["detail-auth-sessions", query],

    queryFn: async () => {
      return await showAuthSession(query);
    }
  });
};

export default useShowAuthSession;
