import { createBulkProject } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkProject(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['projects'])
    }
  });
};

export default useCreateBulkProject;
