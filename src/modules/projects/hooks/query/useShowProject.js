import { showProject } from "@modules/projects/services";
import { useQuery } from "react-query";

const useShowProject = (projectId) => {
  return useQuery(
    ["show-project", projectId],
    async () => {
      const { data } = await showProject(projectId);
      return data?.payload;
    },
    {
      enabled: !!projectId,
    }
  );
};

export default useShowProject;
