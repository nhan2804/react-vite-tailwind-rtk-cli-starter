import { updateProject } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ _id, formData }) => {
      return await updateProject(_id, formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["projects"]
      });
    },
  });
};

export default useUpdateProject;
