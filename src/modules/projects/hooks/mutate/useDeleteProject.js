import { deleteProject } from "../../services/index";
import { useMutation, useQueryClient } from "react-query";

const useDeleteProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteProject(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['projects'])
    }
  });
};

export default useDeleteProject;
