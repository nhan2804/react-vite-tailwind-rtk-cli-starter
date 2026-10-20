import { showCitizen } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useShowCitizen = (query) => {
  return useQuery(["detail-citizens",query], async () => {
    return await showCitizen(query);
  });
};

export default useShowCitizen;
