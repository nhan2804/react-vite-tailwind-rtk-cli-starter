import { deleteCitizen } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteCitizen = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (_id) => {
      return await deleteCitizen(_id);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['citizens'])
    }
  });
};

export default useDeleteCitizen;
