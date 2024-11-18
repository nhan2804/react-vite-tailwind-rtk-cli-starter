import { deleteBulkProject } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkProject(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['projects'])
    }
  });
};

export default useDeleteBulkProject;
