import { updateProject } from "@modules/projects/services";
import { useMutation, useQueryClient } from "react-query";

const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ formData, _id }) => {
      const { data } = await updateProject(_id || formData?._id, formData);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries(["projects"]);
    },
  });
};

export default useUpdateProject;
