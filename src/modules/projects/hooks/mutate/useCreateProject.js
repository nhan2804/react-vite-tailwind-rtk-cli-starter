import { createProject } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createProject(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['projects'])
    }
  });
};

export default useCreateProject;
