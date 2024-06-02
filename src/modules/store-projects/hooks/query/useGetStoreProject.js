import { getStoreProject } from "../../services/index";
import { useQuery } from "react-query";

const useGetStoreProject = (query) => {
  return useQuery({
    queryKey:["store-projects",query],
    queryFn:async () => {
      return await getStoreProject(query);
    }
  });
};

export default useGetStoreProject;
