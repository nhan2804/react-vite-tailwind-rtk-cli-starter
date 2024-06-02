import { updateStoreProject } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateStoreProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateStoreProject(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['store-projects'])
    }
  });
};

export default useUpdateStoreProject;
