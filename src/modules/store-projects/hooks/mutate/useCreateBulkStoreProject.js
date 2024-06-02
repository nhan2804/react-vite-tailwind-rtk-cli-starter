import { createBulkStoreProject } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateBulkStoreProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createBulkStoreProject(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['store-projects'])
    }
  });
};

export default useCreateBulkStoreProject;
