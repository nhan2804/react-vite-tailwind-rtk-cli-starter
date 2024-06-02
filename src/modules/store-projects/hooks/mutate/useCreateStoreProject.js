import { createStoreProject } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useCreateStoreProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await createStoreProject(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['store-projects'])
    }
  });
};

export default useCreateStoreProject;
