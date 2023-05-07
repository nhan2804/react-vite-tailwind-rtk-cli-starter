import { createProject } from "@modules/projects/services";
import { useMutation, useQueryClient } from "react-query";

const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await createProject(formData);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries(["projects"]);
    },
  });
};

export default useCreateProject;
