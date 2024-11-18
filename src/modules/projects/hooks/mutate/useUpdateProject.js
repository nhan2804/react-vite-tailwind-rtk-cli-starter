import { updateProject } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useUpdateProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async ({_id,formData}) => {
      return await updateProject(_id,formData);
    },
    onSuccess:()=>{
      
      qc.invalidateQueries(['projects'])
    }
  });
};

export default useUpdateProject;
