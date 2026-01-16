import { deleteProject } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_id) => {
      return await deleteProject(_id);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["projects"]
      });
    },
  });
};

export default useDeleteProject;
