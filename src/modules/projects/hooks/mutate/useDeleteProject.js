import { deleteProject } from "@modules/projects/services";
import { useMutation, useQueryClient } from "react-query";

const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ _id }) => {
      const { data } = await deleteProject(_id);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries(["projects"]);
    },
  });
};

export default useDeleteProject;
