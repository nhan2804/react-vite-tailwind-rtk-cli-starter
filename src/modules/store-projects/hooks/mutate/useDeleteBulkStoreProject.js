import { deleteBulkStoreProject } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteBulkStoreProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkStoreProject(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['store-projects'])
    }
  });
};

export default useDeleteBulkStoreProject;
