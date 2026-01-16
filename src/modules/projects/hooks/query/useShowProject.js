import { showProject } from "../../services/index";
import { useQuery } from "@tanstack/react-query";

const useShowProject = (query) => {
  return useQuery({
    queryKey: ["detail-projects", query],

    queryFn: async () => {
      return await showProject(query);
    }
  });
};

export default useShowProject;
