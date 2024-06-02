import { deleteStoreProject } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteStoreProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteStoreProject(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['store-projects'])
    }
  });
};

export default useDeleteStoreProject;
