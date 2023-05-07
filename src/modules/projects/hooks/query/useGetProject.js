import { fetchProject } from "@modules/projects/services";
import { useQuery } from "react-query";

const useGetProject = () => {
  return useQuery(["projects"], async () => {
    const { data } = await fetchProject();
    return data;
  });
};

export default useGetProject;
