import { getProject } from "../../services/index";
import { useQuery } from "react-query";

const useGetProject = (query) => {
  return useQuery({
    queryKey:["projects",query],
    queryFn:async () => {
      return await getProject(query);
    }
  });
};

export default useGetProject;
