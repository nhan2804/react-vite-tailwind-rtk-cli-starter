import { deleteBulkCitizen } from "../../services/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteBulkCitizen = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn:async (formData) => {
      return await deleteBulkCitizen(formData);
    },
    onSuccess:()=>{
      qc.invalidateQueries(['citizens'])
    }
  });
};

export default useDeleteBulkCitizen;
