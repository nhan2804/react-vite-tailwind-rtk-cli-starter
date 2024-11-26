import { showProject } from "../../services/index";
import { useQuery } from "react-query";

const useShowProject = (query) => {
  return useQuery(
    ["detail-projects", query],
    async () => {
      return await showProject(query);
    },
    {
      enabled: !!query,
    }
  );
};

export default useShowProject;
