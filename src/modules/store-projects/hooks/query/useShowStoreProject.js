import { showStoreProject } from "../../services/index";
import { useQuery } from "react-query";

const useShowStoreProject = (query) => {
  return useQuery(["detail-store-projects",query], async () => {
    return await showStoreProject(query);
  });
};

export default useShowStoreProject;
